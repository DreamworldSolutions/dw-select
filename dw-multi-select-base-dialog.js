import { DwCompositeDialog } from '@dreamworld/dw-dialog/dw-composite-dialog.js';
import { css, html, nothing, unsafeCSS } from '@dreamworld/pwa-helpers/lit.js';
import '@lit-labs/virtualizer';
import { repeat } from 'lit/directives/repeat.js';

// View Elements
import '@dreamworld/dw-button';
import '@dreamworld/dw-icon';
import '@dreamworld/dw-list-item';
import './dw-multi-select-dialog-input';
import './dw-multi-select-group-item';

// Styles
import * as TypographyLiterals from '@dreamworld/material-styles/typography-literals';

// Lodash Methods
import { get, filter, orderBy, forEach, findIndex, isEmpty, map, isEqual } from 'lodash-es';

// Utils
import { Direction, KeyCode } from './utils.js';

const VIRTUAL_LIST_MIN_LENGTH = 500;
const defaultMessages = {
  noRecords: 'No Records',
  noMatching: 'No matching records found!',
  loading: 'Loading...',
};

const ItemTypes = {
  ITEM: 'ITEM',
  GROUP: 'GROUP',
};

/**
 * @summary dialog for multi select
 *
 * @behaviors
 *  - When `searchable`, filters list based on the search query.
 *  - Integrates `dw-list-item` or uses custom template provider `renderItem` to render List of Items
 *  - Keyboard accessibility
 *    - On Esc, when search query is empty, closes the dialog otherwise reset the query.
 *    - On SPACE-BAR, changes the selection.
 *    - On UP / DOWN, navigates through the items.
 *
 * ## Event
 * @event _value-change  when user select item from list
 * @event apply when user close the dialog ( on Ecs key press, on apply button click)
 *
 *
 * @usage
 *  <dw-multi-select-base-dialog .items=$items .value=$value></dw-multi-select-base-dialog>
 */

