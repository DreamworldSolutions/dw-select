import { LitElement, html, css } from 'lit-element';
import { dropdownArrowIcon } from './dw-select-icons';
import './dw-select-dialog';

/**
 * Trigger for `dw-select-dialog`
 */
class DwSelect extends LitElement {

  static get styles() {
    return css`
    :host {
      display: block;
      box-sizing: border-box;
      width: 250px;
    }
    :host([invalid]) .label {
      color: red;
    }
    :host([invalid]) .dropdown {
      border-color: red;
    }
    .down-arrow {
      height: 16px;
      width: 16px;
      padding: 0px 4px;
    }
    .dropdown {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 4px 0px;
      border-bottom: 1px solid #585858;
    }
    .label {
      font-size: 14px;
    }
    .placeholder {
      color: gray;
    }
    .error-message {
      color: red;
      font-size: 12px;
    }
    .container {
      cursor: pointer;
    }
    `;
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
      opened: Boolean,
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
       * The element that should be used to position the element
       */
      _positionTarget: Object,
      _dropdownRendered: Boolean
    };
  }

  constructor() {
    super();
    this.opened = false;
    this.singleSelect = false;
    this._dropdownRendered = false;
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

    let selectedText = this._computeSelectedItemsText(this.items, this.value, this.itemLabel, this.itemValue);

    return html`
      <div class="container" @click="${this._onClick}">
        <div id="positionTarget" tabindex="0">
          <div class="label">
            <div>${this.label}</div>
          </div>
          <div class="dropdown">
            <div class="value-container">
              ${!selectedText ? html`<div class="placeholder">${this.placeholder}</div>`
                    : html`<div class="value">${selectedText}</div>`}
            </div>
            <div class="down-arrow">${this._getDropDownArrowIcon()}</div>
          </div>
        </div>
        ${this.invalid ? html`
          <div class="error-message">${this.errorMessage}</div>
        ` : ''}
      </div>
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
        @value-changed=${this._valueChanged}
        @opened-changed=${this._openedChanged}
      ></dw-select-dialog>
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
    this._positionTarget = this.shadowRoot.getElementById('positionTarget');
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