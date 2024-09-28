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
import { get, debounce, filter, orderBy, forEach, findIndex, isEmpty, map } from 'lodash-es';

// Utils
import { Direction, KeyCode } from './utils.js';

const VIRTUAL_LIST_MIN_LENGTH = 500;
const VIRTUAL_LIST_AUTO_SCROLL_DELAY = 500;
const REGULAR_LIST_SCROLL_DELAY = 300;
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
 * Renders the list of choices on temporary Composite Dialog.
 * Using `dw-list-item` or custom template provider `renderItem` to render List of Items
 *
 * [`select-dialog-doc`](docs/select-dialog.md)
 */

export class DwMultiSelectBaseDialog extends DwCompositeDialog {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          --dw-dialog-content-padding: 0;
        }

        :host([type='modal'][placement='center']) {
          --dw-dialog-min-width: 448px;
        }

        :host([hidden]) #popover_dialog__surface {
          display: none;
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
        }

        :host([type='modal']) #dialog-header {
          --dw-dialog-header-padding: 4px 4px 4px 16px;
          gap: 4px;
        }

        #dialog-header {
          z-index: 2;
        }

        :host([type='modal']) .mdc-dialog--scrollable .mdc-dialog__title {
          padding: var(--dw-dialog-header-padding, 4px 4px 4px 16px);
        }

        .heading {
          flex: 1;
          display: flex;
          align-items: center;
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
          padding: 4px 16px 8px 16px;
          z-index: 2;
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
          gap: 12px;
          flex: 1;
          color: var(--mdc-theme-text-primary-on-surface, rgba(0, 0, 0, 0.87));
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
          padding: var(--dw-fit-dialog-content-action-button-padding, 0 16px);
        }

        :host(:not([input-focused])) .content-action-button {
          position: sticky;
          bottom: 0;
          background-color: var(--mdc-theme-background, #ffffff);
        }

        .select-all {
          border-bottom: 1px solid var(--mdc-theme-divider-color, rgba(0, 0, 0, 0.12));
        }

        .select-count {
          background-color: var(--mdc-theme-primary);
          border-radius: 50px;
          width: 24px;
          height: 24px;
          ${unsafeCSS(TypographyLiterals.subtitle2)};
          display: flex;
          text-align: center;
          justify-content: center;
          color: var(--mdc-theme-background, #ffffff);
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
       * A Group has properties: name, label, collapsible, collapsed
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
      groupSelector: { type: Function },

      /**
       * Expression of Group
       */
      groupExpression: { type: String },

      /**
       * Original List of selectable items.
       */
      items: { type: Array },

      _preSelectedItemsSet: { type: Object },

      _preselectedItems: { type: Array },

      /**
       * Represents items to be rendered by lit-virtualizer.
       * { type: GROUP or ITEM, value: Group or Item object }
       * It’s computed from _groups, items & query.
       */
      _items: { type: Array },

      /**
       * Provides value that actually represent in list items
       */
      valueProvider: { type: Function },

      /**
       * Expression of the value
       * default: _id
       */
      valueExpression: { type: String },

      /**
       * A Function `(item) -> text` to find the Text to be shown (in input), corresonding to the
       * current `value`.
       * default: `(item) -> item`.
       */
      valueTextProvider: { type: Function },

      /**
       * Messages of for noRecords and noMatching
       * Example: {noRecords: "", noMatching: "", loading: ""}
       */
      messages: { type: Object },

      /**
       * Provides any Block element to represents list items
       * Should show it's hover effect; and ripple on click
       * Highlight text based on `query`
       * Integrator listens on the ‘click’ event to know whether selection is changed or not.
       * It must not be focusable.
       */
      renderItem: { type: Function },

      /**
       * Provides any Block elements to represents group items
       * name property should be set to input name.
       * Should show hover & ripple effects only if it’s collapsible.
       * Integrator listens on ‘click’ event to toggle collapsed status.
       */
      renderGroupItem: { type: Function },

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
       * default: -1
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
       * Custom footer template as property
       */
      dialogFooterTemplate: { type: Object },

      /**
       * Custom header template as property
       */
      headerTemplate: { type: Object },

      inputSuffixTemplate: { tpye: Object },

      /**
       * Placeholder for fit dialog's search input
       */
      searchPlaceholder: { type: String },

      /**
       * A function to customize search.
       */
      queryFilter: Function,

      _hidden: { type: Boolean, reflect: true, attribute: 'hidden' },

      /**
       * Enum property
       * Possible values: undefined | `IN_PROGRESS` | `NEW_VALUE` | `ERROR`
       */
      _newItemStatus: { type: String },

      /**
       * Represents the value of currently typed new item.
       */
      _newItem: { type: Object },

      /**
       * Represents Dialog input value
       */
      _selectedValueText: { type: String },

      /**
       * Input Property
       * Whether error message shows in tooltip or not.
       * Default erro shows at hint text
       */
      errorInTooltip: { type: Boolean },

      /**
       * A Custom Error Message to be shown.
       */
      errorMessage: { type: String },

      /**
       * Helper text to display below the input.
       * Display default only when focused.
       */
      helper: { type: String },

      /**
       * Set this to configure custom logic to detect whether value is changed or not.
       * Default: compares both values by strict equality (by reference) `v1 === v2`.
       * It must return a Boolean.
       * Function receives 2 arguments: (v1, v2). Should return `true` when both values are same otherwise `false`.
       */
      valueEquator: { type: Function },

      /**
       * `true` when items count is more than 500.
       */
      _virtualList: { type: Boolean },

      _inputFocused: { type: Boolean, reflect: true, attribute: 'input-focused' },

      interactive: { type: Boolean },

      /**
       * Internal flag to indicate if the dialog should be cancelled.
       * Set to true when user initiates a cancellation action (e.g., pressing ESC).
       */
      _cancel: { type: Boolean },

      /**
       * Caption text for the "Select All" option.
       * Used to customize the label of the select all functionality.
       */
      _seleactAllCaption: { type: String },
    };
  }

  /**
   * Get lit virtulizer element
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
    this._activatedIndex = 0;
    this._firstItemIndex = 0;
    this.messages = defaultMessages;
    this.popoverOffset = [0, 4];
    this._selectedValueText = '';
    this.OPEN_ANIMATION_TIME = 300; //In milliseconds.
    this._valueSet = new Set();
    this._preSelectedItemsSet = new Set();
    this._value = [];
    this._seleactAllCaption = 'Seleacted All';
  }

  connectedCallback() {
    // Set initial _groups value that actually used to compute list of choices
    this._groups = this.groups;

    super.connectedCallback();
    this._onUserInteraction = debounce(this._onUserInteraction.bind(this), 100);
  }

  willUpdate(props) {
    super.willUpdate(props);
    if (props.has('items')) {
      this._virtualList = this.items?.length > VIRTUAL_LIST_MIN_LENGTH;
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

    if (props.has('heading') || props.has('showClose')) {
      this._showHeader = Boolean(this.heading) || this.showClose;
    }

    if (props.has('_activatedIndex') || props.has('_items')) {
      this._activatedItem = this._getItem(this._activatedIndex);
    }

    if (props.has('messages')) {
      this.messages = { ...props.get('messages'), ...this.messages };
    }
  }

  firstUpdated(props) {
    super.firstUpdated(props);
    if (this.value && this._groups && this._groups.length > 0) {
      const value = this._getItemUsingValue(this.value);
      this._groups = this._groups.map(group => {
        if (value && group.name === value[this.groupExpression]) {
          return { ...group, collapsed: false };
        }
        return group;
      });
    }

    this._isGroupCollapsed = Boolean(this._groups) && this._groups.some(e => e.collapsed);
    this._scrollToSelectedItem();
  }

  updated(props) {
    super.updated(props);
  }

  get _headerTemplate() {
    return html`
      ${this.type === 'fit' || this.type === 'modal'
        ? html`<div class="header-title">
            <div class="title">
              ${this.heading}${this._value.length > 0 ? html`<span class="select-count">${this._value.length}</span>` : ''}
            </div>
            <dw-icon-button class="close-button" icon="close" dismiss></dw-icon-button>
          </div>`
        : ''}
      ${this.searchable
        ? html`<dw-multi-select-dialog-input
            .value=${this._query || ''}
            .searchPlaceholder="${this.searchPlaceholder}"
            .suffixTemplate=${this.inputSuffixTemplate}
            @input-change=${this._onUserInteraction}
            @clear-selection="${this._onUserInteraction}"
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
    return html`
      <dw-button variant="primary" size="small" @click=${() => this._onapply()}> ${this.footerBouttonCaption || 'Done'} </dw-button>
    `;
  }

  get _footerTemplate() {
    if (this.type !== 'fit') {
      return this.dialogFooterTemplate || this._defaultFooterTemplate;
    }
  }

  get _selectAllItem() {
    if (!this.searchable && this.items.length < 10) return;
    const value = this._value || this.value;
    const selected = this._items.length === value.length;
    return html`<dw-list-item
      class="select-all"
      title1=${this._seleactAllCaption}
      @click=${() => this._onSelectAll()}
      .selectionMode=${'none'}
      .selected=${selected}
      .trailingIcon=${selected ? 'indeterminate_check_box' : 'check_box_outline_blank'}
      .leadingIcon=${selected ? 'indeterminate_check_box' : 'check_box_outline_blank'}
      ?hasLeadingIcon=${!this._hasLeadingIcon()}
      ?hasTrailingIcon=${this._hasLeadingIcon()}
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
    const selectedItemIndex = this._items.findIndex(item => this.valueEquator(this.valueProvider(item.value), this.value));

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
          class="list-item"
          title1=${this._getItemValue(item.value)}
          .highlight=${this.highlightQuery ? this._query : ''}
          @click=${() => this._onItemClick(item.value)}
          ?activated=${activated}
          .selected=${selected}
          .selectionMode=${'none'}
          ?hasLeadingIcon=${true}
          .leadingIcon=${this._getLeadingIcon(item.value, selected)}
          .trailingIcon=${selected ? 'check_box' : 'check_box_outline_blank'}
          ?hasTrailingIcon=${this._hasLeadingIcon()}
          .focusable=${false}
        ></dw-list-item>
      `;
    }

    if (item.type === ItemTypes.GROUP) {
      if (this.renderGroupItem && typeof this.renderGroupItem === 'function') {
        return this.renderGroupItem(item.value, activated, this._onGroupClick.bind(this));
      }

      if (this.renderGroupItem) console.warn('renderGroupItem is not function');

      return html`<dw-multi-select-group-item
        .name="${item.value.name}"
        .label="${this._getGroupValue(item.value)}"
        class="group-item"
        ?activated=${activated}
        @click=${() => this._onGroupClick(item.value)}
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

  _getLeadingIcon(item, selected) {
    let group = this.groups && this.groups.find(e => e.name === item[this.groupExpression]);
    if (group) {
      if (group.icon) {
        return group.icon;
      }
      return '';
    }
    if (selected) {
      return 'check_box';
    }

    return 'check_box_outline_blank';
  }

  _hasLeadingIcon() {
    return Boolean(this.groups && this.groups.some(group => group.icon));
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

  _onItemClick(item) {
    this._setValue(item);
    this.dispatchEvent(new CustomEvent('_value-change', { detail: this._value }));
  }

  _onGroupClick(item) {
    let groups = this._groups;
    const index = groups.findIndex(group => group.name === item.name);
    if (index !== -1 && groups[index].collapsible) {
      groups[index].collapsed = !groups[index].collapsed;
    }

    this._groups = groups;
  }

  /**
   * on 'select all' item click
   * update value
   */
  _onSelectAll() {
    let value = this._value || [];

    if (value.length === this._items.length) {
      return (this._value = []);
    }

    this._value = map(this._items, item => this.valueProvider(item.value));
    return;
  }

  _setPreselectedItems() {
    if (this.items.length === this._value.length) {
      this._preselectedItems = [];
      this._preSelectedItemsSet = new Set(this._preselectedItems);
      return;
    }

    this._preSelectedItemsSet = this._valueSet;
    this._preselectedItems = filter(this.items, item => {
      return item && this._preSelectedItemsSet.has(this.valueProvider(item));
    });
  }

  _setValue(item) {
    if (!item) {
      this._value = this.value;
    } else {
      const value = this._value || [];
      const selectedValue = this.valueProvider(item);

      const index = findIndex(value, valueItem => valueItem === selectedValue);

      if (index >= 0) {
        this._value = value.toSpliced(index, 1);
      } else {
        this._value = [...value, selectedValue];
      }
    }
    this._valueSet = new Set(this._value);
  }

  _setItems() {
    let array = [];

    forEach(this._preselectedItems, item => {
      if (this._query) {
        if (!this.queryFilter(item, this._query)) return;
        array.push({ type: ItemTypes.ITEM, value: item });
      } else {
        array.push({ type: ItemTypes.ITEM, value: item });
      }
    });

    let filteredList = filter(this.items, item => {
      return (!this._query || this.queryFilter(item, this._query)) && !this._preSelectedItemsSet.has(this.valueProvider(item));
    });

    if (!Array.isArray(this.items)) {
      return;
    }
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

    const aPrependItems = [];
    forEach(this.prependItems, e => {
      aPrependItems.push({ type: ItemTypes.ITEM, value: e });
    });

    this._items = array;
    this.dispatchEvent(new CustomEvent('_items-changed', { detail: this._items }));
  }

  _getGroupValue(item) {
    if (!this.groupSelector(item)) {
      return item;
    }
    return this.groupSelector(item);
  }

  _onapply() {
    this.close();
  }

  /**
   * Trigger when actual user intract
   * @param {Event} e
   */
  _onUserInteraction(e) {
    if (e.type === 'input-change') {
      this._onInput(e);
    }

    if (e.type === 'clear-selection') {
      this._query = '';
    }
  }

  _onClose() {
    this.close();
  }

  _onInput(e) {
    let el = this.renderRoot.querySelector('dw-multi-select-dialog-input');
    this._query = el.value || '';
  }

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
    const { ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT, ARROW_UP, ENTER, TAB, ESC, SPACE } = KeyCode;

    // On TAB, close when interactive false.
    if (keyCode === TAB && !this.interactive) {
      const lastOpenedDialog = window.__dwPopoverInstances.slice(-1)[0];
      lastOpenedDialog && lastOpenedDialog.close();
      return;
    }

    if (keyCode === ESC) {
      this._cancel = true;
      if (this._query) {
        return (this._query = '');
      } else {
        this.close();
      }
    }

    if (![ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT, ARROW_UP, ENTER, SPACE].includes(keyCode)) {
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
        return;
      case SPACE:
        if (this.searchable) return;
        if (this._activatedItem) {
          const item = this._activatedItem;
          if (item.type === ItemTypes.ITEM) {
            this._onItemClick(item.value);
            return;
          }
          if (item.type === ItemTypes.GROUP && item.value.collapsible) {
            this._onGroupClick(item.value);
            return;
          }
        }
      case ARROW_DOWN:
        this._moveActivated(Direction.DOWN);
        return;
      case ENTER:
        if (this._activatedItem) {
          const item = this._activatedItem;
          if (item.type === ItemTypes.ITEM) {
            this._onItemClick(item.value);
            return;
          }
          if (item.type === ItemTypes.GROUP && item.value.collapsible) {
            this._onGroupClick(item.value);
            return;
          }
        }
        break;
    }
  }

  _moveActivated(direction) {
    const numberOfItems = this._items.length;
    if (numberOfItems === 0) return;

    if (direction === Direction.UP && this._activatedIndex === this._firstItemIndex) return;

    if (direction === Direction.DOWN && this._activatedIndex === numberOfItems - 1) return;

    let activatedIndex = this._activatedIndex;
    let activatedItem = this._activatedItem;

    activatedIndex = direction === Direction.UP ? Math.max(0, this._activatedIndex - 1) : Math.min(this._activatedIndex + 1, numberOfItems);
    activatedItem = this._getItem(activatedIndex);
    if (activatedItem.type === ItemTypes.GROUP && !activatedItem.value.collapsible) {
      activatedIndex =
        direction === Direction.UP
          ? Math.max(this._firstItemIndex, this._activatedIndex - 2)
          : Math.min(this._activatedIndex + 2, numberOfItems);
    }

    this._activatedIndex = activatedIndex;
    this._scrollToIndex(this._activatedIndex);
  }

  _moveActivatedToFirstItem() {
    if (!this._items?.length) return;

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
    this._firstItemIndex = this._activatedIndex = activatedIndex;
    this._scrollToIndex(this._activatedIndex);
  }

  /**
   * Scroll to selected Item and set `_activatedItemIndex`
   */
  _scrollToSelectedItem() {
    if (!this._items) return;

    if (this._value) {
      this._activatedIndex = this._items.findIndex(item => {
        return this.valueEquator(this.valueProvider(item.value), this._value);
      });
    }

    let activatedItem = this._getItem(this._activatedIndex);
    while (activatedItem && activatedItem.type === ItemTypes.GROUP && !activatedItem.value.collapsible) {
      this._activatedIndex++;
      activatedItem = this._getItem(this._activatedIndex);
    }
    setTimeout(
      () => {
        this._scrollToIndex(this._activatedIndex);
      },
      this._virtualList ? VIRTUAL_LIST_AUTO_SCROLL_DELAY : REGULAR_LIST_SCROLL_DELAY
    );
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

  _getItemUsingValue(value) {
    const item = this.items && this.items.find(item => this.valueEquator(this.valueProvider(item), value));
    if (item !== undefined || !this._newItem) {
      return item;
    }

    //search in newItem
    return this.valueEquator(this.valueProvider(this._newItem), value);
  }

  _onDialogClosed(e) {
    super._onDialogClosed(e);
    if (this._cancel) {
      this._cancel = false;
      return;
    }
    this.dispatchEvent(new CustomEvent('apply-event', { detail: this._value }));
  }
}

window.customElements.define('dw-multi-select-base-dialog', DwMultiSelectBaseDialog);
