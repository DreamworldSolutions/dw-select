import { html, css } from 'lit-element';
import { LitElement } from '@dreamworld/pwa-helpers/lit-element.js';
import { Typography } from '@dreamworld/material-styles/typography';
import './dw-select-dialog';
import '@dreamworld/dw-icon';
import '@dreamworld/dw-icon-button';
import { DwFormElement } from '@dreamworld/dw-form/dw-form-element'; 
import '@dreamworld/dw-button';
import tippy from 'tippy.js';

/**
 * Trigger for `dw-select-dialog`
 */
export class DwSelect extends DwFormElement(LitElement) {

  static get styles() {
    return [Typography, css`
    :host {
      display: block;
      box-sizing: border-box;
      width: var(--dw-select-width, 250px);
      --dw-select-error-color: var(--error-color);
      --dw-select-error-color: var(--error-color);
      --dw-select-label-color: var(--secondary-text-color);
      --dw-select-expand-more-icon-color: var(--light-theme-secondary-color);
      --dw-select-border-color: var(--light-theme-divider-color);
      --dw-select-value-color: var(--primary-text-color);
      --dw-select-placeholder-color: var(--light-theme-disabled-color);
      --dw-error-message-color: var(--error-color);
    }

    :host([trigger-icon]), :host([trigger-label]), :host([custom-trigger]) {
      width: var(--dw-select-width, auto);
    }

    :host([trigger-icon]) .main-container #dropdownContainer, 
    :host([trigger-label]) .main-container #dropdownContainer, 
    .main-container #dropdownContainer .trigger-icon, 
    .main-container #dropdownContainer .trigger-label {
      display: flex;
      display: -ms-flexbox;
      display: -webkit-flex;
      flex-direction: row;
      -ms-flex-direction: row;
      -webkit-flex-direction: row;
      align-items: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      box-sizing: border-box;
    }

    .main-container #dropdownContainer .trigger-icon, .main-container #dropdownContainer .trigger-label {
      -ms-flex-pack: center;
      -webkit-justify-content: center;
      justify-content: center;
    }

    .main-container #dropdownContainer dw-icon-button.trigger-icon {
      --dw-icon-color: var(--dw-select-trigger-icon-color, #000);
    }

    .main-container #dropdownContainer .trigger-label {
      width: var(--dw-select-trigger-label-width, auto);
      height: var(--dw-select-trigger-label-height, 36px);
    }

    .main-container #dropdownContainer .trigger-icon-label dw-icon {
      margin-right: 8px;
      --dw-icon-color: var(--dw-select-trigger-icon-color);
    }

    :host([invalid]) .main-container #dropdownContainer .label {
      color: var(--dw-select-error-color);
    }

    :host([invalid]) .main-container #dropdownContainer .dropdown-input {
      border-bottom: 2px solid var(--dw-select-error-color);
    }

    .main-container #dropdownContainer {
      outline: none;
      padding: var(--dw-select-dropdown-container-padding, 0px 0px 4px 0px);
      margin: var(--dw-select-dropdown-container-margin, 0px);
      cursor: pointer;
    }

    .main-container #dropdownContainer .label {
      color: var(--dw-select-label-color);
      padding-top: 4px;
    }

    .main-container  #dropdownContainer .dropdown-input dw-icon { 
      --dw-icon-color: var(--dw-select-expand-more-icon-color);
      padding: 0px 4px;
    }
  
    .main-container #dropdownContainer .dropdown-input {
      display: flex;
      display: -ms-flexbox;
      display: -webkit-flex;
      flex-direction: row;
      -ms-flex-direction: row;
      -webkit-flex-direction: row;
      align-items: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      justify-content: space-between;
      -ms-flex-pack: space-between;
      -webkit-justify-content: space-between;
      border-bottom: 1px solid var(--dw-select-border-color);
    }

    .main-container #dropdownContainer .dropdown-input .value-container {
      padding: 8px 0px 6px 0px;
      overflow: hidden;
    }

    .main-container #dropdownContainer .dropdown-input .value-container .value {
      color: var(--dw-select-value-color);
      padding-top: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .main-container #dropdownContainer .dropdown-input .value-container .placeholder {
      color: var(--dw-select-placeholder-color);
    }

    .error-message {
      color: var(--dw-error-message-color);
      padding-bottom: 4px;
    }

    #overlay {
      position: fixed;
      display: none;
      top: 0; right: 0; bottom: 0; left: 0;
      background-color: var(--overlay-color, rgba(0,0,0,0.4));
      overflow: hidden;
      width: 100%; 
      height: 100%;
      z-index: 99;
      cursor: pointer;
    }

    :host([overlay][mobile-mode]) #overlay {
      display:block;
    }

    :host([readOnly]) .main-container #dropdownContainer {
      cursor: default;
    }

    :host([readOnly]) .main-container #dropdownContainer .label,
    :host([readOnly]) .main-container #dropdownContainer .dropdown-input {
      opacity: 0.6;
    }

    #select-dialog,
    .tippy-box {
      border-radius: 4px;
    }

    .tippy-box:focus {
      outline: none;
    }

    .tippy-box[data-animation="fadeIn"] {
      box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12);
      will-change: opacity, transform, transform-origin;
      animation-name: fadeIn;
      animation-duration: var(--dw-popover-animation-time, 0.3s);
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }

      to {
        opacity: 1;
      }
    }
  `];
  }

