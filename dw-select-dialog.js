import { html, css } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';
import { cache } from 'lit-html/directives/cache.js';
import { DwSelectBaseDialog } from './dw-select-base-dialog';
import { backIcon, clearIcon } from './dw-select-icons';
import './dw-select-item';

class DwSelectDialog extends DwSelectBaseDialog {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: none;
          box-sizing: border-box;
          background: var(--primary-background-color, #FFFFFF);
          flex-direction: column;
          -ms-flex-direction: column;
          -webkit-flex-direction: column;
          outline: none;
          z-index: 9;
          width: var(--dw-select-dialog-width, 280px);
        }

        :host([opened]) {
          display: -ms-flexbox;
          display: -webkit-flex;
          display: flex;
        }

        :host([mobile-mode]) {
          width: 100%;
        }

        :host([scrolled-down]) .footer {
          box-shadow:  0 -1px 3px 0 rgba(0,0,0,0.12), 0 1px 2px 0 rgba(0,0,0,0.24);
        }

        :host([scrolled-down][scrolled-up]) .header {
          box-shadow: 0 1px 3px 0 rgba(0,0,0,0.12), 0 1px 2px 0 rgba(0,0,0,0.24);
        }

        .header .dialog-header {
          display: flex;
          display: -ms-flexbox;
          display: -webkit-flex;
          flex-direction: row;
          -ms-flex-direction: row;
          -webkit-flex-direction: row;
          align-items: center;
          -ms-flex-align: center;
          -webkit-align-items: center;
          min-height: var(--dw-select-dialog-header-hegiht, 48px);
          padding: 0px 24px 0px 8px;
        }

        .header .dialog-header .title {
          flex: 1;
          padding-left: 24px;
          font-weight: 400;
          font-size: 16px; 
          color: var(--primary-text-color, rgba(0,0,0,0.87));
          line-height: 16px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }

        .header .dialog-header .back-icon {
          height: var(--dw-select-back-icon-width, 24px);
          width: var(--dw-select-back-icon-height, 24px);
          fill: var(--secondary-text-color, rgba(0,0,0,0.54));
          cursor: pointer;
          outline: none;
          padding: 8px;
        }

        .header .dialog-header .back-icon:focus { 
          background: var(--dw-select-back-icon-ripple-color, rgb(33, 33, 33, 0.2));
          border-radius: 50%;
        }

