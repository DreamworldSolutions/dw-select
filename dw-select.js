import { LitElement, html, css } from "lit";

// View Elements
import "./dw-select-trigger.js";

// Lodash Methods
import get from "lodash-es/get";

const KEYCODES = {
  ENTER: 13,
};

/**
 * A Select is an input widget with an associated dropdown that allows users to select a value from a list of possible values.
 *
 * ## Types of Select
 *
 * ### Default
 *  - Sometimes Select does not support to allowed user intrect with text input (Non-searchable).
 *  - It is used when the list of options is predefined and limited.
 *
 * ### Searchable
 *  - Sometimes Select support to allowed user intrect with text input (searchable).
 *  - Typing input serves to filter suggestions presented in the popup.
 *  - It is used when the list of options is variable and very long.
 *
 * ## Behaviour
 *  - Renders `dw-select-trigger` and `dw-select-dialog`
 *  - When `opened` is true attach and open dialog
 *
 * ### Focus:
 *  - For searchable types, it shows a cursor. For non searchable type, doesn’t show cursor.
 *  - The dropdown opens when the user clicks the field using a pointing device.
 *
 * ### Typing:
 *  - Not applicable to non searchable
 *  - Typing a character when the field is focused also opens the popup.
 *  - Shows result matching with any word of the input string. For e.g. if the user types ‘hdfc bank’ it should show a records which contains words ‘hdfc’ or ‘bank’ anywhere (at start, middle or at end)
 *  - Matching string is highlighted
 *  - Shows the most relevant matches in dropdown in sorted order. Sorting order is most matched to least matched.
 *
 * ### Keyboard accessibility
 *  TODO - write documentation
 *
 * ### Toggle icon
 *  TODO - write documentation
 *
 * ### Reset Icon
 *  TODO - write documentation
 */

export class DwSelect extends LitElement {
  static properties = {
    /**
     * Sets the `name` attribute on the internal input.
     * The name property should only be used for browser autofill as webcomponent form participation does not currently consider the `name` attribute.
     */
    name: { type: String },

    /**
     * Selected list item object.
     * `object` in case of single selection;
     * `object[]` in case of multiple selections.
     */
    value: { type: Object },

    /**
     * Input property.
     * __NOTE:__ When `originalValue` is specified (not `undefined`) &
     * its value is different than this; then highlight is shown. (Comparison is done by reference)
     */
    originalValue: { type: Object },

    /**
     * Whether or not to show the `outlined` variant.
     */
    outlined: { type: Boolean },

    /**
     * Sets floating label value.
     * __NOTE:__ The label will not float if the selected item has a false value property.
     */
    label: { type: String },

    /**
     * Sets disappearing input placeholder.
     */
    placeholder: { type: String },

    /**
     * Helper text to display below the input.
     * Display default only when focused.
     */
    helper: { type: String },

    /**
     * Whether or not to show the `readOnly` state.
     */
    readOnly: { type: Boolean },

    /**
     * Displays error state if value is empty and input is blurred.
     */
    required: { type: Boolean },

    /**
     * Message to show in the error color when the textfield is invalid.
     */
    errorMessage: { type: String },

    /**
     * Message to show in the error color when the `required`, and `_requiredErrorVisible` are true.
     */
    requiredMessage: { type: String },

    /**
     * Whether or not to show the `required` error message.
     */
    _requiredErrorVisible: { type: Boolean },

    /**
     * The [`ValidityState`](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState) of the textfield.
     */
    validity: { type: Object },

    /**
     * Whether or not to show the `disabled` variant.
     */
    disabled: { type: Boolean },

    /**
     * Whether or not to show the `searchable` variant.
     */
    searchable: { type: Boolean },

    /**
     * `vkb` stands for Virtual KeyBoard.
     * Whether the Device has Virtual KeyBoard.
     */
    vkb: { type: Boolean },

    /**
     * List of groups.
     */
    groups: { type: Array },

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
     * Provides value that actually represent in list items
     */
    valueProvider: { type: Function },

    /**
     * Expression of the value
     * default: _id
     */
    valueExpression: { type: String },

    /**
     * returns String. Provides value that represents in list item
     */
    valueTextProvider: { type: Function },

    /**
     * By default, the pop-over dialog is rendered in the width of the host element
     * And the fit dialog is rendered in a fixed-width specified by –dw-select-fit-dialog-width css property.
     * __But:__ when this is specified, both dialogs are shown in this width.
     * __Note:__ BottomSheet dialog is always in full width, so this doesn’t affect it.
     */
    dialogWidth: { type: Number },

    /**
     * Provides any Block element to represent list items.
     * Should show its hover effect, and ripple on click.
     * Highlight text based on `query`.
     * Integrator listens to the ‘click’ event to know whether the selection is changed or not.
     * __Note:__ It must not be focusable.
     */
    renderItem: { type: Object },

    /**
     * Provides any Block elements to represent group items.
     * name property should be set to input name.
     * Should show hover & ripple effects only if it’s collapsible.
     * Integrator listens on ‘click’ event to toggle collapsed status.
     */
    renderGroupItem: { type: Object },

    /**
     * Whether dialog is opened or not.
     * Used to set dialog width. Only for popover dialog.
     */
    _opened: { type: Boolean },

    /**
     * search query in string. used to filter items and highlight query keywords
     */
    _query: { type: String },
  };

