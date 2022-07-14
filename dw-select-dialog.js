import { css, html } from "lit-element";
import { repeat } from "lit-html/directives/repeat";

// View Elements
import { DwCompositeDialog } from "@dreamworld/dw-dialog/dw-composite-dialog.js";
import "@material/mwc-circular-progress";
import "@dreamworld/dw-icon";
import "@dreamworld/dw-list-item";
import "./dw-select-group-item";

// Lodash Methods
import get from "lodash-es/get";
import isEqual from "lodash-es/isEqual";
import orderBy from "lodash-es/orderBy";
import filter from "lodash-es/filter";

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

export class DwSelectDialog extends DwCompositeDialog {
  static styles = [
    DwCompositeDialog.styles,
    css`
      :host {
        display: block;
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
      }

      .no-record dw-icon {
        padding-bottom: 8px;
      }
    `,
  ];

  static properties = {
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
     * To select group name
     * returns group name in string
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
     * search query in string. used to filter items and highlight query keywords
     */
    _query: { type: String },
  };

  set _groups(value) {
    let oldValue = this._type;

    if (value === oldValue) {
      return;
    }

    this.__groups = value;
    this.requestUpdate("_groups", oldValue);
    // Compute updated `_items`
    this._getItems();
  }

  get _groups() {
    return this.__groups;
  }

  constructor() {
    super();
    this.type = "popover";
    this.showTrigger = true;
    this.valueExpression = "_id";
    this.messages = defaultMessages;
  }

  connectedCallback() {
    // Set initial _groups value that actually used compute list of choices
    this._groups = this.groups;

    if (this.vkb) {
      this.type = "modal";
      this.placement = "bottom";
    }

    super.connectedCallback();
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has("items")) {
      this._getItems();
    }
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

  get _renderLoading() {
    return html`<div class="loading">
      <mwc-circular-progress indeterminate density="-2"></mwc-circular-progress>
      <div>${this.messages.loading}</div>
    </div>`;
  }

  get _renderNoRecord() {
    return html`<div class="no-record">
      <dw-icon name="search_off" size="36"></dw-icon>
      <div>
        ${this.items && this.items.length === 0
          ? this.messages.noRecords
          : this.messages.noMatching}
      </div>
    </div>`;
  }

  get _renderList() {
    return html`
      ${repeat(this._items, (item, index) =>
        this.renderItem ? this.renderItem(item) : this._defaultTemplate(item)
      )}
    `;
  }

  _defaultTemplate(item) {
    if (item.type === "ITEM") {
      let title1 = this.valueExpression ? get(item.value, this.valueExpression) : item.value;
      return html`<dw-list-item
        title1=${title1}
        @click=${(e) => this._onItemClick(e, item)}
        ?selected=${this._isItemSelected(item)}
        .focusable=${false}
      ></dw-list-item>`;
    }
    // Render Group
    if (item.type === "GROUP") {
      return html`<dw-select-group-item
        name=${item.value.name}
        label=${item.value.label}
        ?collapsible=${item.value.collapsible}
        ?collapsed=${item.value.collapsed}
        @click=${(e) => this._onGroupClick(e, item)}
      ></dw-select-group-item>`;
    }
  }

  /**
   *
   * @param {Object} item Selected item, one of the `items`
   * @returns whether item is selected or not.
   */
  _isItemSelected(item) {
    return isEqual(item.value, this.value);
  }

  _onItemClick(e, item) {
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
    let array = [];

    if (!Array.isArray(this.items)) {
      this._items = array;
      return;
    }

    // If group is exist
    if (Array.isArray(this._groups)) {
      // Sort Items with groupExpression and valueExpression
      const sortedArray = orderBy(this.items, [this.groupExpression, this.valueExpression]);

      this._groups.forEach((group) => {
        // Filter items with group
        const filteredArray = filter(sortedArray, [this.groupExpression, group.name]);
        if (filteredArray.length !== 0) {
          // First push group item
          array.push({ type: "GROUP", value: group });

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
      this.items.forEach((item) => {
        array.push({ type: "ITEM", value: item });
      });
    }

    this._items = array;
  }
}

window.customElements.define("dw-select-dialog", DwSelectDialog);
