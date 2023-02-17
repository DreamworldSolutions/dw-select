import { css, html, LitElement, nothing } from "@dreamworld/pwa-helpers/lit.js";
import { isElementAlreadyRegistered } from "@dreamworld/pwa-helpers/utils.js";
import { DwSelectTrigger } from "./dw-select-trigger.js";

// Lodash Methods
import debounce from "lodash-es/debounce";

// Utils
import { filter, KeyCode } from "./utils.js";

export class DwSelectTemp extends DwSelectTrigger {
  static get properties() {
    return {
      /**
       * Selected list item object.
       * `object` in case of single selection;
       * `object[]` in case of multiple selections.
       */
      selectedItems: { type: Array },

      /**
       * Input property.
       * __NOTE:__ When it is specified (not `undefined`) & its value is different than `value`;
       * then highlight is shown. (Comparison is done by reference)
       */
      originalValue: { type: Object },

      /**
       * Message to show in the error color when the `required`, and `_requiredErrorVisible` are true.
       */
      requiredMessage: { type: String },

      /**
       * Whether or not to show the `required` error message.
       */
      _requiredErrorVisible: { type: Boolean },

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
       * Shows an icon-button with a close icon,
       * in the `top-right` corner on the bottom-sheet dailog.
       */
      showClose: { type: Boolean },

      /**
       * Name of trailing Icon which availble in selected item.
       */
      selectedTrailingIcon: { type: String },

      /**
       * Messages of for noRecords and noMatching
       * Example: {noRecords: "", noMatching: "", loading: ""}
       */
      messages: { type: Object },

      /**
       * Placeholder for fit dialog's search input
       */
      searchPlaceholder: { type: String },

      /**
       * Input property
       * Function which returns hint text string
       * In the argument selected value
       */
      helperTextProvider: { type: Function },

      /**
       * Input Property
       * A function to customize search.
       * function has two parameters
       *  - item
       *  - query
       *
       * returns always boolean
       */
      queryFilter: { type: Function },

      /**
       * search query (as text). used to filter items and highlight matched words.
       */
      _query: { type: String },

      /**
       * Contains text that presents on input text field
       * Computed property on `value`
       */
      _selectedValueText: { type: String },

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
       * Represents last successful computation by newValueProvider.
       */
      _newValue: { type: Object },

      /**
       * Represents a Promise, corresponding to any pending result of newValueProvider call.
       * It would be undefined if no such request is pending.
       */
      _newValueRequest: { type: Object },
    };
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          --dw-popover-min-width: 0px;
          --dw-select-highlight-bg-color: #fde293;
          --dw-select-item-selected-bg-color: transparent;
        }
      `,
    ];
  }

  /**
   * Trigger Element Getter
   */
  get _triggerElement() {
    return this.renderRoot.querySelector(".mdc-text-field");
  }

  get _dialogElement() {
    return this.renderRoot.querySelector("dw-select-base-dialog");
  }

  constructor() {
    super();
    this.searchable = false;
    this.heading = "";
    this.showClose = false;
    this.searchPlaceholder = "";
    this._selectedValueText = "";
    this.valueTextProvider = () => {};
    this.groupSelector = () => {};

    this.valueEquator = (v1, v2) => v1 === v2;
    this.helperTextProvider = (value) => {};
    this.queryFilter = (item, query) => filter(this._getItemValue(item), query);
    this.newValueProvider = (query) => query;
  }

  render() {
    return html` ${super.render()} ${this._rednerDialog} `;
  }

  get _rednerDialog() {
    if (!this.opened) {
      return nothing;
    }

    return html`<dw-select-base-dialog
      id="selectDialog"
      .opened=${true}
      .triggerElement=${this._triggerElement}
      .value=${this.selectedItems}
      .items="${this.items}"
      .valueProvider=${this.valueProvider}
      .valueExpression=${this.valueExpression}
      .valueTextProvider=${this.valueTextProvider}
      .groups=${this.groups}
      .groupSelector=${this.groupSelector}
      .groupExpression=${this.groupExpression}
      .queryFilter=${this.queryFilter}
      _query=${this._query}
      ?vkb=${this.vkb}
      ?searchable=${this.searchable}
      .renderItem=${this.renderItem}
      .renderGroupItem=${this.renderGroupItem}
      .heading=${this.heading}
      .searchPlaceholder="${this.searchPlaceholder}"
      .errorMessage=${this.required ? this.requiredMessage : this.errorMessage}
      .errorInTooltip=${this.errorInTooltip}
      .helper=${this._computeHelperText()}
      ?showClose=${this.showClose}
      .selectedTrailingIcon="${this.selectedTrailingIcon}"
      .dialogFooterElement=${this._footerTemplate}
      ?allowNewValue="${this.allowNewValue}"
      .newValueProvider="${this.newValueProvider}"
      @selected=${this._onSelect}
      @dw-dialog-opened="${(e) => this._onDialogOpen(e)}"
      @dw-fit-dialog-opened="${(e) => this._onDialogOpen(e)}"
      @dw-dialog-closed="${(e) => this._onDialogClose(e)}"
      @dw-fit-dialog-closed="${(e) => this._onDialogClose(e)}"
      @new-value-status-changed="${this._onNewValueStausChanged}"
      .messages="${this.messages}"
      ._getItemValue=${this._getItemValue}
    ></dw-select-base-dialog>`;
  }

  /**
   * Footer Template getter
   * Used when this element is used by `Extension` To override this method
   */
  get _footerTemplate() {
    return nothing;
  }

  connectedCallback() {
    super.connectedCallback();
    this._onUserInteraction = debounce(this._onUserInteraction.bind(this), 100);

    this._bindEvents();
  }

  willUpdate(_changedProperties) {
    super.willUpdate(_changedProperties);

    if (_changedProperties.has('searchable') || _changedProperties.has('vkb')) {
      this.readOnly = !(this.searchable && !this.vkb);
    }

    if (_changedProperties.has("opened")) {
      this._loadFragments();
      this._setPopoverDialogWidth();
    }

    if (_changedProperties.has("selectedItems")) {
      this.value = this._getValue;
    }
  }

  _bindEvents() {
    this.addEventListener("click", this._onTrigger);
    this.addEventListener("blur", this._onBlur);
    this.addEventListener("input", this._onUserInteraction);
    this.addEventListener("expand-toggle", this._onDialogOpenToggle);
    this.addEventListener("keydown", this._onKeydown);
  }

  /**
   * Returns String that represents current value
   */
  get _getValue() {
    if (!this.selectedItems) {
      return "";
    }
    if (!this.valueTextProvider(this.selectedItems)) {
      if (typeof this.selectedItems !== "string") {
        return "";
      }
      return this.selectedItems;
    }
    return this.valueTextProvider(this.selectedItems);
  }

  /**
   * Import manually
   */
  _loadFragments() {
    if (this.opened) {
      import("./dw-select-base-dialog.js");
    }
  }

  /**
   * Set dialog width if `dialogWidth` is provided.
   * Otherwise determine trigger element's width and set to dialog
   */
  _setPopoverDialogWidth() {
    const triggerEl = this.renderRoot.querySelector(".mdc-text-field");
    if (!triggerEl) {
      return;
    }

    if (this.dialogWidth) {
      this.style.setProperty("--dw-popover-width", this.dialogWidth + "px");
      return;
    }

    console.log(triggerEl.offsetWidth);

    // Set Trigger element's offSetWidth to PopOver Dialog
    this.style.setProperty("--dw-popover-width", triggerEl.offsetWidth + "px");
  }

  _setPopoverHeight() {
    const viewportHeight = window.innerHeight;
    const triggerRect = this._triggerElement.getBoundingClientRect();
    const isPlacementBottom = triggerRect.bottom <= viewportHeight / 2;
    let popoverMaxHeight = 0;

    if (isPlacementBottom) {
      this._dialogElement.popoverPlacement = "bottom-start";
      popoverMaxHeight = viewportHeight - (triggerRect.bottom + 8);
    } else {
      this._dialogElement.popoverPlacement = "top-start";
      this._dialogElement.popoverOffset = [0, 8];
      popoverMaxHeight = triggerRect.top - 16;
    }

    this._popoverMaxHeight = popoverMaxHeight;
    this.style.setProperty("--dw-popover-max-height", popoverMaxHeight + "px");
  }

  _computeHelperText() {
    if (
      this.helperTextProvider &&
      typeof this.helperTextProvider === "function" &&
      this.helperTextProvider(this.value)
    ) {
      return this.helperTextProvider(this.value);
    }
    return this.helper;
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

  _onDialogOpen(e) {
    e.stopPropagation();

    if (this._dialogElement && this._dialogElement.type === "popover") {
      this._setPopoverHeight();
    }
  }

  _onDialogClose(e) {
    e.stopPropagation();
    this.opened = false;
  }

  _onSelect(e) {
    console.log("_onSelect");
    this.selectedItems = e.detail.value;
    this.value = this._getValue;
    this.dispatchEvent(new CustomEvent("selected", { detail: this.selectedItems }));
  }

  _onTrigger(e) {
    const inputClick =
      e.composedPath().findIndex((el) => {
        return el.tagName === "INPUT";
      }) !== -1;
    if (!inputClick) {
      return;
    }
    console.log(inputClick, this.opened, this.readOnly);
    if (!this.readOnly) {
      this.opened = true;
    }
  }

  _onBlur(e) {
    if (!this._query && !this.value) {
      console.log("_onBlur");
      this.selectedItems = undefined;
      this.dispatchEvent(new CustomEvent("clear-selection"));
    }

    if (!this.allowNewValue) {
      this._query = "";
      this._selectedValueText = this._getValue;
    }
  }

  /**
   * Trigger when actual user intract
   * @param {Event} e
   */
  _onUserInteraction(e) {
    if (e.type === "input") {
      this._onInput(e);
    }
  }

  _onInput(e) {
    e.stopPropagation();
    this._query = this.value;
    this._selectedValueText = this.value;
    if (this._query && !this.opened) {
      this.opened = true;
    }
  }

  _onDialogOpenToggle() {
    this.opened = !this.opened;
  }

  _onKeydown(e) {
    if (
      e.keyCode === KeyCode.ENTER ||
      e.keyCode === KeyCode.ARROW_DOWN ||
      e.keyCode === KeyCode.ARROW_UP
    ) {
      this._onTrigger(e);
    }
  }

  _onNewValueStausChanged(e) {
    this._newValueStatus = e.detail;
  }
}

if (isElementAlreadyRegistered("dw-select-temp")) {
  console.warn("lit: 'dw-select' is already registered, so registration skipped.");
} else {
  customElements.define("dw-select-temp", DwSelectTemp);
}