        .header .dialog-header .count {
          background-color: var(--primary-color, #5AB983);
          color: var(--light-theme-background-color, #FFFFFF);
          line-height: 20px;
          border-radius: 50%;
          min-width: 18px;
          height: 18px;
          font-weight: 500;
          padding: 5px;
          text-align: center;
        }

        .header .border {
          border: 1px solid var(--divider-color, rgba(0,0,0,0.12));
        }

        .header .input-container { 
          padding: 8px;
          position: relative;
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
        }

        .header .input-container input {
          height: var(--dw-select-input-height, 48px);
          width: var(--dw-delect-input-width, 100%);
          border: 1px solid var(--divider-color, rgba(0,0,0,0.12));
          border-radius: 2px;
          color: var(--secondary-text-color, rgba(0,0,0,0.54));
          text-indent: 16px;
          outline: none;
          box-sizing: border-box;
        }

        .header .input-container input::placeholder {
          color: var(--disabled-color,rgba(0,0,0,0.26));
        }

        .header .input-container .hidden,
        .header .input-container.hidden {
          display: none;
        }

        .header .input-container .clear-text-icon {
          position: absolute;
          top: 25px;
          right: 24px;
          width: var(--dw-select-clear-icon-width, 18px);
          height: var(--dw-select-clear-icon-height, 18px);
          fill: var(--secondary-text-color, rgba(0,0,0,0.54));
          cursor: pointer;
        }

        .main-content {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          min-height: 50px;
        }

        .main-content .selection-action-buttons {
          height: 48px;
          margin-top: 8px;
          display: flex;
          display: -ms-flexbox;
          display: -webkit-flex;
          flex-direction: row;
          -ms-flex-direction: row;
          -webkit-flex-direction: row;
          font-size: 14px;
          line-height: 20px;
          font-weight: 500;
          padding-left: 16px;
        }

        .main-content .selection-action-buttons button { 
          color: var(--primary-color, #5AB983);
          text-transform: uppercase;
          background: var(--light-theme-background-color, #FFFFFF);
          border: none;
          outline: none;
          cursor: pointer;
          border-radius: 2px;
          padding: 0px 8px;
        }

        .main-content .selection-action-buttons button:hover {
          background: var(--dw-select-button-hover-color, rgba(90,185,131,0.16));
        }

        .main-content .selection-action-buttons button:focus{
          background: var(--dw-select-button-focus-color, rgba(90,185,131,0.16));
        }

        .main-content .selection-action-buttons button::-moz-focus-inner {
          border: 0;
        }

        .main-content .items-container .group-label {
          display: flex;
          display: -ms-flexbox;
          display: -webkit-flex;
          flex-direction: column;
          -ms-flex-direction: column;
          -webkit-flex-direction: column;
          -ms-flex-pack: center;
          -webkit-justify-content: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 500;
          line-height: 24px;
          color: var(--secondary-text-color, rgba(0,0,0,0.54));
          height: var(--dw-select-group-label-height, 48px);
          padding-left: 16px;
        }

        .main-content .items-container  .item.kb-highlighted {
          background: var(--light-primary-color, rgba(90,185,131,0.16));
        }

        .footer {
          display: flex;
          display: -ms-flexbox;
          display: -webkit-flex;
          flex-direction: column;
          -ms-flex-direction: column;
          -webkit-flex-direction: column;
          align-items: center;
          -ms-flex-align: center;
          -webkit-align-items: center;
          padding: 10px 0px;
          width: 100%;
        }

        .footer button {
          height: 36px;
          border-radius: 2px;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          background: var(--primary-color, #5AB983);
          color: var(--light-theme-background-color, #FFFFFF);
          width: var(--dw-select-apply-button-width, 232px);
          font-size: 14px;
          line-height: 20px;
          font-weight: 500;
          text-align: center;
        }
        
        .footer button[disabled] {
          background: var(--dw-select-apply-button-disable-color,  rgba(0,0,0,0.26));
        }

        .main-content .items-container dw-select-item.hidden {
          display: none;
        }
      `
    ];
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

  static get properties() {
    return {
      /**
       * Input property. The title for dialog
       */
      dialogTitle: { type: String },
      /**
       * Input property. A full set of items to filter the visible options from. The items can be of either String or Object type.
       */
      items: { type: Array },
      /**
       * Input + Output property. True if the dropdown is open, false otherwise.
       */
      opened: { type: Boolean, reflect: true },
      /**
       * Input property. When true, header will be hidde. header contains Back button, Dialog title, count
       * Default value: false
       */
      noHeader: { type: Boolean, reflect: true, attribute: 'no-header' },
      /**
       * Input property. Display multiselect in mobile mode (full screen) and no keyboard support
       * Default value: false
       */
      mobileMode: { type: Boolean, reflect: true, attribute: 'mobile-mode' },
      /**
       * Input property. By default, it allows multiple selection. when this property is set, it will behave as single select control.
       * Default value: false
       */
      singleSelect: { type: Boolean },
      /**
       * Input property. Allows user to filter items by typing query.
       * Default value: false
       */
      allowFilter: { type: Boolean },
      /**
       * Input property. A placeholder string for search/filter input.
       */
      filterPlaceholder: { type: String },
      /**
       * Input + Output property. The String value for the selected item of the multiselect.
       * It can be of either String or Array type.
       */
      value: { type: Array },
      /**
       * Output property. The selected item from the items array.
       * It can be of either String, object or Array type.
       */
      selected: { type: Array },
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
       * Input property. Path for groupBy of the item. i.e "type" in items
       */
      groupBy: { type: String },
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
       * Output property. True when user scrolled down in items overflow
       */
      scrolledDown: { type: Boolean, reflect: true, attribute: 'scrolled-down' },
      /**
       * Output property. True when user scrolled up in items overflow
       */
      scrolledUp: { type: Boolean, reflect: true, attribute: 'scrolled-up' },
      /**
       * Sorted items based on groupBy.
       * Template loop is written on this property.
       */
      _items: { type: Array },
      /**
       * Entries of selected item's inexes
       * key: index in `_items`
       * value: `true`
       */
      _selectedMap: { type: Object },
      /**
       * Live selected items, Initially it is copied from "selected"
       * It can be of either String, object or Array type.
       */
      _selected: { type: Array },
      /**
       * Live String value for the selected item,
       * Initially it is copied from "value"
       * t can be of either String or Array type.
       */
      _value: { type: Array },
      /**
       * True when there are no items selected or selection isn't changed after opening.
       * Apply button is disabled
       */
      _applyDisabled: { type: Boolean },
      /**
       * Search query
       */
      _filterQuery: { type: String },
      /**
       * True when search query is not empty
       */
      _filteredApplied: { type: Boolean },
      /**
       * Entries of visible item's inexes when filter is applied
       * key: index in `_items`
       * value: true
       */
      _filteredIndexMap: { type: Object },
      /**
       * Group by state where _groupByIndexMap[index] = true means that items[index]
       * key: index in `_items`
       * value: groupBy value
       */
      _groupByIndexMap: { type: Object },
      /**
       * Keyboard highlighted index
       */
      _kbHighlightedIndex: { type: Boolean }
    };
  }

  constructor() {
    super();
    this._valueKeyGenerator = this._valueKeyGenerator.bind(this);
    this._applyClicked = this._applyClicked.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onScroll = this._onScroll.bind(this);
    this._updateScrolledFlags = this._updateScrolledFlags.bind(this);
    this._selectedMap = {};
    this.opened = false;
    this.singleSelect = false;
    this._items = [];
    this._emptyValue = '__empty__';
    this._filterQuery = '';
    this.filterPlaceholder = '';
    this._filteredApplied = false;
    this.allowFilter = false;
    this.noHeader = false;
    this.mobileMode = false;
    this.scrolledDown = false;
    this.scrolledUp = false;
    this._filteredIndexMap = {};
    this._groupByIndexMap = {};
    this._kbHighlightedIndex = 0;
    this.dialogTitle = 'Select';
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

  connectedCallback() {
    super.connectedCallback();
    if(!this.opened) {
      return;
    }

    this._refitPending = true;
    this.updateComplete.then((result) => {
      if(this._refitPending && result && this.opened) {
        this.refit();
      }
      this._refitPending = false;
    });
  }

  render() {
    return html`
      ${cache(this.opened ? this._renderContent(this._items) : '')}
    `;
  }

  _renderContent(items) {
    let groupLabelFinder = this._createGroupIndexFinder(this.groupBy, this._groupByIndexMap);

    return html`
      <div class="header">
        ${!this.noHeader ? html`
          <div class="dialog-header">
            <div class="back-icon" @click=${this._backClicked} tabindex="0" @keydown=${this._onBackBtnKeyDown}>${this._getBackIcon()}</div>
            <div class="title">${this.dialogTitle}</div>
            ${!this.singleSelect ? html`
              ${this._value.length ? html `<div class="count">${this._value.length}</div>` : html ``}
            ` : ''}
          </div>
          <div class="border"></div>
        ` : ''}
        <div class="input-container ${this.allowFilter ? '' : 'hidden'}">
          <input
            id="filter"
            type="text"
            .placeholder=${this.filterPlaceholder}
            @input=${this._inputChanged} 
            .value=${this._filterQuery} />
          <div class="clear-text-icon ${this._filteredApplied ? '' : 'hidden'}" @click=${this._clearFilter}>${this._getClearIcon()}</div>
        </div>
      </div>
      <div id="scroller" class="main-content">
        ${!this.singleSelect ? html`
          <div class="selection-action-buttons">
            <button class="select-button" @click=${this._selectAllClicked}>Select all</button>
            <button  @click=${this._resetClicked}>Reset</button>
          </div>
        ` : ''}
        <div class="items-container">
          ${repeat(items, this._valueKeyGenerator, (item, index) => html`
            ${this._renderItem({
              item,
              index,
              selected: this.isItemSelected(item),
              hidden: this._isItemFilteredOut(index),
              kbHighlighted: this._isItemKBHighlighted(index),
              group: groupLabelFinder(index, this._isItemFilteredOut(index))})}
          `)}
        </div>
      </div>
      ${!this.singleSelect ? html`
        <div class="footer">
          <button @click=${this._applyClicked} .disabled=${this._applyDisabled} @keydown=${this._onApplyBtnKeyDown}>Apply</button>
        </div>
      ` : ''}
    `;
  }

  _renderItem(model) {
    return html`
      ${model.group ? html`<div class="group-label">${model.group}</div>` : ''}
      <dw-select-item
        class="item ${model.hidden ? 'hidden' : ''} ${model.kbHighlighted ? 'kb-highlighted' : ''}"
        .itemLabel=${this.itemLabel}
        .itemValue=${this.itemValue}
        .selected=${model.selected}
        .item=${model.item}
        @click=${(e) => this._itemClicked(e, model)}>
      </dw-select-item>
    `;
  }

  shouldUpdate(changedProps) {
    super.shouldUpdate(changedProps);
    let openedChanged = changedProps.has('opened')

    if(this.opened){
      if(openedChanged || changedProps.has('items')) {
        this._computeGroupByItems();
      }
      if(!openedChanged && changedProps.has('items')) {
        this._updateFilter();
      }
      if(openedChanged) {
        this._clearFilter();
      }
      if(openedChanged || changedProps.has('items') || changedProps.has('value')) {
        this._copyInputValue();
        this._resetKbHighlightIndex();
      }
      if(openedChanged) {
        this._onOpened();
      }
    }

    if(!this.opened && openedChanged) {
      this._onClosed();
    }
    return openedChanged || this.opened;
  }

  updated(changedProps){
    super.updated(changedProps);

    if(changedProps.has('opened') && (this.opened || changedProps.get('opened')) && changedProps.get('opened') !== this.opened) {
      this._triggerOpenedChange();
    }

    if(this.opened && (changedProps.has('_kbHighlightedIndex') || changedProps.has('opened'))) {
      let itemEl = this.shadowRoot.querySelectorAll('.item')[this._kbHighlightedIndex];
      if(itemEl) {
        itemEl.scrollIntoView(false);
      }
    }

    if(this.opened && (changedProps.has('items') || changedProps.has('opened'))) {
      this._refitPending = false;
      this.refit();
    }

    if(this.opened && (changedProps.has('items') || changedProps.has('_filterQuery')|| changedProps.has('opened'))) {
      this._updateScrolledFlags();
    }

    if(this.opened && changedProps.has('opened')) {
      this._addScrollEventListeners();
      this._setFocuAfterItemOpen();
    }
  }

  isItemSelected(item){
    let value = this._valueKeyGenerator(item) || this._emptyValue;

    if(this._selectedMap[value]) {
      return true;
    }
    return false;
  }

  selectByItem(item) {
    // already selected
    if(this.isItemSelected(item)) {
      return;
    }

    let itemValue = this._valueKeyGenerator(item);
    let key = itemValue || this._emptyValue;

    // When single select, unselect old selected item
    if(this.singleSelect) {
      let oldKey = this._value || this._emptyValue;
      delete this._selectedMap[oldKey];
    }

    this._selectedMap[key] = true;

    if(this.singleSelect) {
      this._selected = item;
      this._value = itemValue;
      this._triggerValueChange();
      return;
    }
    this._selected = [...this._selected, item];
    this._value = [...this._value, itemValue];
    this._computeApplyBtnDisabled();
  }

  deselectByItem(item) {
    if(this.singleSelect) {
      throw new Error('deselectByItem is not supported when singleSelect=true');
    }
    // already deselected
    if(!this.isItemSelected(item)) {
      return;
    }

    let itemValue = this._valueKeyGenerator(item);
    delete this._selectedMap[itemValue];
    
    this._selected = this._removeByIndex(this._selected, this._findItemIndexByValue(this._selected, itemValue));
    let index = this._value.indexOf(itemValue);

    if(index !== -1) {
      this._value = this._removeByIndex(this._value, index);
      this._computeApplyBtnDisabled();
    }
  }

  _addKeyEventListeners() {
    if(this.mobileMode) {
      return;
    }
    this._removeKeyEventListeners();
    document.addEventListener('keydown', this._onKeyDown);
  }

  _removeKeyEventListeners() {
    document.removeEventListener('keydown', this._onKeyDown);
  }

  _addScrollEventListeners() {
    this._removeScrollEventListeners();
    let scrollerEl = this.shadowRoot.querySelector('#scroller');
    if(scrollerEl){
      scrollerEl.addEventListener('scroll', this._onScroll, {passive: true});
    }
  }

  _removeScrollEventListeners() {
    let scrollerEl = this.shadowRoot.querySelector('#scroller');
    if(scrollerEl){
      scrollerEl.removeEventListener('scroll', this._onScroll, {passive: true});
    }
  }

  _onBackBtnKeyDown(e) {
    var keyCode = e.keyCode || e.which;
    
    if(keyCode === 13) {
      e.stopPropagation();
      this.close();
    }
  }

  _onApplyBtnKeyDown(e) {
    var keyCode = e.keyCode || e.which;
    
    if(keyCode === 13) {
      e.stopPropagation();
    }
  }

  _onOpened() {
    super._onOpened();
    this._addKeyEventListeners();
    this._addScrollEventListeners();
  }

  _onClosed() {
    super._onClosed();
    this._removeKeyEventListeners();
    this._removeScrollEventListeners();
  }

  _getBackIcon() {
    return backIcon;
  }

  _getClearIcon(){
    return clearIcon;
  }

  _resetKbHighlightIndex() {
    this._kbHighlightedIndex = this._items.findIndex((item, index) => {
      if(!this._filteredApplied || this._filteredIndexMap[index]){
        return true;
      }
    });
  }

  _computeGroupText(label) {
    return this.groupText ? this.groupText(label) : label;
  }

  _createGroupIndexFinder(groupBy, groupByIndexMap) {
    groupByIndexMap = {...groupByIndexMap};
    let pendingLabel = '';

    return (index, hidden) => {
      if(!groupBy) {
        return;
      }

      let groupLabel = groupByIndexMap[index];

      if(groupLabel) {
        if(!hidden) {
          pendingLabel = '';
          return this._computeGroupText(groupLabel);
        }
        pendingLabel = groupLabel;
        return;
      }

      if(pendingLabel && !hidden) {
        groupLabel = pendingLabel;
        pendingLabel = '';
        return this._computeGroupText(groupLabel);
      }
    };
  }

  _onScroll(){
    window.requestAnimationFrame(this._updateScrolledFlags);
  }

  _onKeyDown(e) {
    var keyCode = e.keyCode || e.which;
    
    if(keyCode === 38) {
      e.preventDefault();
      this._onUpArrowKeyDown();
    }
    else if(keyCode === 40) {
      e.preventDefault();
      this._onDownArrowKeyDown();
    }
    else if(keyCode === 13) {
     // e.preventDefault();
      this._onEnterKeyDown(e);
    }
    else if(keyCode === 27) {
      e.preventDefault();
      this._onEscKeyDown();
    }
  }

  _onUpArrowKeyDown() {
    for(let i = (this._kbHighlightedIndex - 1); i >= 0; i--) {
      if(!this._filteredApplied || this._filteredIndexMap[i]){
        this._kbHighlightedIndex = i;
        break;
      }
    }
  }

  _onDownArrowKeyDown() {
    for(let i = (this._kbHighlightedIndex + 1); i < this._items.length; i++) {
      if(!this._filteredApplied || this._filteredIndexMap[i]){
        this._kbHighlightedIndex = i;
        break;
      }
    }
  }

  _onEnterKeyDown(e) {
    let item = this._items[this._kbHighlightedIndex];

    if(item) {
      this._toggleItem(item);
    }
  }

  _onEscKeyDown() {
    this.close();
  }

  _updateScrolledFlags() {
    let scrollerEl = this.shadowRoot.querySelector('#scroller');
    if(!scrollerEl) {
      return;
    }
    this.scrolledDown = scrollerEl.scrollTop > 15;
    this.scrolledUp = (scrollerEl.scrollHeight - scrollerEl.offsetHeight - scrollerEl.scrollTop) > 15;
  }

  _selectAllClicked() {
    if(!this.items) {
      return;
    }

    let selectedMap = {};
    this._value = this.items.map((item) => {
      let itemValue = this._valueKeyGenerator(item);
      selectedMap[itemValue] = itemValue;
      return itemValue;
    });

    this._selected = this.items.slice();
    this._selectedMap = selectedMap;
    this._computeApplyBtnDisabled();
  }

  _resetClicked() {
    this._value = [];
    this._selected = [];
    this._selectedMap = {};
    this._computeApplyBtnDisabled();
  }

  _computeGroupByItems() {
    if(!this.groupBy){
      this._groupByIndexMap = {};
      this._items = this.items;
      return;
    }

    if(!this.items || !this.items.length) {
      this._groupByIndexMap = {};
      this._items = [];
      return;
    }

    let groupByMap = {};
    let itemsWithoutGroup = [];

    this.items.forEach((item) => {
      let groupByValue = item[this.groupBy];
      if(!groupByValue) {
        itemsWithoutGroup.push(item);
        return;
      }

      if(!groupByMap[groupByValue]) {
        groupByMap[groupByValue] = [];
      }

      groupByMap[groupByValue].push(item);
    });

    let groupByItems = [...itemsWithoutGroup];
    let groupByIndexMap = {};

    if(this.groupByOrder) {
      this.groupByOrder.forEach((groupBy) => {
        if(groupByMap[groupBy]) {
          groupByIndexMap[groupByItems.length] = groupBy;
          groupByItems = groupByItems.concat(groupByMap[groupBy]);
          delete groupByMap[groupBy];
        }
      });
    }

    for(let groupBy in groupByMap) {
      groupByIndexMap[groupByItems.length] = groupBy;
      groupByItems = groupByItems.concat(groupByMap[groupBy]);
    }

    this._items = groupByItems;
    this._groupByIndexMap = groupByIndexMap;
  }

  _copyInputValue() {
    let selectedMap = {};

    if(this.singleSelect) {
      this._value = this.value || this._emptyValue;
      this._selected = this._findItemByValue(this.items, this._value);
      selectedMap[this._value] = true;
      this._selectedMap = selectedMap;
      return;
    }

    this._value = this.value ? this.value.slice() : [];

    let selected = [];
    this._value.forEach((itemValue) => {
      if(!itemValue) {
        return;
      }

      let selectedItem = this._findItemByValue(this.items, itemValue);

      selectedMap[itemValue] = true;

      if(selectedItem){
        selected.push(selectedItem);
      }
    });
    this.selected = selected.slice();
    this._selected = selected;
    this._selectedMap = selectedMap;
    this._computeApplyBtnDisabled();
  }

  _triggerOpenedChange() {
    let openedChangeEvent = new CustomEvent('opened-changed', {
      detail: {
        opened: this.opened
      }
    });
    this.dispatchEvent(openedChangeEvent);
  }

  _triggerValueChange() {
    this.close();
    this.value = this._value;
    this.selected = this._selected;

    let valueChangeEvent = new CustomEvent('value-changed', {
      detail: {
        value: this.value,
        selected: this.selected
      }
    });
    this.dispatchEvent(valueChangeEvent);
  }

  _removeByIndex(items, index){
    if(index === -1){
      return items
    }
    items = items.slice();
    items.splice(index, 1);
    return items;
  }

  _isItemFilteredOut(index) {
    if(!this._filteredApplied) {
      return false;
    }

    return this._filteredIndexMap[index] ? false : true;
  }

  _isItemKBHighlighted(index) {
    if(this.mobileMode){
      return false;
    }
    return index === this._kbHighlightedIndex;
  }

  _findItemIndexByValue(items, itemValue){
    return items.findIndex((item) => {
      let key = this._valueKeyGenerator(item);
      if(itemValue === this._emptyValue){
        return key ? false: true;
      }
      return key === itemValue;
    });
  }

  _findItemByValue(items, value){
    return items.find((item) => {
      let key = this._valueKeyGenerator(item);
      if(value === this._emptyValue){
        return key ? false: true;
      }
      return key === value;
    });
  }

  _valueKeyGenerator(item) {
    if(!this.itemValue) {
      return item;
    }
    return item[this.itemValue];
  }

  _toggleItem(item) {
    if(!this.isItemSelected(item)){
      this.selectByItem(item);
      return;
    }

    // Allow to deselect only if multi select is enabled
    if(!this.singleSelect) {
      this.deselectByItem(item);
    }
  }

  _itemClicked(e, model) {
    this._toggleItem(model.item);
  }

  _setFocuAfterItemOpen() {
    if(this.mobileMode || !this.allowFilter) {
      return;
    }
    let filterInputEl = this.shadowRoot.querySelector('#filter');
    if(!filterInputEl) {
      return;
    }
    filterInputEl.focus();
  }

  _inputChanged(e) {
    this._filterQuery = e.target.value.toLowerCase();
    this._updateFilter();
  }

  _backClicked() {
    this.close();
  }

  _clearFilter() {
    if(!this._filteredApplied) {
      return;
    }
    this._filterQuery = '';
    this._updateFilter();
  }

  _updateFilter() {
    if(!this._filterQuery) {
      this._filteredIndexMap = {};
      this._filteredApplied = false;
      this._resetKbHighlightIndex();
      return;
    }

    let filteredIndex = {};
    this._items.forEach((item, index) => {
      let isFiltered = this._filter(item, this._filterQuery, this.itemLabel);
      if(isFiltered) {
        filteredIndex[index] = true;
      }
    });
    this._filteredIndexMap = filteredIndex;
    this._filteredApplied = true;
    this._resetKbHighlightIndex();
  }

  _filter(item, query, itemLabel){
    let label;

    if(itemLabel) {
      label = item[itemLabel];
    } else {
      label = item;
    }

    return label.toLowerCase().indexOf(query) !== -1;
  }

  _computeApplyBtnDisabled() {
    if(!this._value || !this._value.length){
      this._applyDisabled = true;
      return;
    }

    let inputValue = this.value || [];
    if(inputValue.length !== this._value.length){
      this._applyDisabled = false;
      return;
    }

    let map = {};
    inputValue.forEach((value) => {
      map[value] = true;
    });

    let notExistsValue = this._value.find((value) => {
      if(!map[value]) {
        return true;
      }
    });

    this._applyDisabled = notExistsValue ? false : true;
  }

  _applyClicked() {
    if(!this._applyDisabled) {
      this._triggerValueChange();
    }
  }
}

customElements.define('dw-select-dialog', DwSelectDialog);