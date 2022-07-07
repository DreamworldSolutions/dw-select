import { css, html } from "lit-element";

// View Elements
import { DwCompositeDialog } from "@dreamworld/dw-dialog/dw-composite-dialog.js";

/**
 * Renders the list of choices on temporary Composite Dialog.
 * Using `dw-list-item` or custom template provider `renderItem` to render List of Items
 *
 * [`select-dialog-doc`](docs/select-dialog.md)
 */

export class DwSelectDialog extends DwCompositeDialog {
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
    items: { type: Object },

    /**
     * Represents items to be rendered by lit-virtualizer.
     * { type: GROUP or ITEM, value: Group or Item object }
     * It’s computed from _groups, items & query.
     */
    _items: { type: Object },

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
     * Messages of for noRecords and noMatchingRecords
     * Example: {noRecords: "", noMatchingRecords: ""}
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

  constructor() {
    super();
    this.type = "popover";
  }

  get _contentTemplate() {
    return html`Dw-Select-dialog`;
  }
}

window.customElements.define("dw-select-dialog", DwSelectDialog);
