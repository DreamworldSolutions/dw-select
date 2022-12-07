import { css, html, nothing, unsafeCSS } from "@dreamworld/pwa-helpers/lit.js";
import { repeat } from "lit/directives/repeat.js";
import "@lit-labs/virtualizer";

// View Elements
import { DwCompositeDialog } from "@dreamworld/dw-dialog/dw-composite-dialog.js";
import "@material/mwc-circular-progress";
import "@dreamworld/dw-icon";
import "@dreamworld/dw-list-item";
import "./dw-select-group-item";
import "./dw-select-dialog-input";

// Web-Utils
import { scrollIntoView } from "@dreamworld/web-util/scrollIntoView";

// Styles
import * as TypographyLiterals from "@dreamworld/material-styles/typography-literals";

// Lodash Methods
import get from "lodash-es/get";
import isEqual from "lodash-es/isEqual";
import orderBy from "lodash-es/orderBy";
import filter from "lodash-es/filter";
import forEach from "lodash-es/forEach";
import debounce from "lodash-es/debounce";

const MOBILE_LAYOUT_MEDIA_QUERY = "only screen and (max-width: 420px)";

const KEY_CODE = {
  ARROW_UP: 38,
  ARROW_DOWN: 40,
  ARROW_LEFT: 37,
  ARROW_RIGHT: 39,
  ENTER: 13,
};

const DIRECTION = {
  UP: "up",
  DOWN: "down",
};

const defaultMessages = {
  noRecords: "No Records",
  noMatching: "No matching records found!",
  loading: "Loading...",
};

/**
 * Renders the list of choices on temporary Composite Dialog.
 * Using `dw-list-item` or custom template provider `renderItem` to render List of Items
 *
 * [`select-dialog-doc`](docs/select-dialog.md)
 */

