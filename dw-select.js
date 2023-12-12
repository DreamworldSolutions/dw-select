import { css, html, LitElement, nothing } from '@dreamworld/pwa-helpers/lit.js';
import { isElementAlreadyRegistered } from '@dreamworld/pwa-helpers/utils.js';
import DeviceInfo from '@dreamworld/device-info';

// View Elements
import { DwFormElement } from '@dreamworld/dw-form/dw-form-element.js';
import './dw-select-base-dialog.js';
import './dw-select-trigger.js';

// Lodash Methods
import debounce from 'lodash-es/debounce';

// Utils
import { NEW_VALUE_STATUS } from './utils';
import { filter, KeyCode } from './utils.js';

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

export class DwSelect extends DwFormElement(LitElement) {
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
       * Always show the helper text despite focus.
       */
      helperPersistent: { type: Boolean },

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
       * It could be `String` or `Function`.
       */
      error: { type: Object },

      /**
       * Message to show in the error color when the `required`, and `_requiredErrorVisible` are true.
       */
      errorMessages: { type: Object },

      /**
       * Whether or not to show the `required` error message.
       */
      _requiredErrorVisible: { type: Boolean },

      /**
       * The [`ValidityState`](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState) of the textfield.
       */
      validity: { type: Object },

      /**
       * Reports validity on value change rather than only on blur.
       * this property directly pass to trigger element
       */
      autoValidate: { type: Boolean },

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
      _vkb: { type: Boolean },

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
       * Input property.
       * Items to be prepended on top of the items.
       */
      prependItems: { type: Array },

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
       * Computed property from valueProvider and valueExpression
       */
      _valueProvider: { type: Function },

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

      /**
       * Contains text that presents on input text field
       * Computed property on `value`
       */
      _selectedValueText: { type: String },

      /**
       * Text to show the warning message.
       */
      warning: { type: String },

      /**
       * Input Property
       * Whether error message shows in tooltip or not.
       * Default erro shows at hint text
       */
      errorInTooltip: { type: Boolean },

      /**
       * Can be used only when “searchable=true”
       * Whether new value is allowed or not
       */
      allowNewValue: { type: Boolean },

      /**
       * An Input property.
       *
       * A function used to compute new value (an Item) from the query string.
       * (query) => {item: Item, hint: ""}
       *
       * Function may return an Object or Promise which is resolved to the object later.
       * When no item can be built from the given query (e.g. User hasn't yet finished typing), it must return either `undefined` or `{item: undefined, hint: ""}`. When hint is available, it's shown on input.
       * For any error, Promise should be resolved to an error; or exception should be thrown. In this case, Input will show
       *  the error message thrown out.
       */
      newItemProvider: { type: Function },

      /**
       * Enum property
       * Possible values: undefined | `IN_PROGRESS` | `NEW_VALUE` | `ERROR`
       */
      _newItemStatus: { type: String },

      /**
       * Represents last successful computation by newItemProvider.
       */
      _newItem: { type: Object },

      /**
       * Represents a Promise, corresponding to any pending result of newItemProvider call.
       * It would be undefined if no such request is pending.
       */
      // _newItemRequest: { type: Object },

      /**
       * Represents items to be rendered by lit-virtualizer. Same as _items property of 'select-base-dialog'.
       * { type: GROUP or ITEM, value: Group or Item object }
       * It’s computed from _groups, items & query.
       */
      _items: {
        type: Array,
      },

      /**
       * Whther the trigger element is dense or not
       */
      dense: { type: Boolean },

      /**
       * Represents current layout in String. Possible values: `small`, `medium`, `large`, `hd`, and `fullhd`.
       */
      _layout: { type: String },

      /**
       * To show invalid state to trigger elements
       */
      _invalid: { type: Boolean },

      /**
       * Set to true to highLight textfield when value is changed
       * Make sure to provide `originalValue` when setting this to true
       * It will highLight field when `value` and `originalValue` is not same
       */
      highlightChanged: { type: Boolean },

      /**
       * Whether to show hint in tooltip
       * tip trigger on hover of info, warning, and error icon button at trail.
       */
      hintInTooltip: { type: Boolean },

      /**
       * Whether to show error in tooltip
       * tip trigger on hover of info, warning, and error icon button at trail.
       */
      errorInTooltip: { type: Boolean },