  /**
   * Fired when the value changes.
   *
   * @event value-changed
   * @type {Object}
   * @property {String} value - The String value for the selected item of the multiselect.
   * @property {String} selected - The selected item from the items array.
   */

  /**
   * Fired when the opened property changes.
   *
   * @event opened-changed
   * @type {Object}
   * @property {Boolean} opened - True if the dropdown is open, false otherwise.
   */

  /**
   * Fired when the invalid property changes.
   *
   * @event invalid-changed
   * @type {Object}
   * @property {Boolean} invalid - True ifthe value is invalid
   */

  static get properties() {
    return {
      /**
       * Input property. The label for this element.
       */
      label: { type: String },

      /**
       * name of element
       */
      name: { type: String},

      /**
       * Input property. A placeholder string in addition to the label.
       */
      placeholder: { type: String },
      /**
       * Input property. A placeholder string for search/filter input.
       */
      filterPlaceholder: { type: String },
      /**
       * Input property. A full set of items to filter the visible options from. The items can be of either String or Object type.
       */
      items: { type: Array},

      /**
       * Input property. Disabled item with message.
       * Proxy to `dw-select-dialog` element.
       * e.g. {'DELETE': 'User has no write permission'}.
       */
      disabledItems: { type: Object },

      /**
       * Input + Output property. True if the dropdown is open, false otherwise.
       */
      opened: { type: Boolean, reflect: true },
      /**
       * Note: It's deprecated. Use `placement` instead.
       * Input property. The orientation against which to align the menu dropdown horizontally relative to the dropdown trigger.
       * Possible values: "left", "right"
       * Default value: "left"
       */
      hAlign: { type: String },

      /**
       * Note: It's deprecated. Use `placement` instead.
       * Input property. The orientation against which to align the menu dropdown vertically relative to the dropdown trigger.
       * Possible values: "top", "bottom"
       * Default value: "top"
       */
      vAlign: { type: String },

      /**
       * Input property. Possible values:  `bottom-start` or `bottom-end`
       * Sets position of dropdown relative to trigger element.
       */
      placement: { type: String },

      /**
       * Note: It's deprecated. Use `offset` instead.
       * Input property. The horizontal offset in pixels. Negtaive numbers allowed.
       * Default value: 0
       */
      hOffset: { type: Number },

      /**
       * Note: It's deprecated. Use `offset` instead.
       * Input property. The vertical offset in pixels. Negtaive numbers allowed.
       * Default value: 0
       */
      vOffset: { type: Number },

      /**
       * Input property.  e.g `[10, 14]`
       * Used to set offset of dropdown relative to trigger element.
       */
      offset: { type: Array },

      /**
       * Input property. By default, it allows multiple selection. when this property is set, it will behave as single select control.
       * Default value: false
       */
      singleSelect: { type: Boolean },
      /**
       * Input property. Path for label of the item. If items is an array of objects, the itemLabel is used to fetch the displayed string label for each item.
       * The item label is also used for matching items when processing user input, i.e., for filtering .
       */
      itemLabel: { type: String },
      /**
       * Input property. Path for the value of the item. If items is an array of objects, the itemValue: is used to fetch the string value for the selected item.
       */
      itemValue: { type: String },

      /**
       * Input property. drop down item icon size.
       */
      iconSize: { type: Number },

      /**
       * Input property. Allows user to filter items by typing query.
       * Default value: false
       */
      allowFilter: { type: Boolean },
      /**
       * Input property. Path for groupBy of the item. i.e "type" in items
       */
      groupBy: { type: String },
      /**
       * Input + Output property. The String value for the selected item of the multiselect.
       * It can be of either String or Array type.
       */
      value: { type: String },
      /**
       * Output property. The selected item from the items array.
       * It can be of either String, object or Array type.
       */
      selected: { type: Object },
      /**
       * Input property. Display multiselect in mobile mode (full screen) and no keyboard support
       * Default value: false
       */
      mobileMode: { type: Boolean, reflect: true, attribute: 'mobile-mode' },
      /**
       * Input property. When true, header will be hidde. header contains Back button, Dialog title, count
       * Default value: false
       */
      noHeader: { type: Boolean, reflect: true, attribute: 'no-header' },
      /**
       * Input property. Set to true to mark the input as required.
       * Default value: false
       */
      required: { type: Boolean, reflect: true },
      /**
       * Input + Output property. Set to true if the value is invalid.
       * Default value: false
       */
      invalid: { type: Boolean, reflect: true },
      /**
       * Input property. The error message to display when invalid.
       */
      errorMessage: { type: String },
      /**
       * Input property. Array of string, to specify orders of group
       * i.e ["CONTACT", "BANK"]
       */
      groupByOrder: { type: Array },
      /**
       * Input property. Custom function for rendering group label. Receives one argument:
       * - `value` Value of groupBy key in item
       */
      groupText: { type: Object },
      /**
       * Input property. The title for dialog
       */
      dialogTitle: { type: String },
      /**
       * Input property. Custom function for rendering text of selected items. Receives four arguments:
       * - `items` A full set of items
       * - `value` The String value for the selected item of the multiselect.
       * - `itemLabel` Path for the label of the item.
       * - `itemValue` Path for the value of the item.
       */
      selectedItemsText: { type: Object },

      /**
       * Input property. hide selectAll button
       */
      hideSelectAllBtn : { type: Boolean },

      /**
       * Input property. hide reset button
       */
      hideResetBtn : { type: Boolean },

      /**
       * Input property.
       * When true, Show dialog in full screen even if items are very less in mobile mode
       * Default value: false
       */
      alwaysFullScreenInMobile: { type: Boolean },

      /**
       * Input property.
       * When `true`, Remove defualt trigger element
       * Provide your custom trigger element as a slot.
       */
      customTrigger: {type: Boolean, reflect: true, attribute: 'custom-trigger'},

      /**
       * Input property.
       * Remove default trigger element.
       * Passed as a icon name like `navigation.more_vert`.
       * New trigger element as a icon. 
       */
      triggerIcon: {type: String, reflect: true, attribute: 'trigger-icon'},

      /**
       * Input property.
       * Remove default trigger element.
       * Passed as a label like `Create`.
       * New trigger element as a label.
       */
      triggerLabel: {type: String, reflect: true, attribute: 'trigger-label'},

      /**
       * The element that should be used to position the element
       */
      _positionTarget: { type: Object },
       /**
       * By default, Show all/Reset buttons are not sticky
       * When true, Show all/Reset button are sticky when user scroll items
       */
      stickySelectionButtons: { type: Boolean },

      /**
       * default value is left
       * Possible value - 'left', 'right'
       */
      selectionButtonsAlign: { type: String },

      /**
       * Default value is `false`.
       * When true, Show overlay, otherwise hide overlay.
       */
      _overlay: { type: Boolean, reflect: true, attribute: 'overlay' },
      
      /**
       * Icon to be shown for back button. (e.g "close", "arrow_back")
       * Proxy to "dw-select-dialog". Default value : `close`.
       */
      backIcon: { type: String },

      /**
       * position of back icon. Possible values: `left` or `right`.
       * Proxy to "dw-select-dialog". Default value: `right`.
       */
      backIconPosition: { type: String, reflect: true, attribute: 'back-icon-position' },

      /**
       * If it's `true` do not show back icon.
       * Proxy to "dw-select-dialog"
       */
      noBackIcon: { type: Boolean },

      /**
       * default iconsize is 24
       */
      backIconSize: { type: String }, 

      /**
       * default iconsize is 18
       */
      clearIconSize: { type: String },

      /**
       * default iconsize is 24
       */
      dropdownIconSize: { type: String },

      /**
       * List item icon size
       */
      listItemIconSize: { type: Number },

      /**
       * `true` show dropdown as readonly
       */
      readOnly: { type: Boolean, reflect: true },

      /**
       * size trigger icon
       */
      triggerIconSize: { type: Number },

      /**
       * size trigger icon container
       */
      triggerButtonSize: { type: Number },

      _dropdownRendered: { type: Boolean },

      /**
       * Input property. 
       * When it's provided, renders this template into footer.
       */
      customFooterTemplate: { type: Object }
    };
  }

