import { css, html, LitElement, nothing } from '@dreamworld/pwa-helpers/lit.js';
import { isElementAlreadyRegistered } from '@dreamworld/pwa-helpers/utils.js';
import DeviceInfo from '@dreamworld/device-info';

// View Elements
import { DwFormElement } from '@dreamworld/dw-form/dw-form-element.js';
import './dw-multi-select-base-dialog.js';
import './dw-multi-select-trigger.js';
import '@dreamworld/dw-tooltip';
import '@dreamworld/dw-icon-button';
import '@dreamworld/dw-icon';

// Lodash Methods
import { find, debounce, isEqual } from 'lodash-es';

// Styles
import { caption, subtitle1, headline6 } from '@dreamworld/material-styles/typography-literals.js';

// Utils
import { NEW_VALUE_STATUS } from './utils';
import { filter, KeyCode } from './utils.js';

/**
 *  TODO - update documentation
 *
 * A Select is an input widget with an associated dropdown that allows users to select a value from a list of possible values.
 *
 * ## Types of Select
 *
 * ### Default
 *  - Sometimes Select does not allow user to interact with text input (Non-searchable).
 *  - It is used when the list of options is predefined and limited.
 *
 * ### Searchable
 *  - Sometimes Select allows user to interact with text input (searchable).
 *  - Typing input serves to filter suggestions presented in the dropdown.
 *  - It is used when the list of options is variable and/or very long.
 *
 * ## Behaviour
 *  - Renders `dw-select-trigger` and `dw-select-dialog`
 *  - When `opened=true` drop-down dialog is opened
 *
 * ### Focus:
 *  - For searchable types, it shows a cursor. For non searchable type, doesn’t show cursor.
 *  - The dropdown opens when the user clicks the field using a pointing device.
 *
 * ### Typing:
 *  - Not applicable to non-searchable
 *  - Typing a character when the field is focused also opens the drop-down.
 *  - drop-down shows result matching with any word of the input text. For e.g. if the user types ‘hdfc bank’ it should show a records which contains words ‘hdfc’ or ‘bank’ anywhere (at start, middle or at end)
 *  - Matching text is highlighted
 *  - Shows the most relevant matches in dropdown in sorted order. Sorting order is most matched to least matched.
 *
 * ### Keyboard accessibility
 *  TODO - write documentation
 *
 * ### Toggle icon
 *  TODO - write documentation
 *
 * ### Reset Icon
 *  TODO - write documentation
 */

