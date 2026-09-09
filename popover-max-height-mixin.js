/**
 * Margin kept between the popover and the edge it opens toward.
 * Covers tippy's `popoverOffset` (4px) + popper's `boundaryPadding` (8px) + slack.
 */
const EDGE_MARGIN = 16;

/**
 * Below this the boundary is treated as unusable and the popover is left uncapped: showing it
 * overflowing is far better than collapsing it to nothing.
 */
const MIN_USABLE_HEIGHT = 120;

/**
 * Sizes a `popover` type select dialog to the space actually left around its trigger, and opens
 * it on whichever side has more room.
 *
 * ## Why
 * The dialogs hard-code `--dw-popover-max-height` as a constant fraction of the viewport, which
 * has no relation to where the trigger sits. The popover therefore regularly asks for more room
 * than a side has, and popper's `preventOverflow` (`altAxis: true`, `tether: false`) then slides
 * it along the vertical axis until it sits on top of the input.
 *
 * ## Boundary
 * Usually the screen — but only when the popover can actually reach it. A popover left inside
 * the select's shadow root is clipped by any scrollable ancestor (a dialog's
 * `.mdc-dialog__surface`, for instance), so the viewport is intersected with those ancestors.
 * With `appendTo: document.body` the walk starts at `body` and finds none, giving the full
 * screen. `body` / `html` are skipped, as popper skips them too.
 *
 * Implementation Notes:
 *  - The value is written on `_renderRootEl`, not on the host: tippy moves that node into the
 *    popper, so it is the only one whose custom properties still reach
 *    `#popover_dialog__surface` once mounted.
 *  - Runs on the `opened` -> `true` transition, before `dw-popover-dialog` initialises tippy, so
 *    the first paint is already correct.
 */
export const PopoverMaxHeightMixin = base =>
  class extends base {
    willUpdate(props) {
      super.willUpdate(props);

      if (props.has('opened') && this.opened) {
        this._setPopoverMaxHeight();
      }
    }

    /**
     * Picks the placement and writes the max-height for the chosen side.
     * @protected
     */
    _setPopoverMaxHeight() {
      if (this.type !== 'popover' || !this.triggerElement || !this._renderRootEl) {
        return;
      }

      const rect = this.triggerElement.getBoundingClientRect();

      // With `showTrigger` false the popover is drawn over the trigger on purpose
      // (offset = -triggerHeight), so it starts at the trigger's opposite edge.
      const anchorTop = this.showTrigger ? rect.top : rect.bottom;
      const anchorBottom = this.showTrigger ? rect.bottom : rect.top;

      const bounds = this._popoverBounds();
      const spaceAbove = anchorTop - bounds.top - EDGE_MARGIN;
      const spaceBelow = bounds.bottom - anchorBottom - EDGE_MARGIN;
      const openUpwards = spaceBelow < spaceAbove;

      this.popoverPlacement = openUpwards ? 'top-start' : 'bottom-start';

      const available = Math.floor(Math.max(openUpwards ? spaceAbove : spaceBelow, 0));
      if (available < MIN_USABLE_HEIGHT) {
        // Nothing usable on either side. Leaving the popover uncapped lets it overflow, which is
        // recoverable; capping it here would collapse it to nothing, which is not.
        this._renderRootEl.style.removeProperty('--dw-popover-available-height');
        return;
      }

      // Published as its own property, not written over `--dw-popover-max-height`: the surface
      // takes the `min()` of the two, so a max-height the integrator set explicitly still wins and
      // may be expressed in any unit (px, vh, calc()).
      this._renderRootEl.style.setProperty('--dw-popover-available-height', `${available}px`);
    }

    /**
     * Rect the popover has to stay inside.
     *
     * The popover is absolutely positioned, so a scrollable ancestor clips it only when that
     * ancestor is - or contains - the popover's containing block. Walking upwards, clipping
     * ancestors found before the containing block are descendants of it and cannot clip it, so
     * they are ignored; the containing block itself and everything above it applies. Without this
     * a short `overflow: hidden` wrapper the popover visually escapes (a toolbar, a
     * `hisab-surface`) would wrongly collapse the available height.
     *
     * Crosses shadow boundaries via the flat tree; `body` / `html` are skipped, as popper skips
     * them too.
     * @returns {{top: Number, bottom: Number}}
     * @protected
     */
    _popoverBounds() {
      const bounds = { top: 0, bottom: window.innerHeight };
      const appendTo = this.appendTo && this.appendTo !== 'parent' ? this.appendTo : this.triggerElement?.parentNode;

      let node = appendTo;
      let reachedContainingBlock = false;

      while (node) {
        if (node.nodeType === Node.ELEMENT_NODE && node !== document.body && node !== document.documentElement) {
          const style = getComputedStyle(node);

          reachedContainingBlock = reachedContainingBlock || this._establishesContainingBlock(style);

          const { overflowY } = style;
          if (reachedContainingBlock && overflowY && overflowY !== 'visible' && overflowY !== 'clip') {
            const rect = node.getBoundingClientRect();
            bounds.top = Math.max(bounds.top, rect.top);
            bounds.bottom = Math.min(bounds.bottom, rect.bottom);
          }
        }
        node = node.assignedSlot || node.parentNode || node.host;
      }

      return bounds;
    }

    /**
     * Whether an element with the given computed style is a containing block for absolutely
     * positioned descendants.
     * @param {CSSStyleDeclaration} style
     * @returns {Boolean}
     * @protected
     */
    _establishesContainingBlock(style) {
      return (
        style.position !== 'static' ||
        style.transform !== 'none' ||
        style.perspective !== 'none' ||
        style.filter !== 'none' ||
        style.contain === 'paint' ||
        /transform|perspective|filter/.test(style.willChange)
      );
    }
  };