  constructor() {
    super();
    this.opened = false;
    this.singleSelect = false;
    this.allowFilter = false;
    this.required = false;
    this.invalid = false;
    this.noHeader = false;
    this.mobileMode = false;
    this.errorMessage = 'Required';
    this.label = '';
    this.dialogTitle = '';
    this.hAlign = 'left';
    this.vAlign = 'bottom';
    this.filterPlaceholder = '';
    this.items = [];
    this.hideResetBtn = false;
    this.hideSelectAllBtn = false;
    this.stickySelectionButtons = false;
    this.selectionButtonsAlign = 'left';
    this.alwaysFullScreenInMobile = false;
    this._dropdownRendered = false;
    this._overlay = false;
    this.dropdownIconSize = 24;
    this.backIconSize = 24;
    this.listItemIconSize = 24;
    this.clearIconSize = 18;
    this.readOnly = false;
  }

  /**
   * Show the dropdown content
   */
  open() {
    if(this.opened || this.readOnly){
      return;
    }
    this.opened = true;
  }

  /**
   * Hide the dropdown content
   */
  close() {
    if(!this.opened){
      return;
    }
    this.opened = false;
  }

  /**
   * Returns true if the value is valid. and updates invalid if dryRun=false
   * @param {Bolean} dryRun - When true, It won't override invalid property
   */
  validate(dryRun) {
    let invalid = false;
    if(this.required && (!this.value || !this.value.length)) {
      invalid = true;
    }

    if(!dryRun && this.invalid !== invalid) {
      this.invalid = invalid;
      this._triggerInvalidChange();
    }
    return invalid;
  }
  
