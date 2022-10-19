import { LitElement, html, css, nothing } from "lit";

// View Elements
import "./dw-select-trigger.js";

// Lodash Methods
import get from "lodash-es/get";
import debounce from "lodash-es/debounce";

const KEY_CODE = {
  ENTER: 13,
  ARROW_UP: 38,
  ARROW_DOWN: 40,
};

/**
 * A Select is an input widget with an associated dropdown that allows users to select a value from a list of possible values.
 *
 * ## Types of Select
 *
 * ### Default
 *  - Sometimes Select does not allow user to interact with text input (Non-searchable).
 *  - It is used when the list of options is predefined and limited.
 *
 * ### Searchable
 *  - Sometimes Select allows user to interact with text input (searchable).
 *  - Typing input serves to filter suggestions presented in the dropdown.
 *  - It is used when the list of options is variable and/or very long.
 *
 * ## Behaviour
 *  - Renders `dw-select-trigger` and `dw-select-dialog`
 *  - When `opened=true` drop-down dialog is opened
 *
 * ### Focus:
 *  - For searchable types, it shows a cursor. For non searchable type, doesn’t show cursor.
 *  - The dropdown opens when the user clicks the field using a pointing device.
 *
 * ### Typing:
 *  - Not applicable to non-searchable
 *  - Typing a character when the field is focused also opens the drop-down.
 *  - drop-down shows result matching with any word of the input text. For e.g. if the user types ‘hdfc bank’ it should show a records which contains words ‘hdfc’ or ‘bank’ anywhere (at start, middle or at end)
 *  - Matching text is highlighted
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
  static get properties() {
    return {
      /**
       * Sets the `name` attribute on the internal input.
       * The name property should only be used for browser autofill as webcomponent form participation
       * does not currently consider the `name` attribute.
       */
      name: { type: String },

      /**
       * Selected list item object.
       * `object` in case of single selection;
       * `object[]` in case of multiple selections.
       */
      value: { type: Array },

      /**
       * Input property.
       * __NOTE:__ When it is specified (not `undefined`) & its value is different than `value`;
       * then highlight is shown. (Comparison is done by reference)
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
       * Set `true` to apply required validation.
       */
      required: { type: Boolean },

      /**
       * A Custom Error Message to be shown.
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
       * Set to `true` to make it disabled.
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
       * Specify various available/possible groups of the Items.
       * A Group is an Object `{name: string, title: string, collapsible: boolean, collapsed: boolean}`
       */
      groups: { type: Array },

      /**
       * A Function `(item) -> groupName` to identify a group from an item.
       */
      groupSelector: { type: Function },

      /**
       * An expression (dot-separated properties) to be applied on Item, to find it's group.
       * When `groupSelector` is specified, this is ignored. When `groupSelector` isn't specified
       * and this is specified, `groupSelector` is built using this.
       */
      groupExpression: { type: String },

      /**
       * List of total available items under drop-down.
       */
      items: { type: Array },

      /**
       * A function `(item) -> value` to indetify value of any item.
       */
      valueProvider: { type: Function },

      /**
       * An expression (dot-separated properties) to be applied on Item, to find it's value.
       * When `valueProvider` is specified, this is ignored. When `valueProvider` isn't specified
       * and this is specified, `valueProvider` is built using this.
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
       * By default, the pop-over dialog is rendered in the width of the host element
       * And the fit dialog is rendered in a fixed-width specified by
       * `-–dw-select-fit-dialog-width` css property.
       *
       * __But:__ when this is specified, both dialogs are shown in this width.
       * __Note:__ BottomSheet dialog is always in full width, so this doesn’t affect it.
       */
      dialogWidth: { type: Number },

      /**
       * A function to customize item rendering.
       * Prototype: `(item, selected, activated, query) => HTMLTemplate`.
       *
       * - Input property.
       * - It's Optional, by default it renders an item using a `dw-surface`.
       * - Template should render only 1 root-level block element. Obviously, it's tree can have multiple
       * children at any depth.
       * - It should show hover and ripple (on click) effects.
       * - Highlight text based on `query`.
       * `click` event on it is being listened to know that item has been selected by the user.
       * __Note:__ It must not be focusable.
       */
      renderItem: { type: Object },

      /**
       * A function to customize groupItem's rendering.
       * Prototype: `(name, label, collapsible, collapsed, activated) => HTMLTemplate`
       *
       * - Input property.
       * - It's optional, by default it renders groupItem using //TODO: ????
       * - Template should render only 1 root-level block element. Obviously, it's tree can have multiple
       * children at any depth.
       * - `name` (available as input) should be set to `name` property on the groupItem element.
       * - It should show hover and ripple (on click) effects, but only when it’s `collapsible`.
       * - `click` event on it is being listened to toggle `collapsed` status.
       */
      renderGroupItem: { type: Object },

      /**
       * Set this to configure custom logic to detect whether value is changed or not.
       * Default: compares both values by strict equality (by reference) `v1 === v2`.
       * It must return a Boolean.
       * Function receives 2 arguments: (v1, v2). Should return `true` when both values are same otherwise `false`.
       */
      valueEquator: { type: Function },

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
       * Whether dialog is opened or not.
       */
      _opened: { type: Boolean },

      /**
       * search query (as text). used to filter items and highlight matched words.
       */
      _query: { type: String },

      /**
       * When true, shows updated highlights.
       */
      _updatedHighlight: { type: Boolean },
    };
  }

  /**
   * Trigger Element Getter
   */
  get _triggerElement() {
    return this.renderRoot.querySelector("dw-select-trigger");
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          --dw-popover-min-width: 0px;
        }
      `,
    ];
  }

  constructor() {
    super();
    this.valueExpression = "_id";
    this.searchable = false;
    this.heading = "";
    this.showClose = false;
    this.valueTextProvider = () => {};
    this.groupSelector = () => {};

    this.valueEquator = (v1, v2) => v1 === v2;
  }

  render() {
    return html`
      <dw-select-trigger
        label=${this.label}
        placeholder=${this.placeholder}
        helper=${this.helper}
        ?inputAllowed=${this.searchable && !this.readOnly}
        value=${this._getValue}
        ?outlined=${this.outlined}
        ?disabled=${this.disabled}
        ?required=${this.required}
        ?updatedHighlight=${this._updatedHighlight}
        .errorMessage=${this.required ? this.requiredMessage : this.errorMessage}
        @click=${this._onTrigger}
        @input=${this._onUserInteraction}
        @keydown=${this._onKeydown}
        ?opened = "${this._opened}"
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
            _query=${this._query}
            ?vkb=${this.vkb}
            ?searchable=${this.searchable}
            .renderItem=${this.renderItem}
            .renderGroupItem=${this.renderGroupItem}
            .heading=${this.heading}
            ?showClose=${this.showClose}
            .dialogFooterElement=${this._footerTemplate}
            @selected=${this._onSelect}
            @dw-dialog-closed="${this._onDialogClose}"
            @dw-fit-dialog-closed="${this._onDialogClose}"
          ></dw-select-dialog>`
        : nothing}
    `;
  }

  /**
   * Footer Template getter
   * Used when this element is used by `Extension` To override this method
   */
  get _footerTemplate() {
    return;
  }

  connectedCallback() {
    super.connectedCallback();
    this._onUserInteraction = debounce(this._onUserInteraction.bind(this), 100);

    if (this.originalValue) {
      this.value = this.originalValue;
    }
  }

  willUpdate(_changedProperties) {
    if (_changedProperties.has("_opened") && this._opened) {
      this._loadFragments();
      this._setPopoverDialogWidth();
    }

    if (_changedProperties.has("value")) {
      this._updatedHighlight = !this.valueEquator(this.value, this.originalValue);
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
   * Trigger when actual user intract
   * @param {Event} e
   */
  _onUserInteraction(e) {
    if (e.type === "input") {
      this._onInput();
    }
  }

  /**
   * Returns String that represents current value
   */
  get _getValue() {
    if (!this.value) {
      return "";
    }
    if (!this.valueTextProvider(this.value)) {
      if (typeof this.value !== "string") {
        return "";
      }
      return this.value;
    }
    return this.valueTextProvider(this.value);
  }

  _onTrigger(e) {
    if (!this.readOnly) {
      this._opened = true;
    }
  }

  _onInput(e) {
    // Trigger element getter
    let triggerEl = this.renderRoot.querySelector("dw-select-trigger");

    this._query = triggerEl.value;
  }

  _onSelect(e) {
    this.value = e.detail.value;
    this.dispatchEvent(new CustomEvent("selected", { detail: this.value }));
  }

  _onDialogClose() {
    this._opened = false;
  }

  _onKeydown(e) {
    if (e.keyCode === KEY_CODE.ENTER) {
      this._onTrigger(e);
    }
  }
}

customElements.define("dw-select", DwSelect);