      /**
       * Whether to show warning in tooltip
       * tip trigger on hover of info, warning, and error icon button at trail.
       */
      warningInTooltip: { type: Boolean },

      /**
       * Tooltip actions for hint text
       */
      hintTooltipActions: { type: Array },

      /**
       * Tooltip actions for error text
       */
      errorTooltipActions: { type: Array },

      /**
       * Tooltip actions for warning text
       */
      warningTooltipActions: { type: Array },

      /**
       * Tooltip placement
       * for more see tippyJs doc: https://atomiks.github.io/tippyjs/v6/all-props/#placement
       */
      tipPlacement: { type: String },

      popover: { type: Boolean },
    };
  }

  get item() {
    return this._getSelectedItem(this.value);
  }

  /**
   * Trigger Element Getter
   */
  get _triggerElement() {
    return this.renderRoot.querySelector('dw-select-trigger');
  }

  get _dialogElement() {
    return this.renderRoot.querySelector('dw-select-base-dialog');
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          --dw-popover-min-width: 0px;
          --dw-select-highlight-bg-color: #fde293;
        }
      `,
    ];
  }

  constructor() {
    super();
    this.searchable = false;
    this.label = '';
    this.heading = '';
    this.placeholder = '';
    this.showClose = false;
    this.searchPlaceholder = '';
    this._selectedValueText = '';
    this.prependItems = [];
    this.valueTextProvider = () => {};
    this.groupSelector = () => {};
    this._valueProvider = item => item;

    this.valueEquator = (v1, v2) => v1 === v2;
    this.helperTextProvider = value => {};
    this.queryFilter = (item, query) => filter(this._getItemValue(item), query);
    this.newItemProvider = query => query;
    this._findNewItem = debounce(this._findNewItem.bind(this), 50);
  }

  render() {
    return html` ${this._triggerTemplate} ${this._opened ? this._dialogTemplate : nothing} `;
  }

  get _triggerTemplate() {
    return html`<dw-select-trigger
      .name="${this.name}"
      .label="${this.label}"
      .placeholder="${this.placeholder}"
      .hint=${this._computeHelperText()}
      ?hintPersistent=${this.helperPersistent}
      ?inputAllowed=${this.searchable && !this._vkb}
      ?readOnly=${this.readOnly}
      .newValueStatus=${this._newItemStatus}
      .value=${this._selectedValueText}
      .originalValue="${this._originalValueText}"
      ?required="${this.required}"
      ?outlined=${this.outlined}
      ?disabled=${this.disabled}
      ?invalid=${this._invalid}
      ?autoValidate=${this.autoValidate}
      ?highlightChanged="${this.highlightChanged}"
      .error=${this.error}
      .errorMessages="${this.errorMessages}"
      .warning="${this.warning}"
      .hintInTooltip="${this.hintInTooltip}"
      .errorInTooltip=${this.errorInTooltip}
      .warningInTooltip="${this.warningInTooltip}"
      .hintTooltipActions="${this.hintTooltipActions}"
      .errorTooltipActions="${this.errorTooltipActions}"
      .warningTooltipActions="${this.warningTooltipActions}"
      .tipPlacement="${this.tipPlacement}"
      .dense=${this.dense}
      @click=${this._onTrigger}
      @input=${this._onUserInteraction}
      @keydown=${this._onKeydown}
      @expand-toggle="${this._onDialogOpenToggle}"
      @invalid=${this._onInvalid}
      @valid=${this._onValid}
      @clear-selection="${this._onClearSelection}"
      @action="${this._onTipAction}"
      ?opened="${this._opened}"
    ></dw-select-trigger>`;
  }

  get _dialogTemplate() {
    return html`<dw-select-base-dialog
      id="selectDialog"
      .opened=${this._opened}
      .type=${this._dialogType}
      .placement=${this._dialogPlacement}
      .triggerElement=${this._triggerElement}
      .value=${this.value}
      .items="${this.items}"
      .prependItems=${this.prependItems}
      .layout=${this._layout}
      .valueProvider=${this._valueProvider}
      .valueExpression=${this.valueExpression}
      .valueTextProvider=${this.valueTextProvider}
      .valueEquator=${this.valueEquator}
      .groups=${this.groups}
      .groupSelector=${this.groupSelector}
      .groupExpression=${this.groupExpression}
      .queryFilter=${this.queryFilter}
      ._query=${this._query}
      ?vkb=${this._vkb}
      ?searchable=${this.searchable}
      .renderItem=${this.renderItem}
      .renderGroupItem=${this.renderGroupItem}
      .heading=${this.heading}
      .searchPlaceholder="${this.searchPlaceholder}"
      .error=${this.error}
      .errorMessages="${this.errorMessages}"
      .errorInTooltip=${this.errorInTooltip}
      .helper=${this._computeHelperText()}
      ?showClose=${this.showClose}
      .selectedTrailingIcon="${this.selectedTrailingIcon}"
      .dialogHeaderTemplate="${this._headerTemplate}"
      .dialogFooterElement=${this._footerTemplate}
      ?allowNewValue="${this.allowNewValue}"
      ._newItemStatus="${this._newItemStatus}"
      ._newItem="${this._newItem}"
      @selected=${this._onSelect}
      @_items-changed=${this._onItemsChanged}
      @dw-dialog-opened="${e => this._onDialogOpen(e)}"
      @dw-fit-dialog-opened="${e => this._onDialogOpen(e)}"
      @dw-dialog-closed="${e => this._onDialogClose(e)}"
      @dw-fit-dialog-closed="${e => this._onDialogClose(e)}"
      @clear-selection="${this._onClearSelection}"
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

  /**
   * Footet Template getter
   *
   */
  get _headerTemplate() {
    return nothing;
  }

  get _originalValueText() {
    const originalItem = this._getSelectedItem(this.originalValue);
    return this._getValue(originalItem);
  }

  get _dialogType() {
    if (this._vkb && this.searchable) return 'fit';

    if (this._layout === 'small' && !this.popover) return 'modal';

    return 'popover';
  }

  get _dialogPlacement() {
    if (this._layout === 'small' && !this.searchable) return 'bottom';

    return 'center';
  }

  connectedCallback() {
    super.connectedCallback();
    this._onUserInteraction = debounce(this._onUserInteraction.bind(this), 100);

    if (this.originalValue) {
      this.value = this.originalValue;
    }

    this._computeValueProvider();

    this.addEventListener('focusout', this._onFocusOut);
    this._layout = DeviceInfo.info().layout;
    this._vkb = DeviceInfo.info().vkb;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('focusout', this._onFocusOut);
  }

  firstUpdated() {
    const selectedItem = this._getSelectedItem(this.value);
    this._selectedValueText = this._getValue(selectedItem);
  }

  willUpdate(_changedProperties) {
    super.willUpdate && super.willUpdate(_changedProperties);

    if (_changedProperties.has('_opened')) {
      this._setPopoverDialogWidth();
    }

    if (_changedProperties.has('value') || _changedProperties.has('items')) {
      if (!this._newItemStatus && this.items && this.items.length > 0) {
        const selectedItem = this._getSelectedItem(this.value);
        this._selectedValueText = this._getValue(selectedItem);
      }
    }

    if (_changedProperties.has('valueProvider') || _changedProperties.has('valueExpression')) {
      this._computeValueProvider();
    }

    if (_changedProperties.has('_query') || _changedProperties.has('_items')) {
      this._newItemRequest = undefined;
      if (this.allowNewValue && this._query && this._items?.length === 0) {
        this._findNewItem();
      } else {
        this._newItemStatus = undefined;
      }
    }
  }

  updated(_changedProperties) {
    if (_changedProperties.has('_opened') && !this._opened && this._dialogType === 'fit') {
      this.reportValidity();
    }
  }

  /**
   * Event handlers to be invoked when _items (filtered items) are changed in select-dialog.
   * It just copies this property on self; for it's own logic.
   */
  _onItemsChanged(e) {
    this._items = e.detail;
  }

  /**
   * Set dialog width if `dialogWidth` is provided.
   * Otherwise determine trigger element's width and set to dialog
   */
  _setPopoverDialogWidth() {
    if (this.dialogWidth) {
      this.style.setProperty('--dw-popover-width', this.dialogWidth + 'px');
      return;
    }

    // Trigger element getter
    let triggerEl = this.renderRoot.querySelector('dw-select-trigger');

    // Set Trigger element's offSetWidth to PopOver Dialog
    this.style.setProperty('--dw-popover-width', triggerEl.offsetWidth + 'px');
  }

  _setPopoverHeight() {
    const viewportHeight = window.innerHeight;
    const triggerRect = this._triggerElement.getBoundingClientRect();
    const isPlacementBottom = triggerRect.bottom <= viewportHeight / 2;
    let popoverMaxHeight = 0;

    if (isPlacementBottom) {
      this._dialogElement.popoverPlacement = 'bottom-start';
      popoverMaxHeight = viewportHeight - (triggerRect.bottom + 8);
    } else {
      this._dialogElement.popoverPlacement = 'top-start';
      this._dialogElement.popoverOffset = [0, 8];
      popoverMaxHeight = triggerRect.top - 16;
    }

    this._popoverMaxHeight = popoverMaxHeight;
    this.style.setProperty('--dw-popover-max-height', popoverMaxHeight + 'px');
  }

  /**
   * Trigger when actual user intract
   * @param {Event} e
   */
  _onUserInteraction(e) {
    if (e.type === 'input') {
      this._onInput(e);
    }
  }

  /**
   * Returns String that represents current value
   */
  _getValue(value) {
    var text;
    try {
      text = this.valueTextProvider(value);
    } catch (e) {
      text = '';
    }

    if (text) {
      return text;
    }

    if (typeof value === 'string') {
      return value;
    }

    return '';
  }

  _computeHelperText() {
    if (
      this.helperTextProvider &&
      typeof this.helperTextProvider === 'function' &&
      this.helperTextProvider(this._getSelectedItem(this.value))
    ) {
      return this.helperTextProvider(this._getSelectedItem(this.value));
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

  _onTrigger(e) {
    if (!this.readOnly) {
      this._opened = true;
    }
  }

  _onInput(e) {
    e.stopPropagation();
    this._query = this._triggerElement.value;
    this._selectedValueText = this._triggerElement.value;
    if (this._query && !this._opened) {
      this._opened = true;
    }
  }

  async _onSelect(e) {
    const value = this.value;
    const selectedItem = e.detail;
    this.value = this._valueProvider(selectedItem);
    this._selectedValueText = this._getValue(selectedItem);
    this._triggerElement.focus();
    this._query = undefined;
    await this.updateComplete;

    this.reportValidity();
    this._dispatchSelected(value);
  }

  _dispatchSelected(prevValue) {
    this.dispatchEvent(new CustomEvent('selected', { detail: this.value }));

    if (!this.valueEquator(prevValue, this.value)) {
      this.dispatchEvent(new CustomEvent('change'));
    }
  }

  _getSelectedItem(value) {
    const prependItem = this.prependItems.find(item => this.valueEquator(this._valueProvider(item), value));
    if (prependItem) {
      return prependItem;
    }

    const item = this.items && this.items.find(item => this.valueEquator(this._valueProvider(item), value));
    if (item !== undefined || !this._newItem) {
      return item;
    }

    //search in newItem
    return this.valueEquator(this._valueProvider(this._newItem), value);
  }

  _onInvalid(e) {
    this.validity = this._triggerElement.validity;
    this.dispatchEvent(new CustomEvent('invalid', { detail: this.validity }));
  }

  _onValid(e) {
    this.validity = this._triggerElement.validity;
    this.dispatchEvent(new CustomEvent('valid', { detail: this.validity }));
  }

  _onTipAction(e) {
    const action = e.detail;
    this.dispatchEvent(new CustomEvent('action', { detail: action }));
  }
  _onClearSelection() {
    const value = this.value;
    this.value = undefined;
    this._query = '';
    this._opened = false;
    this._dispatchSelected(value);
  }

  _onDialogOpenToggle() {
    this._opened = !this._opened;
  }

  _onDialogOpen(e) {
    e.stopPropagation();

    if (this._dialogElement && this._dialogElement.type !== 'popover') {
      this.dispatchEvent(new CustomEvent('dw-select-opened', { bubbles: true, composed: true, detail: e.detail }));
    }

    if (this._dialogElement && this._dialogElement.type === 'popover') {
      this._setPopoverHeight();
    }
  }

  _onDialogClose(e) {
    e.stopPropagation();

    const dialogType = this._dialogElement && this._dialogElement.type;
    if (dialogType && dialogType !== 'popover') {
      this.dispatchEvent(new CustomEvent('dw-select-closed', { bubbles: true, composed: true, detail: e.detail }));
    }

    this._opened = false;
  }

  _onKeydown(e) {
    const { ENTER, ARROW_DOWN, ARROW_UP } = KeyCode;
    const { keyCode } = e;
    if ([ENTER, ARROW_DOWN, ARROW_UP].includes(keyCode) && !this._opened) {
      if (!this._opened) e.stopPropagation();
      this._onTrigger(e);
    }
  }

  _onFocusOut() {
    //If select is searchable, clear selection and allow new value possible
    if (!(!this.searchable || this._vkb || this._layout === 'small')) {
      this._opened = false;
      this._clearSelection();
      this._allowNewValue();
    }
    this.reportValidity();
  }

  async _findNewItem() {
    //As it's debounced, it may be invoked after _items are reset to 0.
    //So, return if it's already reset to 0.
    if (this._items?.length > 0) {
      return;
    }

    const query = this._query;
    let result = this.newItemProvider(this._query);
    this._newItemRequest = result instanceof Promise ? result : Promise.resolve(result);
    this._newItemStatus = NEW_VALUE_STATUS.IN_PROGRESS;
    this._newItem = undefined;

    try {
      const item = await this._newItemRequest;
      // const {item, hint} = //TODO: Consider 'hint' too.

      //if query has been changed after the request was sent, do nothing.
      if (query !== this._query) {
        return;
      }

      this._newItem = item;
      //TODO: Show hint if available.
      this._newItemStatus = item !== undefined ? NEW_VALUE_STATUS.NEW_VALUE : undefined;
    } catch (error) {
      this._newItemStatus = NEW_VALUE_STATUS.ERROR;
    } finally {
      this._newItemRequest = undefined;
    }
  }

  _resetToCurValue() {
    this._query = '';
    const selectedItem = this._getSelectedItem(this.value);
    if (selectedItem) {
      this._selectedValueText = this._getValue(selectedItem);
    } else {
      this._selectedValueText = '';
    }
  }

  _computeValueProvider() {
    if (!this.valueProvider && !this.valueExpression) {
      this._valueProvider = item => item;
      return;
    }

    if (this.valueExpression) {
      this._valueProvider = item => item[this.valueExpression];
      return;
    }

    this._valueProvider = this.valueProvider;
  }

  validate() {
    return this.reportValidity();
  }

  checkValidity() {
    return this._triggerElement && this._triggerElement.checkValidity();
  }

  reportValidity() {
    return this._triggerElement && this._triggerElement.reportValidity();
  }

  focus() {
    this._triggerElement && this._triggerElement.focus();
  }

  _clearSelection() {
    //TODO: If query is NOT dirty, nothing is to be done.

    // if (this._query == this._selectedValueText) {
    //   return;
    // }

    if (!this._query && !this._selectedValueText) {
      //clear selection & dispatch event.
      const prevValue = this.value;
      this.value = null;
      if (prevValue !== this.value) {
        this._dispatchSelected(prevValue);
        this.dispatchEvent(new CustomEvent('clear-selection'));
      }
      return;
    }
  }

  _allowNewValue() {
    if (!this.allowNewValue) {
      this._resetToCurValue();
      return;
    }

    //Allow New Value - START

    window.setTimeout(async () => {
      await (this._newItemRequest || this._findNewItem());
      if (!this._newItemStatus) {
        this._resetToCurValue();
        return;
      }

      if (this._newItemStatus === NEW_VALUE_STATUS.NEW_VALUE) {
        //Change value & dispatch event
        const value = this._value;
        this.value = this._newItem;
        this._dispatchSelected(value);
        return;
      }

      if (this._newItemStatus === NEW_VALUE_STATUS.ERROR) {
        const query = this._query;
        this.value = null;

        //Restore query after timeout; as on setting value, it might be resetted too.
        window.setTimeout(() => {
          this._selectedValueText = query;
        });
      }
    });
    //Allow New Value - END
  }
}

if (isElementAlreadyRegistered('dw-select')) {
  console.warn("lit: 'dw-select' is already registered, so registration skipped.");
} else {
  customElements.define('dw-select', DwSelect);
}