  render() {
    if(this.opened){
      this._dropdownRendered = true;
    }
    
    return html`
      <div id="overlay"></div>
      ${this._renderTriggerElement()}
      ${this._dropdownRendered ? this._renderSelectDialog() : ''}
    `;
  }

  _renderSelectDialog() {
    return html`
      <dw-select-dialog
        id="select-dialog"
        .items=${this.items}
        .disabledItems=${this.disabledItems}
        .itemLabel=${this.itemLabel}
        .itemValue=${this.itemValue}
        .listItemIconSize=${this.listItemIconSize}
        .positionTarget=${this._positionTarget}
        .noHeader=${this.noHeader}
        .mobileMode=${this.mobileMode}
        .filterPlaceholder=${this.filterPlaceholder}
        .opened=${this.opened}
        .hAlign=${this.hAlign}
        .vAlign=${this.vAlign}
        .hOffset=${this.hOffset}
        .vOffset=${this.vOffset}
        .singleSelect=${this.singleSelect}
        .value=${this.value}
        .groupBy=${this.groupBy}
        .allowFilter=${this.allowFilter}
        .groupByOrder=${this.groupByOrder}
        .groupText=${this.groupText}
        .dialogTitle=${this.dialogTitle}
        .hideSelectAllBtn="${this.hideSelectAllBtn}"
        .alwaysFullScreenInMobile=${this.alwaysFullScreenInMobile}
        .hideResetBtn="${this.hideResetBtn}"
        .stickySelectionButtons="${this.stickySelectionButtons}"
        .selectionButtonsAlign="${this.selectionButtonsAlign}"
        @value-changed=${this._valueChanged}
        @opened-changed=${this._openedChanged}
        .backIcon="${this.backIcon}"
        .backIconPosition="${this.backIconPosition}"
        .noBackIcon="${this.noBackIcon}"
        .backIconSize="${this.backIconSize}"
        .clearIconSize="${this.clearIconSize}"
        .customFooterTemplate=${this.customFooterTemplate}
      ></dw-select-dialog>
    `;
  }
  
  _renderTriggerElement() {
    return html `
      <div class="main-container" @click="${this._onClick}">
        <div id="dropdownContainer" tabindex="0">
          ${this._getTriggerElement()}
        </div>
        ${(!this.customTrigger && !this.triggerIcon && !this.triggerLabel && this.invalid)? html `
          <div class="error-message caption">${this.errorMessage}</div>
        `: html ``}
      </div>
    `;
  }

