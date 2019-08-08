import { LitElement, html, css } from 'lit-element';
import { dropdownArrowIcon } from './dw-select-icons';
import { Typography } from '@dw/material-styles/typography';
import { getIcon } from 'icons';
import './dw-select-dialog';

/**
 * Trigger for `dw-select-dialog`
 */
export class DwSelect extends LitElement {

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

    .main-container #dropdownContainer .trigger-icon {
      height: var(--dw-select-trigger-icon-height, 36px);
      width: var(--dw-select-trigger-icon-width, 36px);
      fill: var(--dw-select-trigger-icon-fill-color);
      margin: var(--dw-select-trigger-icon-margin, 0px);
      padding: var(--dw-select-trigger-icon-padding, 0px);
    }

    .main-container #dropdownContainer .trigger-label {
      text-transform: var(--dw-select-trigger-label-text-transform, initial);
      width: var(--dw-select-trigger-label-width, auto);
      height: var(--dw-select-trigger-label-height, 36px);
      fill: var(--dw-select-trigger-label-color);
      margin: var(--dw-select-trigger-label-margin, 0px);
      padding: var(--dw-select-trigger-label-padding, 8px);
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

    .main-container  #dropdownContainer .dropdown-input .expand-more-icon {
      padding: 0px 4px;
      width: var(--dw-select-expand-more-icon-width, 24px);
      height: var(--dw-select-expand-more-icon-height, 24px);
      fill: var(--dw-select-expand-more-icon-color);
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

    :host([overlay]) #overlay {
      display:block;
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
      label: String,
      /**
       * Input property. A placeholder string in addition to the label.
       */
      placeholder: String,
      /**
       * Input property. A placeholder string for search/filter input.
       */
      filterPlaceholder: String,
      /**
       * Input property. A full set of items to filter the visible options from. The items can be of either String or Object type.
       */
      items: Array,
      /**
       * Input + Output property. True if the dropdown is open, false otherwise.
       */
      opened: { type: Boolean, reflect: true },
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
       * Input property. By default, it allows multiple selection. when this property is set, it will behave as single select control.
       * Default value: false
       */
      singleSelect: Boolean,
      /**
       * Input property. Path for label of the item. If items is an array of objects, the itemLabel is used to fetch the displayed string label for each item.
       * The item label is also used for matching items when processing user input, i.e., for filtering .
       */
      itemLabel: String,
      /**
       * Input property. Path for the value of the item. If items is an array of objects, the itemValue: is used to fetch the string value for the selected item.
       */
      itemValue: String,
      /**
       * Input property. Allows user to filter items by typing query.
       * Default value: false
       */
      allowFilter: Boolean,
      /**
       * Input property. Path for groupBy of the item. i.e "type" in items
       */
      groupBy: String,
      /**
       * Input + Output property. The String value for the selected item of the multiselect.
       * It can be of either String or Array type.
       */
      value: String,
      /**
       * Output property. The selected item from the items array.
       * It can be of either String, object or Array type.
       */
      selected: Object,
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
      errorMessage: String,
      /**
       * Input property. Array of string, to specify orders of group
       * i.e ["CONTACT", "BANK"]
       */
      groupByOrder: Array,
      /**
       * Input property. Custom function for rendering group label. Receives one argument:
       * - `value` Value of groupBy key in item
       */
      groupText: Object,
      /**
       * Input property. The title for dialog
       */
      dialogTitle: String,
      /**
       * Input property. Custom function for rendering text of selected items. Receives four arguments:
       * - `items` A full set of items
       * - `value` The String value for the selected item of the multiselect.
       * - `itemLabel` Path for the label of the item.
       * - `itemValue` Path for the value of the item.
       */
      selectedItemsText: Object,

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
      alwaysFullScreenInMobile: Boolean,

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
      _positionTarget: Object,
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
      _overlay: { type: Boolean, reflect: true,  attribute: 'overlay'},

      _dropdownRendered: Boolean
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
    this.vAlign = 'top';
    this.filterPlaceholder = '';
    this.items = [];
    this.hideResetBtn = false;
    this.hideSelectAllBtn = false;
    this.stickySelectionButtons = false;
    this.selectionButtonsAlign = 'left';
    this.alwaysFullScreenInMobile = false;
    this.iconSize = 24;
    
    this._dropdownRendered = false;
    this._overlay = false;
  }

  /**
   * Show the dropdown content
   */
  open() {
    if(this.opened){
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
        .items=${this.items}
        .itemLabel=${this.itemLabel}
        .itemValue=${this.itemValue}
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
    this._positionTarget = this.shadowRoot.getElementById('dropdownContainer');
  }

  connectedCallback() {
    super.connectedCallback();
    this._addKeyEventListeners();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._removeKeyEventListeners();
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
    return dropdownArrowIcon;
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

    if(this.triggerIcon || this.triggerLabel) {
      return html `
        ${this._getTriggerIcon()}
        ${this._getTriggerLabel()}
      `;
    }

    return html `${this._getDefaultTriggerElement()}`;
  }

  /**
   * @returns Trigger icon element.
   * @protected
   */
  _getTriggerIcon() {
    if(this.triggerIcon) {
      return html `<div class="trigger-icon " ?hidden="${!getIcon(this.triggerIcon)}">${getIcon(this.triggerIcon)}</div>`
    }

    return html ``;
  }

  /**
   * @returns Trigger label element.
   * @protected
   */
  _getTriggerLabel() {
    if(this.triggerLabel) {
      return html `<div class="trigger-label">${this.triggerLabel}</div>`
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
        <div class="expand-more-icon">${this._getDropDownArrowIcon()}</div>
      </div>
    `;
  }

  _onClick() {
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