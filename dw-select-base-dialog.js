import { css, html, nothing, unsafeCSS } from "@dreamworld/pwa-helpers/lit.js";
import "@lit-labs/virtualizer";

// View Elements
import { DwCompositeDialog } from "@dreamworld/dw-dialog/dw-composite-dialog.js";
import "@dreamworld/dw-icon";
import "@dreamworld/dw-list-item";
import "@material/mwc-button";
import "@material/mwc-circular-progress";
import "./dw-select-dialog-input";
import "./dw-select-group-item";

// Styles
import * as TypographyLiterals from "@dreamworld/material-styles/typography-literals";

// Lodash Methods
import debounce from "lodash-es/debounce";
import filter from "lodash-es/filter";
import isEqual from "lodash-es/isEqual";
import orderBy from "lodash-es/orderBy";
import { NEW_VALUE_STATUS } from "./utils";

// Utils
import { Direction, KeyCode, Position } from "./utils.js";

const MOBILE_LAYOUT_MEDIA_QUERY = "only screen and (max-width: 420px)";

const defaultMessages = {
  noRecords: "No Records",
  noMatching: "No matching records found!",
  loading: "Loading...",
};

const ItemTypes = {
  ITEM: "ITEM",
  GROUP: "GROUP",
};

/**
 * Renders the list of choices on temporary Composite Dialog.
 * Using `dw-list-item` or custom template provider `renderItem` to render List of Items
 *
 * [`select-dialog-doc`](docs/select-dialog.md)
 */