  shouldUpdate(changedProps) {
    if(!this.opened && changedProps.size === 1 && changedProps.has('_positionTarget')) {
      return false;
    }
    return true;
  }

  firstUpdated(changedProps){
    super.updated(changedProps);
    this._positionTarget = this.renderRoot.getElementById('dropdownContainer');
  }

  updated(changedProps) {
    if (changedProps.has('opened')) {
      if (this.opened && this._positionTarget && !this.mobileMode) {
        this._openDialog(this._positionTarget);  
      } else {
        this._tippyInstance && this._tippyInstance.destroy();
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._addKeyEventListeners();
  }

  /**
   * @returns {Array} Offset based on `offset`, `hOffset` & `vOffset` properties
   */
  __getOffset() {
    let offset = [0, -(this._positionTarget.offsetHeight)];
    if (this.offset) {
      offset = this.offset;
    } else if (this.hOffset && this.vOffset) {
      offset = [this.hOffset, this.vOffset];
    } else if (this.hOffset && !this.vOffset) {
      offset = [this.hOffset, -(this._positionTarget.offsetHeight)];
    } else if (!this.hOffset && this.vOffset) {
      offset = [0, this.vOffset];
    }
    return offset;
  }

  /**
   * @returns {String} placement of dropdown based on `placement`, `hAlign` & `vAlign` properties.
   */
  __getPlacement() {
    let placement = 'bottom-start';
    if (this.placement) {
      placement = this.placement;
    } else if (this.hAlign || this.vAlign) {
      placement = `${this.vAlign || 'bottom'}-${this.hAlign === 'left' ? 'start' : 'end'}`;
    }
    return placement;
  }

  /**
   * Initializes tippy & shows it.
   * @param {Object} triggerEl Trigger Element
   */
  _openDialog(triggerEl) {
    this._dialog = this.renderRoot.querySelector('#select-dialog');
    const self = this;
    this._tippyInstance = tippy(triggerEl, {
      placement: this.__getPlacement(),
      offset: self.__getOffset(),
      content: self._dialog,
      maxWidth: 'none',
      trigger: 'manual',
      interactive: true,
      hideOnClick: false, //Note: interactive does not work in shadowDOM, so explicitly sets it to `false` & closes dialog from `onClickOutside` handler.
      appendTo: 'parent',
      onClickOutside(instance, event) {
        const path = event.path;
        for (let el of path) {
          if (self._dialog === el) {
            return;
          }
        }
        self.close();
      },
      onHidden() {
        if (self._dialog) {
          self.renderRoot.appendChild(self._dialog);
          setTimeout(() => {
            self.opened = false;
          })
        }
      },
      animation: 'fadeIn',
      
    });
    this._tippyInstance.show();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._removeKeyEventListeners();
    this._tippyInstance && this._tippyInstance.destroy();
  }

  _addKeyEventListeners() {
    if(this.mobileMode) {
      return;
    }
    this._removeKeyEventListeners();
    this.addEventListener('keydown', this._onKeyDown);
  }

  _removeKeyEventListeners() {
    this.removeEventListener('keydown', this._onKeyDown);
  }

  _onKeyDown(e) {
    var keyCode = e.keyCode || e.which;
    if(keyCode === 13) {
      this._onEnterKeyDown(e);
    }
  }

  _onEnterKeyDown(e) {
    if(!this.opened) {
      e.preventDefault();
      e.stopPropagation();
      this.opened = true;
    }
  }

  _getDropDownArrowIcon() {
    return html `
      <dw-icon 
        .size="${this.dropdownIconSize}" 
        name="arrow_drop_down" >
      </dw-icon>
    `
  }

  /**
   * @returns Trigger element based on `customTrigger`, `triggerIcon`, and `triggerLabel` property.
   * @protected
   */
  _getTriggerElement() {
    if(this.customTrigger) {
      return html `
        <slot></slot>
      `;
    }

    if(this.triggerIcon && this.triggerLabel) {
      return html `
        ${this._getTriggerIconWithLabel()}
      `;
    }

    if(this.triggerIcon){
      return html `
        ${this._getTriggerIcon()}
    `;
    }

    if(this.triggerLabel){
      return html `
        ${this._getTriggerLabel()}
    `;
    }

    return html `${this._getDefaultTriggerElement()}`;
  }

  /**
   * @returns Trigger icon and label.
   * @protected
   */
  _getTriggerIconWithLabel(){
    return html `
      <dw-button class="trigger-icon-label">
        <dw-icon .size="${this.triggerIconSize}" name="${this.triggerIcon}"></dw-icon> 
        ${this.triggerLabel}
      </dw-button>`
  }

  /**
   * @returns Trigger icon element.
   * @protected
   */
  _getTriggerIcon() {
    if(this.triggerIcon) {
      return html `
        <dw-icon-button
          .buttonSize="${this.triggerButtonSize}"
          class="trigger-icon"
          ?hidden="${!this.triggerIcon}"
          .iconSize="${this.triggerIconSize}"
          ?disabled="${this.readOnly}"
          icon="${this.triggerIcon}">
        </dw-icon-button>
      `
    }

    return html ``;
  }

  /**
   * @returns Trigger label element.
   * @protected
   */
  _getTriggerLabel() {
    if(this.triggerLabel) {
      return html `<dw-button class="trigger-label" .label="${this.triggerLabel}"></dw-button>`
    }

    return html ``;
  }

  /**
   * @returns Default trigger element.
   * @protected
   */
  _getDefaultTriggerElement() {
    let selectedText = this._computeSelectedItemsText(this.items, this.value, this.itemLabel, this.itemValue);
    return html `
      <div class="label caption">
        <div>${this.label}</div>
      </div>
      <div class="dropdown-input">
        <div class="value-container">
          ${!selectedText ? 
                html`<div class="placeholder field">${this.placeholder}</div>`
                : html`<div class="value field">${selectedText}</div>`}
        </div>
       ${this._getDropDownArrowIcon()}
      </div>
    `;
  }

  /**
   * Invoked when user click trigger element.
   * When trigger element is icon then wait for icon button ripple is completed then dialog open or close.
   */
  async _onClick() {
    if(this.readOnly){
      return;
    }

    let triggerIcon = this.shadowRoot.querySelector('.trigger-icon');
    triggerIcon && triggerIcon.waitForEntryAnimation && await triggerIcon.waitForEntryAnimation;
    this.opened = !this.opened;
  }

  _valueChanged(e) {
    this.value = e.detail.value;
    this.selected = e.detail.selected;
    
    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: e.detail
    }));