export class DwMultiSelect extends DwFormElement(LitElement) {
  static get properties() {
    return {
      /**
       * Sets the `name` attribute on the internal input.
       * The name property should only be used for browser autofill as webcomponent form participation
       * does not currently consider the `name` attribute.
       */
      name: { type: String },

      /**
       * Selected list item object.
       * `object` in case of single selection;
       * `object[]` in case of multiple selections.
       */
      value: { type: Array },

      /**
       * Whether or not to show the `outlined` variant.
       */
      outlined: { type: Boolean },

      /**
       * Sets floating label value.
       * __NOTE:__ The label will not float if the selected item has a false value property.
       */
      label: { type: String },

      /**
       * Sets disappearing input placeholder.
       */
      placeholder: { type: String },

      /**
       * Helper text to display below the input.
       * Display default only when focused.
       */
      helper: { type: String },

      /**
       * Always show the helper text despite focus.
       */
      helperPersistent: { type: Boolean },

      /**
       * Whether or not to show the `readOnly` state.
       */
      readOnly: { type: Boolean, reflect: true, attribute: 'read-only' },

      /**
       * Set `true` to apply required validation.
       */
      required: { type: Boolean },

      /**
       * A Custom Error Message to be shown.
       * It could be `String` or `Function`.
       */
      error: { type: Object },

      /**
       * Message to show in the error color when the `required`, and `_requiredErrorVisible` are true.
       */
      errorMessages: { type: Object },

      /**
       * Whether or not to show the `required` error message.
       */
      _requiredErrorVisible: { type: Boolean },

      /**
       * The [`ValidityState`](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState) of the textfield.
       */
      validity: { type: Object },

      /**
       * Reports validity on value change rather than only on blur.
       * this property directly pass to trigger element
       */
      autoValidate: { type: Boolean },

      /**
       * Set to `true` to make it disabled.
       */
      disabled: { type: Boolean },

      /**
       * Whether or not to show the `searchable` variant.
       */
      searchable: { type: Boolean },

      /**
       * `vkb` stands for Virtual KeyBoard.
       * Whether the Device has Virtual KeyBoard.
       */
      _vkb: { type: Boolean },

      /**
       * Specify various available/possible groups of the Items.
       * A Group is an Object `{name: string, title: string, collapsible: boolean, collapsed: boolean}`
       */
      groups: { type: Array },

      /**
       * A Function `(item) -> groupName` to identify a group from an item.
       */
      groupSelector: { type: Function },

      /**
       * An expression (dot-separated properties) to be applied on Item, to find it's group.
       * When `groupSelector` is specified, this is ignored. When `groupSelector` isn't specified
       * and this is specified, `groupSelector` is built using this.
       */
      groupExpression: { type: String },

      /**
       * List of total available items under drop-down.
       */
      items: { type: Array },

      /**
       * A function `(item) -> value` to indetify value of any item.
       */
      valueProvider: { type: Function },

      /**
       * An expression (dot-separated properties) to be applied on Item, to find it's value.
       * When `valueProvider` is specified, this is ignored. When `valueProvider` isn't specified
       * and this is specified, `valueProvider` is built using this.
       * default: _id
       */
      valueExpression: { type: String },

      /**
       * Computed property from valueProvider and valueExpression
       */
      _valueProvider: { type: Function },

      /**
       * A Function `(item) -> text` to find the Text to be shown (in input), corresonding to the
       * current `value`.
       * default: `(item) -> item`.
       */
      valueTextProvider: { type: Function },

      /**
       * By default, the pop-over dialog is rendered in the width of the host element
       * And the fit dialog is rendered in a fixed-width specified by
       * `-–dw-select-fit-dialog-width` css property.
       *
       * __But:__ when this is specified, both dialogs are shown in this width.
       * __Note:__ BottomSheet dialog is always in full width, so this doesn’t affect it.
       */
      dialogWidth: { type: Number },

      /**
       * A function to customize item rendering.
       * Prototype: `(item, selected, activated, query) => HTMLTemplate`.
       *
       * - Input property.
       * - It's Optional, by default it renders an item using a `dw-surface`.
       * - Template should render only 1 root-level block element. Obviously, it's tree can have multiple
       * children at any depth.
       * - It should show hover and ripple (on click) effects.
       * - Highlight text based on `query`.
       * `click` event on it is being listened to know that item has been selected by the user.
       * __Note:__ It must not be focusable.
       */
      renderItem: { type: Object },

      /**
       * A function to customize groupItem's rendering.
       * Prototype: `(name, label, collapsible, collapsed, activated) => HTMLTemplate`
       *
       * - Input property.
       * - It's optional, by default it renders groupItem using //TODO: ????
       * - Template should render only 1 root-level block element. Obviously, it's tree can have multiple
       * children at any depth.
       * - `name` (available as input) should be set to `name` property on the groupItem element.
       * - It should show hover and ripple (on click) effects, but only when it’s `collapsible`.
       * - `click` event on it is being listened to toggle `collapsed` status.
       */
      renderGroupItem: { type: Object },

      /**
       * Set this to configure custom logic to detect whether value is changed or not.
       * Default: compares both values by strict equality (by reference) `v1 === v2`.
       * It must return a Boolean.
       * Function receives 2 arguments: (v1, v2). Should return `true` when both values are same otherwise `false`.
       */
      valueEquator: { type: Function },

      /**
       * Set it if you would like to show a heading on the bottom-sheet dialog.
       * By default no heading.
       */
      heading: { type: String },

      /**
       * Shows an icon-button with a close icon,
       * in the `top-right` corner on the bottom-sheet dailog.
       */
      showClose: { type: Boolean },

      /**
       * Name of trailing Icon which availble in selected item.
       */
      selectedTrailingIcon: { type: String },

      /**
       * Messages of for noRecords and noMatching
       * Example: {noRecords: "", noMatching: "", loading: ""}
       */
      messages: { type: Object },

      /**
       * Placeholder for fit dialog's search input
       */
      searchPlaceholder: { type: String },

      /**
       * Input property
       * Function which returns hint text string
       * In the argument selected value
       */
      helperTextProvider: { type: Function },

      /**
       * Input Property
       * A function to customize search.
       * function has two parameters
       *  - item
       *  - query
       *
       * returns always boolean
       */
      queryFilter: { type: Function },

      /**
       * Whether dialog is opened or not.
       */
      _opened: { type: Boolean, reflect: true, attribute: 'opened' },

      /**
       * search query (as text). used to filter items and highlight matched words.
       */
      _query: { type: String },

      /**
       * Input property. Default value is `true`.
       * When `false`, doesn't highlight matched words.
       */
      highlightQuery: { type: Boolean },

      /**
       * Contains text that presents on input text field
       * Computed property on `@_value-change` event
       */
      _selectedValueText: { type: String },

      /**
       * Text to show the warning message.
       */
      warning: { type: String },

      /**
       * Input Property
       * Whether error message shows in tooltip or not.
       * Default erro shows at hint text
       */
      errorInTooltip: { type: Boolean },

      /**
       * Represents items to be rendered by lit-virtualizer. Same as _items property of 'select-base-dialog'.
       * { type: GROUP or ITEM, value: Group or Item object }
       * It’s computed from _groups, items & query.
       */
      _items: {
        type: Array,
      },

      /**
       * Whther the trigger element is dense or not
       */
      dense: { type: Boolean },

      /**
       * Represents current layout in String. Possible values: `small`, `medium`, `large`, `hd`, and `fullhd`.
       */
      _layout: { type: String },

      /**
       * To show invalid state to trigger elements
       */
      _invalid: { type: Boolean },

      /**
       * Whether to show hint in tooltip
       * tip trigger on hover of info, warning, and error icon button at trail.
       */
      hintInTooltip: { type: Boolean },

      /**
       * Whether to show error in tooltip
       * tip trigger on hover of info, warning, and error icon button at trail.
       */
      errorInTooltip: { type: Boolean },

      /**
       * Whether to show warning in tooltip
       * tip trigger on hover of info, warning, and error icon button at trail.
       */
      warningInTooltip: { type: Boolean },

      /**
       * Tooltip actions for hint text
       */
      hintTooltipActions: { type: Array },

      /**
       * Tooltip actions for error text
       */
      errorTooltipActions: { type: Array },

      /**
       * Tooltip actions for warning text
       */
      warningTooltipActions: { type: Array },

      /**
       * Tooltip placement
       * for more see tippyJs doc: https://atomiks.github.io/tippyjs/v6/all-props/#placement
       */
      tipPlacement: { type: String },

      popover: { type: Boolean },

      /**
       * Input property.
       * External styles to be applied on popover dialog
       */
      popoverStyles: { type: Object },

      /**
       *
       */
      autoComplete: { type: Boolean },

      /**
       * Input property.
       * When it's true, select shows in read only mode with trigger icon.
       */
      readOnlyTrigger: { type: Boolean },

      interactiveDialog: { type: Boolean },
    };
  }

