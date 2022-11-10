import { LitElement, css } from '@dreamworld/pwa-helpers/lit.js';

export class DwSelectBaseDialog extends LitElement {
  
  static get styles() {
    return css`
    :host([mobile-mode]) {
      position: fixed;
      border-radius: 3px;
      box-shadow: 0px 2px 6px #ccc;
      overflow: auto;
    }`;
  } 

  static get properties() {
    return {
      /**
       * The element that should be used to position the element. If not set, it will show dialog in center of the screen
       */
      positionTarget: Object,
      /**
       * Input property. The orientation against which to align the menu dropdown horizontally relative to the dropdown trigger.
       * Possible values: "left", "right"
       * Default value: "left"
       */
      hAlign: String,
      /**
       * Input property. The orientation against which to align the menu dropdown vertically relative to the dropdown trigger.
       * Possible values: "top", "bottom"
       * Default value: "top"
       */
      vAlign: String,
      /**
       * Input property. The horizontal offset in pixels. Negtaive numbers allowed.
       * Default value: 0
       */
      hOffset: Number,
      /**
       * Input property. The vertical offset in pixels. Negtaive numbers allowed.
       * Default value: 0
       */
      vOffset: Number,
      /**
       * Input property.
       * When true, Show dialog in full screen even if items are very less in mobile mode
       * Default value: false
       */
      alwaysFullScreenInMobile: Boolean,

      /**
       * True when dialog height is equal to viewport.
       */
      _fullHeight: {
        type: Boolean,
        reflect: true,
        attribute: 'full-height'
      }
    };
  }

  constructor() {
    super();
    this._onCaptureClick = this._onCaptureClick.bind(this);
    this._onDialogClick = this._onDialogClick.bind(this);
    this._boundScrollHandler = this._boundScrollHandler.bind(this);
    this.hAlign = 'left';
    this.vAlign = 'top';
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._removeDialogKeyEventListeners();
  }

  refit() {
    if (!this.mobileMode) {
      return;
    }
    this.style.height = 'auto';
    let dropdownHeight = this.offsetHeight;
    let dropdownWidth = this.offsetWidth;
    let winHeight = window.innerHeight;
    
    if(this.mobileMode) {
      if(this.alwaysFullScreenInMobile) {
        this.style.height = 'auto';
        this.style.top = '0px';
      } else {
        this.style.height = Math.min(dropdownHeight, winHeight) + 'px';
        this.style.top = 'auto';
      }
      
      this.style.bottom = '0px';
      this.style.left = '0px';
      this.style.right = '0px';
      this.style.transform = 'none';
      
      //Dialog has full height or not.
      this._manageFullHeight();
      return;
    }

    if(!this.positionTarget) {
      let height = Math.min(dropdownHeight, winHeight);
      if(this.vOffset) {
        height = height - this.vOffset;
      }
      this.style.height = height + 'px';
      this.style.top = '50%';
      this.style.bottom = 'initial';
      this.style.left = '50%';
      this.style.right = 'initial';
      this.style.transform = 'translate(-50%,-50%)';
      return;
    }
  }

  /**
   * Manage `_fullHeight` property.
   * If dialog height and viewport is equal then set `_fullHeight` as a true. otherwise set false.
   * @protected
   */
  _manageFullHeight() {
    this._fullHeight = window.innerHeight == this.offsetHeight;
  }

  _hasNoEnoughBottomSpace(positionTargetClientRect) {
    let winHeight = window.innerHeight;

    let topSpace, bottomSpace;

    if(this.vAlign === 'bottom') {
      topSpace = positionTargetClientRect.top;
      bottomSpace = winHeight - positionTargetClientRect.top - positionTargetClientRect.height;
    } else {
      topSpace = positionTargetClientRect.top + positionTargetClientRect.height;
      bottomSpace = winHeight - positionTargetClientRect.top;
    }
    if(bottomSpace > topSpace) {
      return false;
    }
    if(bottomSpace > 350){
      return false;
    }
    return true;
  }

  _onOpened() {
    this._addDialogKeyEventListeners();
  }

  _onClosed() {
    this._removeDialogKeyEventListeners();
  }

  _addDialogKeyEventListeners() {
    this.addEventListener('mousedown', this._onDialogClick);

    let options = {
      capture: true,
      passive: false
    };

    // Modern `wheel` event for mouse wheel scrolling:
    document.addEventListener('wheel', this._boundScrollHandler, options);
    // Older, non-standard `mousewheel` event for some FF:
    document.addEventListener('mousewheel', this._boundScrollHandler, options);
    // IE:
    document.addEventListener('DOMMouseScroll', this._boundScrollHandler, options);

    setTimeout(() => {
      if(this.opened) {
        document.addEventListener('mousedown', this._onCaptureClick);
      }
    });
  }

  _removeDialogKeyEventListeners() {
    let options = {
      capture: true,
      passive: false
    };
    this.removeEventListener('mousedown', this._onDialogClick);
    document.removeEventListener('mousedown', this._onCaptureClick);
    document.removeEventListener('wheel', this._boundScrollHandler, options);
    document.removeEventListener('mousewheel', this._boundScrollHandler, options);
    document.removeEventListener('DOMMouseScroll', this._boundScrollHandler, options);
  }

  /**
   * When mobile mode, closes dialog on outside click.
   */
  _onCaptureClick() {
    this.mobileMode && this.close();
  }

  _onDialogClick(e) {
    e.stopPropagation();
  }

  _boundScrollHandler(event) {
    let path = event.path;
    if(!path || !event.composedPath) {
      path = event.composedPath();
    }

    if(!path) {
      return;
    }

    let scrollEl = this.shadowRoot.querySelector('#scroller');

    let insideScroll = path.find((itemEl) => {
      return itemEl === scrollEl;
    });

    if(!insideScroll) {
      event.preventDefault();
    }
  }

  _shouldPreventScrolling(event) {
    // Update if root target changed. For touch events, ensure we don't
    // update during touchmove.
    var target = Polymer.dom(event).rootTarget;
    if (event.type !== 'touchmove' && lastRootTarget !== target) {
      lastRootTarget = target;
      lastScrollableNodes = this._getScrollableNodes(Polymer.dom(event).path);
    }

    // Prevent event if no scrollable nodes.
    if (!lastScrollableNodes.length) {
      return true;
    }
    // Don't prevent touchstart event inside the locking element when it has
    // scrollable nodes.
    if (event.type === 'touchstart') {
      return false;
    }
    // Get deltaX/Y.
    var info = this._getScrollInfo(event);
    // Prevent if there is no child that can scroll.
    return !this._getScrollingNode(lastScrollableNodes, info.deltaX, info.deltaY);
  }
}