    this.validate();
  }

  _openedChanged(e) {
    this.opened = e.detail.opened;
    this._triggerOpenedChange();
    this._mobileModeOverlay();
  }

  _triggerOpenedChange() {
    let openedChangeEvent = new CustomEvent('opened-changed', {
      detail: {
        opened: this.opened
      }
    });
    this.dispatchEvent(openedChangeEvent);
  }

  _triggerInvalidChange() {
    let invalidChangeEvent = new CustomEvent('invalid-changed', {
      detail: {
        invalid: this.invalid
      }
    });
    this.dispatchEvent(invalidChangeEvent);
  }

  /**
   * Show overlay in modile mode when dialog is opend.
   * Close overlay when dialog is closed.
   * @protected
   */
  _mobileModeOverlay() {
    let self = this;
    self._overlay = false;
    if(!self.mobileMode || !self.opened) {
      return;
    }

    //Show dropdown using animation, So overlay show after some time because remove a jerk.
    window.setTimeout(()=> {
      self._overlay = true;
    }, 100);
  }

  _computeSelectedItemsText(items, value, itemLabel, itemValue) {
    if(this.selectedItemsText){
      return this.selectedItemsText(items, value, itemLabel, itemValue);
    }
    return this._selectedItemsText(items, value, itemLabel, itemValue);
  }

  _getItemLabel(items, value, itemLabel, itemValue) {
    if(!items){
      return '';
    }
    let matchedItem = items.find((item) => {
      return item[itemValue] === value;
    });
    return matchedItem ? matchedItem[itemLabel] : '';
  }

  _selectedItemsText(items, value, itemLabel, itemValue) {
    if(!value) {
      return '';
    }

    if(this.singleSelect){
      return !itemLabel ? value : this._getItemLabel(items, value, itemLabel, itemValue);
    }

    if(value.length === 1) {
      return !itemLabel ? value[0] : (this._getItemLabel(items, value[0], itemLabel, itemValue) || '1 item');
    }

    return `${value.length} items`;
  }
}

customElements.define('dw-select', DwSelect);