export class DwMultiSelectBaseDialog extends DwCompositeDialog {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          --dw-dialog-content-padding: 0;
          --dw-dialog-header-padding: 4px 4px 4px 16px;
          --dw-dialog-footer-padding: 16px;
          --dw-popover-max-height: calc(50vh - 24px);
        }

        :host([type='modal'][placement='center']) {
          --dw-dialog-min-width: 448px;
        }

        :host([type='modal']) .mdc-dialog .mdc-dialog__surface {
          min-width: var(--dw-dialog-min-width, 448px);
        }

        :host([type='popover']) .dialog__content {
          padding: var(--dw-select-content-padding, 0);
        }

        .no-record {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px;
          margin-top: 24px;
          --dw-icon-color: var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.38));
        }

        .no-record dw-icon {
          padding-bottom: 40px;
        }

        :host([type='modal']) .mdc-dialog .mdc-dialog__title {
          ${unsafeCSS(TypographyLiterals.headline6)};
          padding-bottom: 8px;
        }

        :host([type='popover']) header {
          padding: 16px 16px 8px 16px;
        }

        #dialog-header {
          z-index: 2;
        }

        .heading {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
          ${unsafeCSS(TypographyLiterals.headline6)};
        }

        :host(:not([searchable])) header {
          padding: 0px;
        }

        :host([type='modal']) .mdc-dialog__title::before {
          height: 0px;
          display: none;
        }

        :host([type='fit'][opened][has-header]) .mdc-dialog__content {
          padding: 0;
        }

        :host([type='fit'][opened]) .mdc-dialog__content {
          padding: 0;
        }

        :host([type='fit']) #dialog-header.mdc-dialog__title {
          padding: 4px 4px 4px 4px;
          z-index: 2;
        }

        :host(:not([type='popover'])) dw-multi-select-dialog-input {
          margin-right: 12px;
        }

        :host([type='fit']) dw-multi-select-dialog-input {
          margin-left: 12px;
        }

        .header-title {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .title {
          display: flex;
          align-items: center;
          gap: 4px;
          flex: 1;
          color: var(--mdc-theme-text-primary-on-surface, rgba(0, 0, 0, 0.87));
          padding-bottom: 4px;
        }

        :host(:not([type='fit'])) .title {
          justify-content: space-between;
        }

        .close-button {
          --dw-icon-color: var(--mdc-theme-text-secondary-on-surface, rgba(0, 0, 0, 0.6));
        }

        dw-list-item,
        dw-multi-select-group-item,
        .list-item,
        .group-item {
          width: 100%;
          box-sizing: border-box;
        }

        dw-multi-select-group-item {
          position: sticky;
          top: 112px;
          background-color: var(--mdc-theme-surface, #fff);
          z-index: 2;
        }

        :host(:not([searchable])) dw-multi-select-group-item,
        :host([type='modal']) dw-multi-select-group-item {
          top: 39px;
        }

        :host([type='fit']) dw-multi-select-group-item {
          top: 148px;
        }

        dw-list-item[selected] {
          --mdc-theme-text-primary: var(--mdc-theme-primary, #6200ee);
        }

        dw-list-item:not([disabled])[selected]::before {
          background-color: var(--dw-select-item-selected-bg-color, transparent);
          opacity: var(--dw-select-selected-item-bg-opacity, 0);
        }

        dw-list-item:not([disabled])[selected][activated]::before {
          background-color: var(--dw-select-item-selected-bg-color, var(--mdc-theme-primary, #6200ee));
          opacity: 0.12;
        }

        dw-list-item[semi-selected] {
          --dw-icon-color: var(--mdc-theme-primary);
        }

        dw-button {
          --mdc-shape-small: 18px;
          display: flex;
          flex: 1;
        }

        .shimmer {
          display: block;
          height: 20px;
          background: var(--dw-select-shimmer-gradient, linear-gradient(to right, #f1efef, #f9f8f8, #e7e5e5));
          border-radius: 6px;
          width: 45%;
          margin-top: 8px;
          margin-bottom: 16px;
          margin-left: 16px;
        }

        .custom-header {
          flex: 1;
        }

        .highlight {
          color: var(--dw-select-highlight-text-color);
          background-color: var(--dw-select-highlight-bg-color);
          font-weight: var(--dw-select-highlight-font-weight);
        }

        .content-action-button {
          display: flex;
          align-items: center;
          height: var(--dw-fit-dialog-content-action-button-height, 56px);
          padding: var(--dw-fit-dialog-content-action-button-padding, 8px 16px);
        }

        :host(:not([input-focused])) .content-action-button {
          position: sticky;
          bottom: 0;
          background-color: var(--mdc-theme-background, #ffffff);
        }

        .select-all {
          border-bottom: 1px solid var(--mdc-theme-divider-color, rgba(0, 0, 0, 0.12));
          position: sticky;
          top: 72px;
          z-index: 2;
          background-color: var(--mdc-theme-surface, #ffffff);
        }

        :host(:not([searchable])) .select-all,
        :host([type='modal']) .select-all {
          top: -1px;
        }

        :host([type='fit']) .select-all {
          top: 108px;
        }

        .select-count {
          background-color: var(--mdc-theme-primary);
          border-radius: 50px;
          min-width: 16px;
          height: 24px;
          ${unsafeCSS(TypographyLiterals.subtitle2)};
          display: flex;
          text-align: center;
          justify-content: center;
          color: var(--mdc-theme-background, #ffffff);
          align-items: center;
          padding: 0px 4px;
        }
      `,
    ];
  }

  static get properties() {
    return {
      /**
       * Selected list item object.
       * `object` in case of single selection;
       * `object[]` in case multiple selection.
       */
      value: { type: Array },

      /**
       * Represents the set of selected values.
       * This is an object that keeps track of the currently selected items.
       */
      _valueSet: { type: Object },

      _value: { type: Array },

      /**
       * Input Element
       * When it’s specified it binds keyboard event on this; Otherwise, it renders it’s own input in the header.
       * Integrator will set this value only for non-touch devices.
       */
      elInput: { type: Object },

      /**
       * Whether or not to show the `searchable` variant.
       */
      searchable: { type: Boolean, reflect: true },

      /**
       * Represents current layout in String. Possible values: `small`, `medium`, `large`, `hd`, and `fullhd`.
       */
      layout: { type: String },

      /**
       * `vkb` stands for Virtual KeyBoard. Whether the Device has Virtual keyboard or not.
       */
      vkb: { type: Boolean },

      /**
       * Input Property
       * A Group has properties: name, label
       */
      groups: { type: Object },

      /**
       * Replica of `groups`
       * Used to render items in group. When groups is changed it’s updated (through cloned array).
       * When user interacts, this property is changed but `groups` isn’t.
       */
      _groups: { type: Object },

      /**
       * A Function `(item) -> groupName` to identify a group from an item.
       */
      groupSelector: { type: Object },

      /**
       * Expression of Group
       */
      groupExpression: { type: String },

      /**
       * Original List of selectable items.
       */
      items: { type: Array },

      /**
       * Represents items to be rendered by lit-virtualizer.
       * { type: GROUP or ITEM, value: Group or Item object }
       * It’s computed from _groups, items & query.
       */
      _items: { type: Array },

      /**
       * A set of pre-selected items. This is used to keep track of the items that were
       * pre-selected before the dialog was opened.
       */
      _preSelectedItemsSet: { type: Object },

      _preselectedItems: { type: Array },

      /**
       * Provides value that actually represent in list items
       */
      valueProvider: { type: Object },

      /**
       * Expression of the value
       * default: _id
       */
      valueExpression: { type: String },

      itemLabelProvider: { type: Object },

      /**
       * Messages of for noRecords and noMatching
       * Example: {noRecords: "", noMatching: "", loading: "", allSelected: "", all: "", searchPlaceholder: ""}
       */
      messages: { type: Object },

      /**
       * Provides any Block element to represents list items
       * Should show it's hover effect; and ripple on click
       * Highlight text based on `query`
       * Integrator listens on the ‘click’ event to know whether selection is changed or not.
       * It must not be focusable.
       */
      renderItem: { type: Object },

      /**
       * Provides any Block elements to represents group items
       * name property should be set to input name.
       */
      renderGroupItem: { type: Object },

      /**
       * Set it if you would like to show a heading on the bottom-sheet dialog.
       * By default no heading.
       */
      heading: { type: String },

      /**
       * Shows an icon-button with a close icon,
       * in the `top-right` corner on the bottom-sheet dialog.
       */
      showClose: { type: Boolean },

      /** For seleact all item and other item. */
      dense: { type: Boolean },

      /**
       * true when close button or heading is provided.
       * use for set styles
       */
      _showHeader: { type: Boolean, reflect: true },

      /**
       * search query in string. used to filter items and highlight query keywords
       */
      _query: { type: String },

      /**
       * Input property. Default value is `true`.
       * When `false`, doesn't highlight matched words.
       */
      highlightQuery: { type: Boolean },

      /**
       * index of activated Item
       * default: -2
       */
      _activatedIndex: { type: Number },

      /**
       * Activated item
       * One of the Item from _items, by reference.
       */
      _activatedItem: { type: Object },

      /**
       * Custom header template as property
       */
      dialogHeaderTemplate: { type: Object },

      /**
       * Custom dialog content template as property
       */
      dialogContentTemplate: { type: Object },

      /**
       * Indicates whether the item should display a leading icon.
       * Use for `select-all` item icon position
       */
      hasItemLeadingIcon: { type: Boolean },

      /**
       * Custom footer template as property
       */
      dialogFooterTemplate: { type: Object },

      inputSuffixTemplate: { type: Object },

      /**
       * A function to customize search.
       */
      queryFilter: { type: Object },

      /**
       * Set this to configure custom logic to detect whether value is changed or not.
       * Default: compares both values by strict equality (by reference) `v1 === v2`.
       * It must return a Boolean.
       * Function receives 2 arguments: (v1, v2). Should return `true` when both values are same otherwise `false`.
       */
      valueEquator: { type: Object },

      /**
       * `true` when items count is more than 500.
       */
      _virtualList: { type: Boolean },

      /**
       * Set to true when the input element receives focus, and false when it loses focus.
       * This flag is reflected as an HTML attribute 'input-focused' on the element.
       */
      _inputFocused: { type: Boolean, reflect: true, attribute: 'input-focused' },
    };
  }

  /**
   * Get lit virtualizer element
   */
  get _listEl() {
    return this.renderRoot.querySelector('#list');
  }

  constructor() {
    super();
    this._query = '';
    this.highlightQuery = true;
    this.type = 'popover';
    this.showTrigger = true;
    this.valueExpression = '_id';
    this.heading = '';
    this.showClose = false;
    this._activatedIndex = -2;
    this.messages = defaultMessages;
    this.popoverOffset = [0, 4];
    this.OPEN_ANIMATION_TIME = 300; //In milliseconds.
    this._valueSet = new Set();
    this._preSelectedItemsSet = new Set();
    this._value = [];
    this._cancelledByUser = false; // True when cancelled by user, (On click cancel or Press esc).
  }

  willUpdate(props) {
    super.willUpdate(props);
    if (props.has('items')) {
      this._virtualList = this.items?.length > VIRTUAL_LIST_MIN_LENGTH;
    }

    if (props.has('groups')) {
      this._groups = this.groups;
      let groupsMap = {};
      forEach(this.groups, group => {
        groupsMap[group.name] = group;
      });
      this._groupsMap = groupsMap;
    }

    if (props.has('value')) {
      this._setValue();
    }

    if (props.has('_value')) {
      this._valueSet = new Set(this._value);
    }

    const hasValueItemsOrQuery = props.has('value') || props.has('items') || props.has('_query');
    const isValueAndItemsNotEmpty = !isEmpty(this._value) && !isEmpty(this.items);
    const isPreSelectedItemsEmpty = isEmpty(props.get('_preselectedItems'));
    const isQueryReset = props.get('_query') && !this._query;
    if (hasValueItemsOrQuery && isValueAndItemsNotEmpty && (isPreSelectedItemsEmpty || isQueryReset)) {
      this._setPreselectedItems();
    }

    if (hasValueItemsOrQuery) {
      this._setItems();
      this._moveActivatedToFirstItem();
    }

    if (props.has('_activatedIndex') || props.has('_items')) {
      this._activatedItem = this._getItem(this._activatedIndex);
    }

    if (props.has('messages')) {
      this.messages = { ...props.get('messages'), ...this.messages };
    }

    if (props.has('heading') || props.has('showClose')) {
      this._showHeader = !!this.heading || this.showClose;
    }
  }

  get _headerTemplate() {
    return html`
      ${this.type === 'fit' || this.type === 'modal'
        ? html`<div class="header-title">
            <div class="title">
              ${this.type === 'fit'
                ? html`<dw-icon-button class="close-button" icon="arrow_back" @click=${this._onCancel}></dw-icon-button>`
                : ''}
              <div class="heading">
                ${this.heading} ${this._value.length > 0 ? html`<span class="select-count">${this._value.length}</span>` : ''}
              </div>
              ${this.type !== 'fit'
                ? html`<dw-icon-button class="close-button" icon="close" @click=${this._onCancel}></dw-icon-button>`
                : ''}
            </div>
          </div>`
        : ''}
      ${this.searchable
        ? html`<dw-multi-select-dialog-input
            .value=${this._query || ''}
            .messages=${this.messages}
            .suffixTemplate=${this.inputSuffixTemplate}
            @input-change=${this._onInputChange}
            @clear-selection="${this._onClearSelection}"
            @input-focus="${this._onInputFocus}"
            @input-blur="${this._onInputBlur}"
          ></dw-multi-select-dialog-input>`
        : nothing}
      ${this.dialogHeaderTemplate ? html`<div class="custom-header">${this.dialogHeaderTemplate}</div>` : nothing}
    `;
  }

  get _contentTemplate() {
    if (this.dialogContentTemplate) {
      return this.dialogContentTemplate;
    }

    // Render Loading view when _items is `undefined`
    if (!this._items) {
      return this._renderLoading;
    }

    return html`
      ${this._items.length === 0 ? this._renderNoRecord : this._renderList}
      ${this.type === 'fit'
        ? html`<div class="content-action-button">${this.dialogFooterTemplate || this._defaultFooterTemplate}</div>`
        : ''}
    `;
  }

  get _defaultFooterTemplate() {
    if (this.type === 'popover') return;
    const value = this.value || [];
    return html`
      <dw-button unelevated ?disabled="${isEqual(this._value, value)}" size="small" @click=${this.close}>
        ${this.messages?.done || 'Done'}
      </dw-button>
    `;
  }

  get _footerTemplate() {
    if (this.type !== 'fit') {
      return this.dialogFooterTemplate || this._defaultFooterTemplate;
    }
  }

  get _selectAllItem() {
    if ((!this.searchable && this.items.length < 10) || this._query) return;
    const value = this._value || this.value;
    const selected = this.items.length === value.length;
    return html`<dw-list-item
      ?dense=${this.dense}
      id="select-all"
      class="select-all"
      ?semi-selected=${!isEmpty(this._value) && !selected}
      title1=${this.messages?.selectAll || 'Select All'}
      @click=${() => this._onSelectAll()}
      .selectionMode=${'none'}
      .selected=${selected}
      ?activated=${this._activatedIndex === -1}
      .focusable=${false}
      .trailingIcon=${this._getSelectAllItemIcon(selected)}
      .leadingIcon=${this._getSelectAllItemIcon(selected)}
      ?hasLeadingIcon=${!this.hasItemLeadingIcon}
      ?hasTrailingIcon=${this.hasItemLeadingIcon}
    ></dw-list-item>`;
  }

  get _renderLoading() {
    return html`
      <div class="shimmer"></div>
      <div class="shimmer"></div>
      <div class="shimmer"></div>
    `;
  }

  get _renderNoRecord() {
    return html`<div class="no-record">
      <dw-icon name="search_off" size="100"></dw-icon>
      <div>${this.items && this.items.length === 0 ? this.messages.noRecords : this.messages.noMatching}</div>
    </div>`;
  }

  get _renderList() {
    if (this.type === 'popover' && this._virtualList && !this._openAnimationCompleted) {
      return;
    }

    const renderItem = (item, index) => {
      const isSelected = this._isItemSelected(item.value);
      const isActivated = this._isItemActivated(index);
      return this._renderItem(item, isSelected, isActivated, this._query);
    };

    if (!this._virtualList) {
      return html`${this._selectAllItem}
        <div id="list">${repeat(this._items, renderItem)}</div>`;
    }

    return html`${this._selectAllItem}<lit-virtualizer id="list" .items=${this._items} .renderItem=${renderItem}></lit-virtualizer>`;
  }

  _renderItem(item, selected, activated, query) {
    if (!item) return nothing;
    if (item.type === ItemTypes.ITEM) {
      if (this.renderItem && typeof this.renderItem === 'function') {
        return this.renderItem(item.value, selected, activated, query, this._onItemClick.bind(this));
      }

      if (this.renderItem) console.warn('renderItem is not function');

      return html`
        <dw-list-item
          ?dense=${this.dense}
          class="list-item"
          title1=${this.itemLabelProvider(item.value)}
          .highlight=${this.highlightQuery ? this._query : ''}
          @click=${() => this._onItemClick(item.value)}
          ?activated=${activated}
          .selected=${selected}
          .selectionMode=${'none'}
          ?hasLeadingIcon=${true}
          .leadingIcon=${this._getLeadingIcon(item.value, selected)}
          .trailingIcon=${selected ? 'check_box' : 'check_box_outline_blank'}
          ?hasTrailingIcon=${this.hasItemLeadingIcon}
          .focusable=${false}
        ></dw-list-item>
      `;
    }

    if (item.type === ItemTypes.GROUP) {
      if (this.renderGroupItem && typeof this.renderGroupItem === 'function') {
        return this.renderGroupItem(item.value, activated);
      }

      if (this.renderGroupItem) console.warn('renderGroupItem is not function');

      return html`<dw-multi-select-group-item
        .name="${item.value.name}"
        .label="${this._getGroupValue(item.value)}"
        class="group-item"
        ?activated=${activated}
      ></dw-multi-select-group-item>`;
    }

    return nothing;
  }

  _onInputFocus() {
    this._inputFocused = true;
  }

  _onInputBlur() {
    this._inputFocused = false;
  }

  _getSelectAllItemIcon(selected) {
    if (selected) {
      return 'check_box';
    }

    if (!isEmpty(this._value)) {
      return 'indeterminate_check_box';
    }

    return 'check_box_outline_blank';
  }

  _getLeadingIcon(item, selected) {
    if (this._groupsMap) {
      const group = this._groupsMap[item[this.groupExpression]];
      if (group) {
        return group?.icon || '';
      }
    }

    if (selected) {
      return 'check_box';
    }

    return 'check_box_outline_blank';
  }

  /**
   * @param {Object} item Selected item, one of the `items`
   * @returns {Boolean} whether item is selected or not.
   */
  _isItemSelected(item) {
    const itemValue = this.valueProvider(item);
    return this._valueSet.has(itemValue);
  }

  /**
   * returns whether given item's index is activated or not
   * @param {Number} index
   * @returns {Boolean}
   */
  _isItemActivated(index) {
    return index === this._activatedIndex;
  }

  /**
   * on item click dispatch event
   * @param {object} item
   * @returns {event}
   */
  _onItemClick(item) {
    this._setValue(item);
    this.dispatchEvent(new CustomEvent('_value-change', { detail: this._value }));
  }

  /**
   * on 'select all' item click
   * update value
   */
  _onSelectAll() {
    if (!this.items) return;

    if (!this.vkb) {
      this._activatedIndex = -1;
    }

    let value = this._value || [];

    if (value.length === this.items.length) {
      this._value = [];
    } else {
      this._value = map(this.items, item => this.valueProvider(item));
    }

    this.dispatchEvent(new CustomEvent('_value-change', { detail: this._value }));
  }

  /**
   * Set _preselectedItems and and _preSelectedItemsSet
   */
  _setPreselectedItems() {
    if (this.items.length === this._value.length) {
      this._preselectedItems = [];
      this._preSelectedItemsSet = new Set();
      return;
    }

    this._preSelectedItemsSet = this._valueSet;
    this._preselectedItems = filter(this.items, item => {
      return item && this._preSelectedItemsSet.has(this.valueProvider(item));
    });
  }

  /**
   * Its called on item click or on `value` property change
   * Updates _value and _valueSet
   */
  _setValue(item) {
    if (!item) {
      this._value = this.value;
    } else {
      const value = this._value || [];
      const selectedValue = this.valueProvider(item);

      const index = findIndex(value, valueItem => valueItem === selectedValue);

      if (index >= 0) {
        const _value = [...value];
        _value.splice(index, 1);
        this._value = _value;
      } else {
        this._value = [...value, selectedValue];
      }
    }
  }

  _setItems() {
    if (!Array.isArray(this.items)) return;

    let array = [];

    forEach(this._preselectedItems, item => {
      if (!this._query || this.queryFilter(item, this._query)) {
        array.push({ type: ItemTypes.ITEM, value: item });
      }
    });

    let filteredList = filter(this.items, item => {
      return (!this._query || this.queryFilter(item, this._query)) && !this._preSelectedItemsSet.has(this.valueProvider(item));
    });

    // If group is exist
    if (Array.isArray(this._groups)) {
      let groups = this._groups;

      // Sort Items with groupExpression
      filteredList = orderBy(filteredList, [this.groupExpression]);
      const groupsLength = groups.length;

      groups.forEach(group => {
        // Filter items with group
        const filteredArray = filter(filteredList, [this.groupExpression, group.name]);
        if (filteredArray.length !== 0) {
          // First push group item
          if (groupsLength !== 1) {
            array.push({ type: ItemTypes.GROUP, value: group });
          }

          // Push every items
          filteredArray.forEach(item => {
            array.push({ type: ItemTypes.ITEM, value: item });
          });
        }
      });
    }

    // If group does not exist
    if (!Array.isArray(this._groups)) {
      filteredList.forEach(item => {
        array.push({ type: ItemTypes.ITEM, value: item });
      });
    }

    this._items = array;
  }

  _getGroupValue(item) {
    return this.groupSelector(item) || item;
  }

  /**
   * Triggered on input or clear query string.
   * @param {Event} e
   */
  _onClearSelection(e) {
    this._query = '';
  }

  /**
   *
   * Called when the user types in the search input field ans set in _query
   */
  _onInputChange(e) {
    this._query = e?.detail?.value || '';
  }

  /**
   * This method returns the item base on the given index.
   * @param (String) index
   * @returns {Object}
   */
  _getItem(index) {
    return this._items && this._items[index];
  }

  /**
   * On TAB, close dialog & prevent close on `ESC` key for searchable dialog.
   * @override
   * @param {Object} e Event
   */
  __onKeyDown(e) {
    if (!this.opened) {
      return;
    }

    // `dw-popover-dialog` closes itself on `ESC` so calls it only for non-searchable select.
    if (!this.searchable) {
      super.__onKeyDown(e);
    }

    const keyCode = e.keyCode || e.which;
    const ctrlKey = e.ctrlKey || e.metaKey;
    const { ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT, ARROW_UP, ENTER, ESC, SPACE, TAB } = KeyCode;

    if (keyCode === ESC) {
      if (this._query) {
        this._query = '';
      } else {
        this._cancelledByUser = true;
        this.close();
      }
      return;
    }

    if (![ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT, ARROW_UP, ENTER, SPACE, TAB].includes(keyCode)) {
      return;
    }

    if ([ARROW_DOWN, ARROW_UP].includes(keyCode) || ([ENTER].includes(keyCode) && this._activatedItem)) {
      e.stopPropagation();
      e.preventDefault();
    }

    // List navigation & Selection
    switch (keyCode) {
      case ARROW_UP:
        this._moveActivated(Direction.UP);
        break;

      case SPACE:
        if (this.searchable) return;
        if (this._activatedIndex === -1) {
          this._onSelectAll();
        } else if (this._activatedItem) {
          const item = this._activatedItem;
          if (item.type === ItemTypes.ITEM) {
            this._onItemClick(item.value);
            return;
          }
        }
        break;

      case ARROW_DOWN:
        this._moveActivated(Direction.DOWN);
        break;

      case TAB:
        this.close();
        break;

      case ENTER:
        if (ctrlKey) {
          this.close();
          return;
        }
        if (this._activatedIndex === -1) {
          this._onSelectAll();
        } else if (this._activatedItem) {
          const item = this._activatedItem;
          if (item.type === ItemTypes.ITEM) {
            this._onItemClick(item.value);
            return;
          }
        }
        break;
    }
  }

  _moveActivated(direction) {
    const numberOfItems = this._items?.length;
    if (!numberOfItems) return;

    if (direction === Direction.UP && this._activatedIndex === -1) return;

    if (direction === Direction.DOWN && this._activatedIndex === numberOfItems - 1) return;

    let activatedIndex = this._activatedIndex;
    let activatedItem = this._activatedItem;

    activatedIndex =
      direction === Direction.UP ? Math.max(-1, this._activatedIndex - 1) : Math.min(this._activatedIndex + 1, numberOfItems);
    activatedItem = this._getItem(activatedIndex);
    if (activatedIndex === -1 || activatedItem?.type === ItemTypes.GROUP) {
      activatedIndex =
        direction === Direction.UP ? Math.max(-1, this._activatedIndex - 2) : Math.min(this._activatedIndex + 2, numberOfItems);
    }

    this._activatedIndex = activatedIndex;
    this._scrollToIndex(this._activatedIndex);
  }

  _moveActivatedToFirstItem() {
    if (!this._items?.length || this.vkb) return;

    let activatedIndex = -1;

    if (!this.searchable && this.type === 'modal') {
      this._activatedIndex = activatedIndex;
      return;
    }

    for (let i = 0; i < this._items.length; i++) {
      const item = this._items[i];
      if (item.type === ItemTypes.ITEM) {
        activatedIndex = i;
        break;
      }
    }
    this._activatedIndex = activatedIndex;
    this._scrollToIndex(this._activatedIndex);
  }

  /**
   * Scroll to given index and position
   * @param {Number} index
   * @param {String} position
   */
  _scrollToIndex(index) {
    if (index < 0) return;

    const itemEl = this._virtualList ? this._listEl?.element && this._listEl?.element(index) : get(this._listEl?.children, index);
    const scrollOptions = { behavior: this._virtualList ? 'smooth' : 'instant', block: 'center' };
    itemEl?.scrollIntoView(scrollOptions, scrollOptions);
  }

  _onCancel() {
    this._cancelledByUser = true;
    this.close();
  }

  _onDialogClosed(e) {
    super._onDialogClosed(e);
    if (this._cancelledByUser) {
      return;
    }
    this.dispatchEvent(new CustomEvent('apply', { detail: this._value }));
    this.value = this._value;
  }
}

window.customElements.define('dw-multi-select-base-dialog', DwMultiSelectBaseDialog);