export class DwSelectCoreDialog extends DwCompositeDialog {
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
          background-color: var(
            --dw-select-item-selected-bg-color,
            var(--mdc-theme-primary, #6200ee)
          );
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
       * Activated item
       * One of the Item from _items, by reference.
       */
      _activatedItem: { type: Object },

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
       * Contains Scrollable Elements
       */
      _scrollableElement: { type: Object },

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
    };
  }

  // Remove this custom getter/setter when `willUpdate` will be supported
  set heading(value) {
    let oldValue = this._heading;

    if (oldValue === value) {
      return;
    }

    this._showHeader = Boolean(value) || this.showClose;
    this._heading = value;

    this.requestUpdate("heading", oldValue);
  }

  get heading() {
    return this._heading;
  }

  // Remove this custom getter/setter when `willUpdate` will be supported
  set showClose(value) {
    let oldValue = this._showClose;

    if (oldValue === value) {
      return;
    }

    this._showHeader = Boolean(this.heading) || value;
    this._showClose = value;

    this.requestUpdate("showClose", oldValue);
  }

  get showClose() {
    return this._showClose;
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

  set _query(value) {
    let oldValue = this.__query;

    if (value === oldValue) {
      return;
    }

    this.__query = value;
    this.requestUpdate("_query", oldValue);
    // Compute updated `_items`
    this._getItems();
  }

  get _query() {
    return this.__query;
  }

  constructor() {
    super();
    this._query = "";
    this.type = "popover";
    this.showTrigger = true;
    this.valueExpression = "_id";
    this.heading = "";
    this.showClose = false;
    this._activatedIndex = -1;
    this.messages = defaultMessages;
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
    this._scrollableElement =
      this.type === "fit"
        ? document.querySelector("body")
        : this.type === "modal"
        ? this.renderRoot.querySelector("#dialog-content")
        : this.renderRoot.querySelector("#popover_dialog__surface");

    this._isGroupCollapsed = Boolean(this._groups) && this._groups.some((e) => e.collapsed);
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
        .searchPlaceholder="${this.searchPlaceholder}"
        @cancel=${this._onClose}
        @input-change=${this._onUserInteraction}
      ></dw-select-dialog-input>`;
    }

    if (this.type === "modal") {
      return html`
        ${this.showClose
          ? html`<dw-icon-button icon="close" @click=${() => this.close()}></dw-icon-button>`
          : html``}
        ${this.heading ? html`<div class="heading">${this.heading}</div>` : html``}
      `;
    }

    return html``;
  }

  get _contentTemplate() {
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
        .renderItem=${(item, index) =>
          this.renderItem ? this.renderItem(item) : this._defaultTemplate(item, index)}
      ></lit-virtualizer>
    `;
  }

  _defaultTemplate(item, index) {
    if (item.type === "ITEM") {
      return html`<dw-list-item
        title1=${this._getItemValue(item.value)}
        .highlight=${this._query}
        @click=${() => this._onItemClick(item)}
        ?activated=${index === this._activatedIndex}
        ?selected=${this._isItemSelected(item.value)}
        .leadingIcon=${this._getLeadingIcon(item.value)}
        ?hasLeadingIcon=${this._hasLeadingIcon()}
        .trailingIcon=${this.selectedTrailingIcon}
        ?hasTrailingIcon=${this._isTrailingIconAvailable(item.value)}
        .focusable=${false}
      ></dw-list-item>`;
    }
    // Render Group
    if (item.type === "GROUP") {
      return html`<dw-select-group-item
        .name="${item.value.name}"
        .label="${this._getGroupValue(item.value)}"
        .index="${index}"
        ?activated=${index === this._activatedIndex}
        ?collapsible=${item.value.collapsible}
        ?collapsed=${item.value.collapsed}
        @click=${(e) => this._onGroupClick(e, item)}
      ></dw-select-group-item>`;
    }
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
   * @returns whether item is selected or not.
   */
  _isItemSelected(item) {
    if (this.value && this.valueExpression) {
      return item[this.valueExpression] === this.value[this.valueExpression];
    }

    if (this.value) {
      return isEqual(item, this.value);
    }

    return false;
  }

  _onItemClick(item) {
    this.dispatchEvent(new CustomEvent("selected", { detail: item }));
    this.close();
  }

  _onGroupClick(e, item) {
    let groups = this._groups;
    const index = groups.indexOf(item.value);
    if (groups[index].collapsible) {
      groups[index].collapsed = groups[index].collapsed ? false : true;
    }

    this._groups = groups;
  }

  _getItems() {
    let sortedArray = filter(this.items, (item) => {
      return this.isMatched(
        this._getItemValue(item).toLowerCase(),
        this._query.toLowerCase().split(" ")
      );
    });

    let array = [];

    if (!Array.isArray(this.items)) {
      this._items = array;
      return;
    }

    // If group is exist
    if (Array.isArray(this._groups)) {
      let groups = this._groups;

      if (this.value) {
        groups = this._groups.map((group) => {
          if (group.name === this.value[this.groupExpression]) {
            return { ...group, collapsed: false };
          }
          return group;
        });
      }

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
            array.push({ type: "GROUP", value: group });
          }

          if (!group.collapsed) {
            // Push every items
            filteredArray.forEach((item) => {
              array.push({ type: "ITEM", value: item });
            });
          }
        }
      });
    }

    // If group does not exist
    if (!Array.isArray(this._groups)) {
      sortedArray.forEach((item) => {
        array.push({ type: "ITEM", value: item });
      });
    }

    this._items = array;
  }

  /**
   * Wheter query matching with any word of the input string
   * @param {String} string string which will be matched with query string
   * @param {Array} queryArray array
   * @returns return true if query string's any word is matched with input string
   */
  isMatched(string, queryArray) {
    let isMatched = false;

    forEach(queryArray, (e) => {
      if (string.indexOf(e) !== -1) {
        isMatched = true;
        return false;
      }
    });
    return isMatched;
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
      this._onInput();
    }
  }

  _onClose() {
    this.close();
  }

  _onInput(e) {
    let el = this.renderRoot.querySelector("dw-select-dialog-input");
    this._query = el.value;

    if (this._query && this._isGroupCollapsed) {
      let groups = this._groups;
      groups.map((e) => (e.collapsed = false));
      this._groups = groups;
    }
  }

  _getItem(index) {
    return this._items[index];
  }

  onKeydown(e) {
    if (this.opened) {
      if (e.keyCode === KEY_CODE.ARROW_UP) {
        this._moveActivated(DIRECTION.UP);
      }

      if (e.keyCode === KEY_CODE.ARROW_DOWN) {
        this._moveActivated(DIRECTION.DOWN);
      }

      if (e.keyCode === KEY_CODE.ENTER) {
        this._onItemClick(this._getItem(this._activatedIndex));
      }
    }
  }

  _moveActivated(direction) {
    var items = this.renderRoot.querySelectorAll("dw-list-item");

    if (this._items.length === 0) {
      return;
    }

    let numberOfitems = this.items.length - 1;

    let isFistItem = this._activatedIndex === 0;
    let isLastItem = this._activatedIndex === numberOfitems;
    let isNoitemActivated = this._activatedIndex === -1;

    let modifier = 1;

    if ((isNoitemActivated || isFistItem) && direction === DIRECTION.UP) {
      this._activatedIndex = numberOfitems;
    } else if ((isNoitemActivated || isLastItem) && direction === DIRECTION.DOWN) {
      this._activatedIndex = 0;
    } else {
      modifier = direction === DIRECTION.DOWN ? 1 : -1;
      this._activatedIndex = this._activatedIndex + modifier;
    }

    let element = items[this._activatedIndex];

    scrollIntoView(this._scrollableElement, element);
  }
}

window.customElements.define("dw-select-core-dialog", DwSelectCoreDialog);