  /**
   * Trigger Element Getter
   */
  get _triggerElement() {
    return this.renderRoot.querySelector("dw-select-trigger");
  }

  static styles = [
    css`
      :host {
        --dw-popover-min-width: 0px;
      }
    `,
  ];

  constructor() {
    super();
    this.valueExpression = "_id";
    this.searchable = false;
  }

  render() {
    return html`
      <dw-select-trigger
        label=${this.label}
        placeholder=${this.placeholder}
        helper=${this.helper}
        ?readOnly=${!this.searchable}
        value=${this._getValue}
        ?outlined=${this.outlined}
        @click=${this._onTrigger}
        @input=${this._onInput}
        @keydown=${this._onKeydown}
      ></dw-select-trigger>
      ${this._opened
        ? html`<dw-select-dialog
            id="selectDialog"
            opened
            .triggerElement=${this._triggerElement}
            .value=${this.value}
            .items="${this.items}"
            .valueProvider=${this.valueProvider}
            .valueExpression=${this.valueExpression}
            .valueTextProvider=${this.valueTextProvider}
            .groups=${this.groups}
            .groupSelector=${this.groupSelector}
            .groupExpression=${this.groupExpression}
            ?vkb=${this.vkb}
            ?searchable=${this.searchable}
            .renderItem=${this.renderItem}
            .renderGroupItem=${this.renderGroupItem}
            @selected=${this._onSelect}
            @dw-dialog-closed="${this._onDialogClose}"
          ></dw-select-dialog>`
        : html``}
    `;
  }

  willUpdate(_changedProperties) {
    if (_changedProperties.has("_opened") && this._opened) {
      this._loadFragments();
      this._setPopoverDialogWidth();
    }
  }

  /**
   * Import manually
   */
  _loadFragments() {
    if (this._opened) {
      import("./dw-select-dialog.js");
    }
  }

  /**
   * Set dialog width if `dialogWidth` is provided.
   * Otherwise determine trigger element's width and set to dialog
   */
  _setPopoverDialogWidth() {
    if (this.dialogWidth) {
      this.style.setProperty("--dw-popover-width", this.dialogWidth + "px");
      return;
    }

    // Trigger element getter
    let triggerEl = this.renderRoot.querySelector("dw-select-trigger");

    // Set Trigger element's offSetWidth to PopOver Dialog
    this.style.setProperty("--dw-popover-width", triggerEl.offsetWidth + "px");
  }

  /**
   * Returns String that represents current value
   */
  get _getValue() {
    return this.valueExpression ? get(this.value, this.valueExpression) : this.value;
  }

  _onTrigger(e) {
    this._opened = true;
  }

  _onInput(e) {
    console.log(e.target.value);
  }

  _onSelect(e) {
    this.value = e.detail.value;
  }

  _onDialogClose() {
    this._opened = false;
  }

  _onKeydown(e) {
    if (e.keyCode === KEYCODES.ENTER) {
      this._onTrigger(e);
    }
  }
}

customElements.define("dw-select", DwSelect);