  /**
   * Trigger Element Getter
   */
  get _triggerElement() {
    if (this.readOnlyTrigger) {
      return this.renderRoot.querySelector('.read-only-trigger-wrapper');
    }

    if (this._isSlotTemplateAvaible) {
      return this.querySelector('#selectTrigger');
    }

    return this.renderRoot.querySelector('#selectTrigger');
  }

  get _dialogElement() {
    return this.renderRoot.querySelector('dw-select-base-dialog');
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          --dw-popover-min-width: 0px;
          --dw-select-highlight-bg-color: #fde293;
          -webkit-tap-highlight-color: transparent;
        }

        :host(:not([inputallowed])) #selectTrigger {
          cursor: pointer;
        }

        .read-only-trigger-wrapper {
          cursor: pointer;
        }

        .read-only-trigger-label {
          ${caption};
          color: var(--mdc-theme-text-secondary-on-background, rgba(0, 0, 0, 0.6));
        }

        .read-only-trigger-value-wrapper {
          display: flex;
          align-items: center;
          margin-top: 4px;
        }

        :host(:not([read-only])) .read-only-trigger-value-wrapper {
          margin-top: -8px;
        }

        :host([read-only]) .read-only-trigger-value-wrapper {
          gap: 8px;
        }

        .read-only-trigger-value {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          ${subtitle1};
          color: var(--dw-select-read-only-trigger-value-color);
        }

        :host([highlighted-value]) .read-only-trigger-value {
          ${headline6};
        }

        .read-only-trigger-icon[error] {
          --dw-icon-color: var(--mdc-theme-error, #b00020);
        }

        .read-only-trigger-icon[warning] {
          --dw-icon-color: var(--mdc-theme-text-warning, #ffa726);
        }
      `,
    ];
  }

  constructor() {
    super();
    this.searchable = false;
    this.highlightQuery = true;
    this.label = '';
    this.heading = '';
    this.placeholder = '';
    this.showClose = false;
    this.searchPlaceholder = '';
    this._selectedValueText = '';
    this.valueTextProvider = () => {};
    this.groupSelector = () => {};
    this._valueProvider = item => item;
    this._cancel = false;
    this.valueEquator = (v1, v2) => v1 === v2;
    this.helperTextProvider = value => {};
    this.queryFilter = (item, query) => filter(this._getItemValue(item), query);
    this.tipPlacement = 'bottom';
  }

  render() {
    return html` ${this._triggerTemplate} ${this._opened ? this._dialogTemplate : nothing} `;
  }

  get _triggerTemplate() {
    if (this.readOnlyTrigger) {
      return html`
        <div class="read-only-trigger-wrapper" @click="${this._onTrigger}">
          <div class="read-only-trigger-label">${this.label}</div>
          <div class="read-only-trigger-value-wrapper">
            <div class="read-only-trigger-value">${this._selectedValueText}</div>
            ${this._readOnlyTriggerIcon}
          </div>
        </div>
      `;
    }

    return html`
      <div @click="${this._onTrigger}" @focusin=${this._onFocus}><slot name="trigger-template"></slot></div>
      ${!this._isSlotTemplateAvaible
        ? html` <dw-multi-select-trigger
            id="selectTrigger"
            .name="${this.name}"
            .label="${this.label}"
            .placeholder="${this.placeholder}"
            .hint=${this._computeHelperText()}
            ?hintPersistent=${this.helperPersistent}
            ?inputAllowed=${this.autoComplete || (this.searchable && !this._vkb)}
            ?readOnly=${this.readOnly}
            .value=${this._selectedValueText}
            ?required="${this.required}"
            ?outlined=${this.outlined}
            ?disabled=${this.disabled}
            ?invalid=${this._invalid}
            ?autoValidate=${this.autoValidate}
            .error=${this.error}
            .errorMessages="${this.errorMessages}"
            .warning="${this.warning}"
            .hintInTooltip="${this.hintInTooltip}"
            .errorInTooltip=${this.errorInTooltip}
            .warningInTooltip="${this.warningInTooltip}"
            .hintTooltipActions="${this.hintTooltipActions}"
            .errorTooltipActions="${this.errorTooltipActions}"
            .warningTooltipActions="${this.warningTooltipActions}"
            .tipPlacement="${this.tipPlacement}"
            .dense=${this.dense}
            .autoComplete=${this.autoComplete}
            .suffixTemplate=${this._inputSuffixTemplate}
            @focus=${this._onFocus}
            @mousedown=${this._onTrigger}
            @input=${this._onUserInteraction}
            @keydown=${this._onKeydown}
            @expand-toggle="${this._onDialogOpenToggle}"
            @invalid=${this._onInvalid}
            @valid=${this._onValid}
            @clear-selection="${this._onClearSelection}"
            @action="${this._onTipAction}"
            ?opened="${this._opened}"
          ></dw-multi-select-trigger>`
        : nothing}
    `;
  }

  get _readOnlyTriggerIcon() {
    if (this.readOnly && !((this.hint && this.hintInTooltip) || (this.warning && this.warningInTooltip))) return;

    return html` ${!this.readOnly
      ? html`<dw-icon-button
          id="trigger-icon"
          class="read-only-trigger-icon"
          ?error=${this.error && this.errorInTooltip}
          ?warning=${this.warning && this.warningInTooltip}
          icon=${this._opened ? 'expand_less' : 'expand_more'}
          iconFont="OUTLINED"
          @click=${this._onReadOnlyTriggerIconClick}
        ></dw-icon-button>`
      : html`<dw-icon
          id="trigger-icon"
          class="read-only-trigger-icon"
          ?error=${this.error && this.errorInTooltip}
          ?warning=${this.warning && this.warningInTooltip}
          name=${'info'}
          iconFont="OUTLINED"
        ></dw-icon>`}
    ${(this.error && this.errorInTooltip) || (this.warning && this.warningInTooltip) || (this.hint && this.hintInTooltip)
      ? html`<dw-tooltip
          for="trigger-icon"
          .forEl=${!this._vkb ? this : ``}
          .content=${this._readOnlyTrigerTipContent}
          .trigger=${this._vkb ? 'click' : 'mouseenter'}
          .placement=${this.tipPlacement}
          .offset=${this.readOnly ? [0, 8] : [0, 0]}
        ></dw-tooltip>`
      : ``}`;
  }

  get _readOnlyTrigerTipContent() {
    if (this.error && this.errorInTooltip) {
      return this.error;
    }

    if (this.warning && this.warningInTooltip) {
      return this.warning;
    }

    if (this.hint && this.hintInTooltip) {
      return this.hint;
    }
  }

  get _dialogTemplate() {
    return html`<dw-multi-select-base-dialog
      id="selectDialog"
      .opened=${this._opened}
      .type=${this._dialogType}
      .placement=${this._dialogPlacement}
      .triggerElement=${this._triggerElement}
      .value=${this.value}
      .appendTo=${this.renderRoot}
      .items="${this.items}"
      .layout=${this._layout}
      .valueProvider=${this._valueProvider}
      .valueExpression=${this.valueExpression}
      .valueTextProvider=${this.valueTextProvider}
      .valueEquator=${this.valueEquator}
      .groups=${this.groups}
      .groupSelector=${this.groupSelector}
      .groupExpression=${this.groupExpression}
      .queryFilter=${this.queryFilter}
      ._query=${this._query}
      .highlightQuery=${this.highlightQuery}
      ?vkb=${this._vkb}
      ?searchable=${this.searchable}
      .renderItem=${this.renderItem}
      .renderGroupItem=${this.renderGroupItem}
      .heading=${this.heading}
      .searchPlaceholder="${this.searchPlaceholder}"
      .error=${this.error}
      .errorMessages="${this.errorMessages}"
      .errorInTooltip=${this.errorInTooltip}
      .helper=${this._computeHelperText()}
      ?showClose=${this.showClose}
      .selectedTrailingIcon="${this.selectedTrailingIcon}"
      .dialogHeaderTemplate="${this._headerTemplate}"
      .dialogContentTemplate="${this._contentTemplate}"
      .dialogFooterTemplate=${this._footerTemplate}
      .inputSuffixTemplate=${this._inputSuffixTemplate}
      .popoverStyles=${this._popoverStyles}
      .interactive=${this.interactiveDialog}
      @_items-changed=${this._onItemsChanged}
      @apply-event=${e => this._onValueChange(e)}
      @_value-change=${e => this._setValueText(e)}
      @dw-dialog-opened="${e => this._onDialogOpen(e)}"
      @dw-fit-dialog-opened="${e => this._onDialogOpen(e)}"
      @dw-dialog-closed="${e => this._onDialogClose(e)}"
      @dw-fit-dialog-closed="${e => this._onDialogClose(e)}"
      @clear-selection="${this._onClearSelection}"
      .messages="${this.messages}"
      ._getItemValue=${this._getItemValue}
    ></dw-multi-select-base-dialog>`;
  }

  get _isSlotTemplateAvaible() {
    return !!this.querySelector('[slot="trigger-template"]');
  }

  /**
   * Headet Template getter
   *
   */
  get _headerTemplate() {
    return nothing;
  }

  /**
   * content Template getter
   *
   */
  get _contentTemplate() {
    return nothing;
  }

  get _inputSuffixTemplate() {
    return nothing;
  }

  /**
   * Footer Template getter
   * Used when this element is used by `Extension` To override this method
   */
  get _footerTemplate() {
    return nothing;
  }

  get _dialogType() {
    if (this.autoComplete) return 'popover';

    if (this._layout === 'small' && this.searchable) return 'fit';

    if ((this._layout === 'small' && !this.popover) || (this.searchable && (this._layout === 'medium' || this._layout === 'large')))
      return 'modal';

    return 'popover';
  }

  get _dialogPlacement() {
    if (this._layout === 'small' && !this.searchable) return 'bottom';

    return 'center';
  }

  get _popoverStyles() {
    return this.popoverStyles;
  }

  connectedCallback() {
    super.connectedCallback();
    this._onUserInteraction = debounce(this._onUserInteraction.bind(this), 100);

    this._computeValueProvider();

    this._layout = DeviceInfo.info().layout;
    this._vkb = DeviceInfo.info().vkb;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  willUpdate(_changedProperties) {
    super.willUpdate && super.willUpdate(_changedProperties);

    if (_changedProperties.has('_opened')) {
      this._setPopoverDialogWidth();
    }

    if (
      (_changedProperties.has('_opened') && _changedProperties.get('_opened') && !this._opened) ||
      (_changedProperties.has('value') && !this._opened)
    ) {
      this._setValueText();
    }

    if (_changedProperties.has('valueProvider') || _changedProperties.has('valueExpression')) {
      this._computeValueProvider();
    }

    if (_changedProperties.has('autoComplete')) {
      this.popover = true;
      this.searchable = true;
    }
  }

  updated(_changedProperties) {
    if (_changedProperties.has('_opened') && !this._opened) {
      this.reportValidity();
    }
  }

  /** set Trigger element value on value change */
  async _setValueText(e) {
    await this.updateComplete;
    const value = e ? e.detail : this.value || [];
    const firstSelectedItem = this._getSelectedItem(value[0]);
    const text = this.valueTextProvider(firstSelectedItem);
    this._selectedValueText = !text ? '' : `${text} ${value.length > 1 ? `(+${value.length - 1} other)` : ''}`;
  }

  /**
   * Event handlers to be invoked when _items (filtered items) are changed in select-dialog.
   * It just copies this property on self; for it's own logic.
   */
  _onItemsChanged(e) {
    this._items = e.detail;
  }

  /**
   * Set dialog width if `dialogWidth` is provided.
   * Otherwise determine trigger element's width and set to dialog
   */
  _setPopoverDialogWidth() {
    if (this.dialogWidth) {
      this.style.setProperty('--dw-popover-width', this.dialogWidth + 'px');
      return;
    }

    // Trigger element getter
    let triggerEl = this.renderRoot.querySelector('#selectTrigger');

    // Set Trigger element's offSetWidth to PopOver Dialog
    if (triggerEl) {
      this.style.setProperty('--dw-popover-width', triggerEl.offsetWidth + 'px');
    }
  }

  /**
   * Trigger when actual user intract
   * @param {Event} e
   */
  _onUserInteraction(e) {
    if (e.type === 'input') {
      this._onInput(e);
    }
  }

  _computeHelperText() {
    if (this.helperTextProvider && typeof this.helperTextProvider === 'function' && this.helperTextProvider(this.value)) {
      return this.helperTextProvider(this.value);
    }
    return this.helper;
  }

  /**
   * Compute label of the item
   * @param {Object | String} item
   * @returns {String} returns string that actually represents in list item
   */
  _getItemValue(item) {
    if (!this.valueTextProvider(item)) {
      return item;
    }
    return this.valueTextProvider(item);
  }

  _onReadOnlyTriggerIconClick(e) {
    if (
      ((this.error && this.errorInTooltip) || (this.warning && this.warningInTooltip) || (this.hint && this.hintInTooltip)) &&
      this._vkb
    ) {
      e.stopPropagation();
    }
  }

  _onTrigger() {
    if (!this.readOnly && !this.autoComplete) {
      if (this.readOnlyTrigger) {
        const el = this.renderRoot.querySelector('.read-only-trigger-icon');
        if (el) {
          el?.__onStart();
          setTimeout(() => {
            el?.__fadeOut();
          }, 250);
        }
      }

      this._opened = true;
    }
  }

  _onDialogQueryChanged(e) {
    this._query = e?.detail?.value;
  }

  _onValueChange(e) {
    if (this._areArraysEqual(this.value, e.detail)) return;
    this.dispatchEvent(new CustomEvent('change', { detail: e.detail }));
  }

  _areArraysEqual(arr1, arr2) {
    return isEqual(arr1, arr2);
  }

  /**
   * @param (String) value
   */
  _getSelectedItem(value) {
    const item = this.items && this.items.find(item => this.valueEquator(this._valueProvider(item), value));
    if (item !== undefined) {
      return item;
    }
  }

  _onInvalid(e) {
    if (!this._triggerElement) return;
    this.validity = this._triggerElement.validity;
    this.dispatchEvent(new CustomEvent('invalid', { detail: this.validity }));
  }

  _onValid(e) {
    if (!this._triggerElement) return;
    this.validity = this._triggerElement.validity;
    this.dispatchEvent(new CustomEvent('valid', { detail: this.validity }));
  }

  _onTipAction(e) {
    const action = e.detail;
    this.dispatchEvent(new CustomEvent('action', { detail: action }));
  }
  _onClearSelection() {
    const value = this.value;
    this.value = undefined;
    this._query = '';
    this._dispatchSelected(value);
  }

  _onDialogOpenToggle() {
    this._opened = !this._opened;
  }

  _onDialogOpen(e) {
    e.stopPropagation();

    if (this._dialogElement) {
      this.dispatchEvent(
        new CustomEvent('dw-select-opened', {
          bubbles: true,
          composed: true,
          detail: { ...e.detail, dialogType: this._dialogElement.type },
        })
      );
    }
  }

  _onDialogClose(e) {
    e.stopPropagation();

    if (this._dialogElement) {
      this.dispatchEvent(
        new CustomEvent('dw-select-closed', {
          bubbles: true,
          composed: true,
          detail: { ...e.detail, dialogType: this._dialogElement.type },
        })
      );
    }

    this._opened = false;
  }

  _onKeydown(e) {
    const { ENTER, ARROW_DOWN, ARROW_UP, TAB, SHIFT, ESC } = KeyCode;
    const { keyCode } = e;
    if ([ENTER, ARROW_DOWN, ARROW_UP].includes(keyCode) && !this._opened) {
      e.stopPropagation();
      this._onTrigger(e);
      return;
    }

    if (!this.searchable && ![TAB, SHIFT].includes(keyCode)) {
      e.preventDefault();
    }
  }

  _computeValueProvider() {
    if (!this.valueProvider && !this.valueExpression) {
      this._valueProvider = item => item;
      return;
    }

    if (this.valueExpression) {
      this._valueProvider = item => item && item[this.valueExpression];
      return;
    }

    this._valueProvider = this.valueProvider;
  }

  validate() {
    return this.reportValidity();
  }

  checkValidity() {
    if (this._triggerElement && this._triggerElement.checkValidity && typeof this._triggerElement.checkValidity === 'function') {
      return this._triggerElement.checkValidity();
    }
    return true;
  }

  // required hoy tyare error show karva
  reportValidity() {
    if (this._triggerElement && this._triggerElement.reportValidity && typeof this._triggerElement.reportValidity === 'function') {
      return this._triggerElement.reportValidity();
    }
    return true;
  }
}

if (isElementAlreadyRegistered('dw-multi-select')) {
  console.warn("lit: 'dw-multi-select' is already registered, so registration skipped.");
} else {
  customElements.define('dw-multi-select', DwMultiSelect);
}