export class DwSelectBaseDialog extends DwCompositeDialog {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          --dw-dialog-content-padding: 0;
        }

        :host([type="popover"]) .dialog__content {
          padding: var(--dw-select-content-padding, 0);
        }

        .loading {
          display: flex;
          align-items: center;
          padding: 16px;
          overflow: hidden;
        }

        .loading mwc-circular-progress {
          padding-right: 8px;
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

        :host([type="popover"]) header {
          padding: 0;
        }

        :host([type="modal"]) .mdc-dialog .mdc-dialog__title {
          max-height: 56px;
          display: flex;
          flex-direction: row-reverse;
          ${unsafeCSS(TypographyLiterals.headline6)};
        }

        :host([type="modal"]) .mdc-dialog--scrollable .mdc-dialog__title {
          padding: var(--dw-dialog-header-padding, 4px 4px 4px 16px);
        }

        .heading {
          flex: 1;
          display: flex;
          align-items: center;
        }

        :host([type="modal"]) .mdc-dialog__title::before {
          height: 0px;
          display: none;
        }

        :host([type="fit"][opened][has-header]) .mdc-dialog__content {
          padding: 0;
        }

        :host([type="fit"][opened]) .mdc-dialog__content {
          padding: 0;
        }

        :host([type="fit"]) .mdc-dialog__title {
          padding: 8px 16px;
        }

        dw-list-item,
        dw-select-group-item {
          width: 100%;
        }

        dw-list-item[selected] {
          --mdc-theme-text-primary: var(--mdc-theme-primary, #6200ee);
        }

        dw-list-item:not([disabled])[selected]::before {
          background-color: var(--dw-select-item-selected-bg-color, transparent);
          opacity: var(--dw-select-selected-item-bg-opacity, 0);
        }

        dw-list-item:not([disabled])[selected][activated]::before {
          background-color: var(
            --dw-select-item-selected-bg-color,
            var(--mdc-theme-primary, #6200ee)
          );
          opacity: 0.12;
        }

        mwc-button {
          --mdc-shape-small: 18px;
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
      value: { type: Object },

      /**
       * Input Element
       * When it’s specified it binds keyboard event on this; Otherwise, it renders it’s own input in the header.
       * Integrator will set this value only for non-touch devices.
       */
      elInput: { type: Object },

      /**
       * Whether or not to show the `searchable` variant.
       */
      searchable: { type: Boolean },

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
       * Custom footer template as property
       */
      dialogFooterElement: { type: Object },

      /**
       * Placeholder for fit dialog's search input
       */
      searchPlaceholder: { type: String },

      /**
       * true if any group item has collapsed value is true.
       */
      isGroupCollapsed: Boolean,

      /**
       * A function to customize search.
       */
      queryFilter: Function,

      /**
       * Can be used only when “searchable=true”
       * Whether new value is allowed or not
       */
      allowNewValue: { type: Boolean },

      /**
       * Provider function which return value
       * return value could be Promise or any value
       * Used when allowNewValue is true and _newValueStatus is not undefined
       */
      newValueProvider: { type: Function },

      /**
       * Enum property
       * Possible values: undefined | `IN_PROGRESS` | `NEW_VALUE` | `ERROR`
       */
      _newValueStatus: { type: String },

      /**
       * Represents last successful computation by newValueProvider.
       */
      _newValue: { type: Object },

      /**
       * Represents a Promise, corresponding to any pending result of newValueProvider call.
       * It would be undefined if no such request is pending.
       */
      _newValueRequest: { type: Object },

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
    };
  }

  set _groups(value) {
    let oldValue = this._type;

    if (value === oldValue) {
      return;
    }
    this._isGroupCollapsed = Boolean(value) && value.some((e) => e.collapsed);

    this.__groups = value;
    this.requestUpdate("_groups", oldValue);
    // Compute updated `_items`
    this._getItems();
  }

  get _groups() {
    return this.__groups;
  }

  /**
   * Get lit virtulizer element
   */
  get _litVirtulizerEl() {
    return this.renderRoot.querySelector("lit-virtualizer");
  }

  constructor() {
    super();
    this._query = "";
    this.type = "popover";
    this.showTrigger = true;
    this.valueExpression = "_id";
    this.heading = "";
    this.showClose = false;
    this._activatedIndex = 0;
    this.messages = defaultMessages;
    this._items = [];
    this.popoverOffset = [0, 4];
    this._selectedValueText = "";
  }

  set messages(newValue) {
    let oldValue = this._messages;

    if (newValue === oldValue) {
      return;
    }

    newValue = { ...oldValue, ...newValue };

    this._messages = newValue;

    this.requestUpdate("messages", oldValue);
  }

  get messages() {
    return this._messages;
  }

  connectedCallback() {
    this.layout = window.matchMedia(MOBILE_LAYOUT_MEDIA_QUERY).matches ? "small" : "";
    // Set initial _groups value that actually used to compute list of choices
    this._groups = this.groups;

    // this.type = "popover"
    // Determine Dialog type
    this._determineType();

    super.connectedCallback();
    this._onUserInteraction = debounce(this._onUserInteraction.bind(this), 100);
    window.addEventListener("keydown", this.onKeydown.bind(this));
  }

  firstUpdated() {
    if (this.value && this._groups && this._groups.length > 0) {
      this._groups = this._groups.map((group) => {
        if (group.name === this.value[this.groupExpression]) {
          return { ...group, collapsed: false };
        }
        return group;
      });
    }

    this._isGroupCollapsed = Boolean(this._groups) && this._groups.some((e) => e.collapsed);
    this._scrollToSelectedItem();
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has("items")) {
      this._getItems();
    }
  }

  _determineType() {
    if (this.vkb && this.searchable) {
      this.type = "fit";
      return;
    }

    if (this.layout === "small") {
      this.type = "modal";
      this.placement = "bottom";
      return;
    }

    this.type = "popover";
  }

  get _headerTemplate() {
    if (this.searchable && this.type === "fit") {
      return html`<dw-select-dialog-input
        .value=${this._selectedValueText}
        .searchPlaceholder="${this.searchPlaceholder}"
        .newValueStatus="${this._newValueStatus}"
        @cancel=${this._onClose}
        @input-change=${this._onUserInteraction}
      ></dw-select-dialog-input>`;
    }

    if (this.type === "modal") {
      return html`
        ${this.showClose
          ? html`<dw-icon-button icon="close" @click=${() => this.close()}></dw-icon-button>`
          : nothing}
        ${this.heading ? html`<div class="heading">${this.heading}</div>` : nothing}
      `;
    }

    return nothing;
  }

  get _contentTemplate() {
    if (this.allowNewValue && this._items.length === 0) {
      return nothing;
    }
    // Render Loading view when _items is `undefined`
    if (!this._items) {
      return this._renderLoading;
    }

    // Render No Records view when _items's length is 0
    if (this._items.length === 0) {
      return this._renderNoRecord;
    }

    // Render list of choices
    return this._renderList;
  }

  get _footerTemplate() {
    if (this._newValueStatus === NEW_VALUE_STATUS.NEW_VALUE && this.type === "fit") {
      return html`<mwc-button
        label="Select"
        raised
        fullwidth
        @click=${this._onSelectButtonClick}
      ></mwc-button>`;
    }
    return this.dialogFooterElement;
  }

  get _renderLoading() {
    return html`<div class="loading">
      <mwc-circular-progress indeterminate density="-2"></mwc-circular-progress>
      <div>${this.messages.loading}</div>
    </div>`;
  }

  get _renderNoRecord() {
    return html`<div class="no-record">
      <dw-icon name="search_off" size="100"></dw-icon>
      <div>
        ${this.items && this.items.length === 0
          ? this.messages.noRecords
          : this.messages.noMatching}
      </div>
    </div>`;
  }

  get _renderList() {
    if (this.type === "popover" && !this._tippyShown) {
      return;
    }
    return html`
      <lit-virtualizer
        .items=${this._items}
        .renderItem=${(item, index) => {
          const isSelected = this._isItemSelected(item.value);
          const isActivated = this._isItemActivated(index);
          return this._renderItem(item, isSelected, isActivated, this._query);
        }}
      ></lit-virtualizer>
    `;
  }

  _renderItem(item, selected, activated, query) {
    if (item.type === ItemTypes.ITEM) {
      if (this.renderItem && typeof this.renderItem === "function") {
        return this.renderItem(
          item.value,
          selected,
          activated,
          query,
          this._onItemClick.bind(this)
        );
      }

      if (this.renderItem) console.warn("renderItem is not function");

      return html`
        <dw-list-item
          title1=${this._getItemValue(item.value)}
          .highlight=${this._query}
          @click=${() => this._onItemClick(item.value)}
          ?activated=${activated}
          ?selected=${selected}
          .leadingIcon=${this._getLeadingIcon(item.value)}
          ?hasLeadingIcon=${this._hasLeadingIcon()}
          .trailingIcon=${this.selectedTrailingIcon}
          ?hasTrailingIcon=${this._isTrailingIconAvailable(item.value)}
          .focusable=${false}
        ></dw-list-item>
      `;
    }

    if (item.type === ItemTypes.GROUP) {
      if (this.renderGroupItem && typeof this.renderGroupItem === "function") {
        return this.renderGroupItem(item.value, activated, this._onGroupClick.bind(this));
      }

      if (this.renderGroupItem) console.warn("renderGroupItem is not function");

      return html`<dw-select-group-item
        .name="${item.value.name}"
        .label="${this._getGroupValue(item.value)}"
        ?activated=${activated}
        ?collapsible=${item.value.collapsible}
        ?collapsed=${item.value.collapsed}
        @click=${() => this._onGroupClick(item.value)}
      ></dw-select-group-item>`;
    }

    return nothing;
  }

  _getLeadingIcon(item) {
    let group = this.groups && this.groups.find((e) => e.name === item[this.groupExpression]);
    if (group && group.icon) {
      return group.icon;
    }
    return "";
  }

  _hasLeadingIcon() {
    return Boolean(this.groups && this.groups.some((group) => group.icon));
  }

  _isTrailingIconAvailable(item) {
    if (this.selectedTrailingIcon) {
      return this._isItemSelected(item);
    }
    return false;
  }

  /**
   *
   * @param {Object} item Selected item, one of the `items`
   * @returns {Boolean} whether item is selected or not.
   */
  _isItemSelected(item) {
    return this.valueProvider(item) === this.value;
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
    const isSame = this.valueEquator(this.value, this.valueProvider(item));
    if (!isSame) this.dispatchEvent(new CustomEvent("selected", { detail: item }));
    this.close();
  }

  _onGroupClick(item) {
    let groups = this._groups;
    const index = groups.findIndex((group) => group.name === item.name);
    if (index !== -1 && groups[index].collapsible) {
      groups[index].collapsed = !groups[index].collapsed;
    }

    this._groups = groups;
  }

  _getItems() {
    let sortedArray = filter(this.items, (item) => {
      return this.queryFilter(item, this._query);
    });

    let array = [];

    if (!Array.isArray(this.items)) {
      this._items = array;
      return;
    }

    // If group is exist
    if (Array.isArray(this._groups)) {
      let groups = this._groups;

      // Sort Items with groupExpression
      sortedArray = orderBy(sortedArray, [this.groupExpression]);
      const groupsLength = groups.length;

      if (groupsLength === 1) {
        groups = groups.map((group) => {
          return { ...group, collapsed: false };
        });
      }

      groups.forEach((group) => {
        // Filter items with group
        const filteredArray = filter(sortedArray, [this.groupExpression, group.name]);
        if (filteredArray.length !== 0) {
          // First push group item
          if (groupsLength !== 1) {
            array.push({ type: ItemTypes.GROUP, value: group });
          }

          if (!group.collapsible || !group.collapsed) {
            // Push every items
            filteredArray.forEach((item) => {
              array.push({ type: ItemTypes.ITEM, value: item });
            });
          }
        }
      });
    }

    // If group does not exist
    if (!Array.isArray(this._groups)) {
      sortedArray.forEach((item) => {
        array.push({ type: ItemTypes.ITEM, value: item });
      });
    }

    this._items = array;
  }

  _getGroupValue(item) {
    if (!this.groupSelector(item)) {
      return item;
    }
    return this.groupSelector(item);
  }

  /**
   * Trigger when actual user intract
   * @param {Event} e
   */
  _onUserInteraction(e) {
    if (e.type === "input-change") {
      this._onInput(e);
    }
  }

  _onClose() {
    this.close();
  }

  _onInput(e) {
    let el = this.renderRoot.querySelector("dw-select-dialog-input");
    this._query = el.value;
    this._selectedValueText = el.value;
  }

  _onQueryChange(value) {
    if (value && this._isGroupCollapsed) {
      let groups = this._groups;
      groups.map((e) => (e.collapsed = false));
      this._groups = groups;
    }
  }

  _getItem(index) {
    return this._items[index];
  }

  onKeydown(e) {
    if (!this.opened) {
      return;
    }

    e.stopPropagation();
    const { ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT, ARROW_UP, ENTER } = KeyCode;
    const { keyCode } = e;

    switch (keyCode) {
      case ARROW_UP:
        this._moveActivated(Direction.UP);
        return;
      case ARROW_DOWN:
        this._moveActivated(Direction.DOWN);
        return;
      case ENTER:
        if (this._activatedIndex > -1) {
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

    if ([ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT, ARROW_UP, ENTER].includes(keyCode)) {
      e.preventDefault();
    }
  }

  _moveActivated(direction) {
    const numberOfItems = this._items.length;
    if (numberOfItems === 0) {
      return;
    }

    let activatedIndex = this._activatedIndex;
    let activatedItem = this._activatedItem;
    let modifier = direction === Direction.UP ? -1 : 1;

    do {
      activatedIndex = (activatedIndex + modifier + numberOfItems) % numberOfItems;
      activatedItem = this._getItem(activatedIndex);
    } while (activatedItem.type === ItemTypes.GROUP && !activatedItem.value.collapsible);

    this._activatedIndex = activatedIndex;
    this._scrollToIndex(this._activatedIndex, Position.CENTER);
  }

  _moveActivatedToFirstItem() {
    this._activatedIndex = this._items?.findIndex(({ type }) => type === ItemTypes.ITEM) ?? -1;
  }

  /**
   * Scroll to selected Item and set `_activatedItemIndex`
   */
  _scrollToSelectedItem() {
    if (this.value) {
      this._activatedIndex = this._items.findIndex((item) => {
        return this.valueEquator(this.valueProvider(item.value), this.value);
      });
    }

    let activatedItem = this._getItem(this._activatedIndex);
    while (
      activatedItem &&
      activatedItem.type === ItemTypes.GROUP &&
      !activatedItem.value.collapsible
    ) {
      this._activatedIndex++;
      activatedItem = this._getItem(this._activatedIndex);
    }
    setTimeout(() => {
      this._scrollToIndex(this._activatedIndex, Position.CENTER);
    }, 250);
  }

  /**
   * Scroll to given index and position
   * @param {Number} index
   * @param {String} position
   */
  _scrollToIndex(index, position = Position.NEAREST) {
    this._litVirtulizerEl && this._litVirtulizerEl.scrollToIndex(index, position);
  }

  async _findNewValue() {
    let result = this.newValueProvider(this._query);
    this._newValueRequest = result instanceof Promise ? result : Promise.resolve(result);
    this._newValueStatus = NEW_VALUE_STATUS.IN_PROGRESS;
    this._newValue = undefined;

    try {
      this._newValue = await this._newValueRequest;
      this._newValueRequest = undefined;
      this._newValueStatus = NEW_VALUE_STATUS.NEW_VALUE;
      this._selectedValueText = this._computeInputText;
      if (this.type !== "fit") {
        this._fire("selected", this._newValue);
      }
    } catch (error) {
      this._newValueRequest = undefined;
      this._newValueStatus = NEW_VALUE_STATUS.ERROR;
    }
  }

  _fire(name, detail) {
    this.dispatchEvent(new CustomEvent(name, { detail: detail }));
  }

  _onSelectButtonClick() {
    this._fire("selected", this._newValue);
    this.close();
  }

  /**
   * Returns String that represents current value
   */
  get _computeInputText() {
    if (!this._newValue) {
      return "";
    }
    if (!this.valueTextProvider(this._newValue)) {
      if (typeof this._newValue !== "string") {
        return "";
      }
      return this._newValue;
    }
    return this.valueTextProvider(this._newValue);
  }

  willUpdate(_changedProperties) {
    super.willUpdate(_changedProperties);

    if (_changedProperties.has("_query")) {
      this._onQueryChange(this._query);
      this._getItems();
      this._moveActivatedToFirstItem();
    }

    if (_changedProperties.has("heading") || _changedProperties.has("showClose")) {
      this._showHeader = Boolean(this.heading) || this.showClose;
    }

    if (_changedProperties.has("_query")) {
      this._newValueRequest = undefined;
      if (this.allowNewValue && this._query && this._items.length == 0) {
        this._findNewValue();
      } else {
        this._newValueStatus = undefined;
        this._newValueRequest = undefined;
      }
    }

    if (_changedProperties.has("_newValueStatus")) {
      this._fire("new-value-status-changed", this._newValueStatus);
    }

    if (_changedProperties.has("_activatedIndex") || _changedProperties.has("_items")) {
      this._activatedItem = this._getItem(this._activatedIndex);
    }
  }
}

window.customElements.define("dw-select-base-dialog", DwSelectBaseDialog);
