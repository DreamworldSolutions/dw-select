import { css, html, LitElement, nothing } from '@dreamworld/pwa-helpers/lit.js';
import DeviceInfo from '@dreamworld/device-info';

// View Elements
import { DwFormElement } from '@dreamworld/dw-form/dw-form-element.js';
import './dw-multi-select-base-dialog.js';
import './dw-multi-select-trigger.js';
import '@dreamworld/dw-tooltip';
import '@dreamworld/dw-icon-button';
import '@dreamworld/dw-icon';

// Lodash Methods
import { find, isEqual, isEmpty } from 'lodash-es';

// Utils
import { filter, KeyCode } from './utils.js';

/**
 *
 * @summary A Select is an input widget with an associated dropdown that allows users to select a value from a list of possible values.
 *          It is used to select multiple items from a list of options.
 *
 * @behaviors
 * ### Opening and Closing the Dropdown
 * - It opens dropdown on click of the trigger or on down / enter key press.
 * - It closes dropdown on outside click, Esc key press or on click of Done button.
 *
 * ### Searchable
 *  - when `searchable=true` shows search-input in dialog.
 *  - Filter out list based on the search string.
 *  - On query reset, it shows selected items on top of the list.
 *  - It is used when more than 10 items are present in the list.
 *
 * ## Rendering
 *  - Renders `dw-multi-select-trigger` and `dw-multi-select-dialog`
 *  - When `opened=true` drop-down dialog is opened
 *
 * ### Select All
 *  - Available when more than 10 items are present in the list.
 *  - when searchable=true, it shows Select  All option in the dialog.
 *  - On Select All click, selects all visible items in the dialog.
 *
 * ### list-item
 *  - when checked, it shows check-box on the left side of item.
 *  - when item has leading icon, it shows check-box on the right side of item.
 *
 * ### Keyboard accessibility
 *  - Opens / closes dialog on Down / Escape press.
 *  - Navigates in list on Up / Down arrow keys.
 *  - Select item on space-bar key press
 *  - Query can be reset on Esc key press. on 2nd Escape press, it closes dialog.
 *
 * ### Toggle icon
 *  - The DwMultiSelect component provides a toggle icon that can be used to open and close the dropdown.
 */

export class DwMultiSelect extends DwFormElement(LitElement) {
  static get properties() {
    return {
      /**
       * Sets the `name` attribute on the internal input.
       * The name property should only be used for browser autofill as web-component form participation
       * does not currently consider the `name` attribute.
       */
      name: { type: String },

      /**
       * List of selected item's value
       */
      value: { type: Array },

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
       * A Custom Error Message to be shown.
       * It could be `String` or `Function`.
       */
      error: { type: Object },

      /**
       * Message to show in the error color.
       */
      errorMessages: { type: Object },

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
      groupSelector: { type: Object },

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
       * A function `(item) -> value` to identify value of any item.
       */
      valueProvider: { type: Object },

      /**
       * An expression (dot-separated properties) to be applied on Item, to find it's value.
       * When `valueProvider` is specified, this is ignored. When `valueProvider` isn't specified
       * and this is specified, `valueProvider` is built using this.
       * default: _id
       */
      valueExpression: { type: String },

      /**
       * Function: Computed property from valueProvider and valueExpression
       */
      _valueProvider: { type: Object },

      /**
       * A Function `(item) -> text` to find the Text to be shown (in input), corresponding to the
       * current `value`.
       * default: `(item) -> item`.
       */
      valueTextProvider: { type: Object },

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
      valueEquator: { type: Object },

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

      /**
       * Name of trailing Icon which available in selected item.
       */
      selectedTrailingIcon: { type: String },

      /**
       * Messages of for noRecords and noMatching
       * Example: {noRecords: "", noMatching: "", loading: ""}
       */
      messages: { type: Object },

      /**
       * Input Property
       * A function to customize search.
       * function has two parameters
       *  - item
       *  - query
       *
       * returns always boolean
       */
      queryFilter: { type: Object },

      /**
       * Whether dialog is opened or not.
       */
      _opened: { type: Boolean, reflect: true, attribute: 'opened' },

      /**
       * Input property. Default value is `true`.
       * When `false`, doesn't highlight matched words.
       */
      highlightQuery: { type: Boolean },

      /**
       * Contains text that presents on input text field
       * Computed property on `@_value-change` event
       */
      _selectedValueText: { type: String },

      /**
       * Text to show the warning message.
       */
      warning: { type: String },

      /**
       * Whether the trigger element is dense or not
       */
      dense: { type: Boolean },

      /**
       * Represents current layout in String. Possible values: `small`, `medium`, `large`, `hd`, and `fullhd`.
       */
      _layout: { type: String },

      popover: { type: Boolean },

      /**
       * Input property.
       * External styles to be applied on popover dialog
       */
      popoverStyles: { type: Object },

      hasItemLeadingIcon: { type: Boolean },
    };
  }

  /**
   * Trigger Element Getter
   */
  get _triggerElement() {
    if (this._isSlotTemplateAvailable) {
      return this.querySelector('#selectTrigger');
    }

    return this.renderRoot.querySelector('#selectTrigger');
  }

  get _dialogElement() {
    return this.renderRoot.querySelector('#selectDialog');
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          --dw-popover-min-width: 0px;
          --dw-select-highlight-bg-color: #fde293;
          -webkit-tap-highlight-color: transparent;
        }

        #selectTrigger {
          cursor: pointer;
        }
      `,
    ];
  }

  constructor() {
    super();
    this.searchable = false;
    this.highlightQuery = true;
    this.label = '';
    this.heading = '';
    this.placeholder = '';
    this.showClose = false;
    this.valueTextProvider = () => {};
    this.groupSelector = () => {};
    this._valueProvider = item => item;
    this.valueEquator = (v1, v2) => v1 === v2;
    this.queryFilter = (item, query) => filter(this._itemLabelProvider(item), query);
    this.hasItemLeadingIcon = false;
  }

  render() {
    return html` ${this._triggerTemplate} ${this._opened ? this._dialogTemplate : nothing} `;
  }

  get _triggerTemplate() {
    return html`
      <div @click="${this._onTrigger}"><slot name="trigger-template"></slot></div>
      ${!this._isSlotTemplateAvailable
        ? html` <dw-multi-select-trigger
            id="selectTrigger"
            .name="${this.name}"
            .label="${this.label}"
            .placeholder="${this.placeholder}"
            .value=${this._selectedValueText}
            ?outlined=${this.outlined}
            ?disabled=${this.disabled}
            ?autoValidate=${this.autoValidate}
            .error=${this.error}
            .errorMessages="${this.errorMessages}"
            .warning="${this.warning}"
            .dense=${this.dense}
            .suffixTemplate=${this._inputSuffixTemplate}
            @mousedown=${this._onTrigger}
            @keydown=${this._onKeydown}
            @expand-toggle="${this._onDialogOpenToggle}"
            ?opened="${this._opened}"
          ></dw-multi-select-trigger>`
        : nothing}
    `;
  }

  get _dialogTemplate() {
    return html`<dw-multi-select-base-dialog
      id="selectDialog"
      .opened=${this._opened}
      .type=${this._dialogType}
      .placement=${this._dialogPlacement}
      .triggerElement=${this._triggerElement}
      .value=${this.value}
      .appendTo=${this.renderRoot}
      .items="${this.items}"
      .layout=${this._layout}
      .valueProvider=${this._valueProvider}
      .valueExpression=${this.valueExpression}
      .valueEquator=${this.valueEquator}
      .groups=${this.groups}
      .groupSelector=${this.groupSelector}
      .groupExpression=${this.groupExpression}
      .queryFilter=${this.queryFilter}
      .highlightQuery=${this.highlightQuery}
      ?vkb=${this._vkb}
      ?searchable=${this.searchable}
      .renderItem=${this.renderItem}
      .renderGroupItem=${this.renderGroupItem}
      .heading=${this.heading}
      .error=${this.error}
      .errorMessages="${this.errorMessages}"
      ?showClose=${this.showClose}
      .hasItemLeadingIcon=${this.hasItemLeadingIcon}
      .selectedTrailingIcon="${this.selectedTrailingIcon}"
      .dialogHeaderTemplate="${this._headerTemplate}"
      .dialogContentTemplate="${this._contentTemplate}"
      .dialogFooterTemplate=${this._footerTemplate}
      .inputSuffixTemplate=${this._inputSuffixTemplate}
      .popoverStyles=${this._popoverStyles}
      @apply=${e => this._onApply(e)}
      @_value-change=${e => this._setValueText(e)}
      @dw-dialog-opened="${e => this._onDialogOpen(e)}"
      @dw-fit-dialog-opened="${e => this._onDialogOpen(e)}"
      @dw-dialog-closed="${e => this._onDialogClose(e)}"
      @dw-fit-dialog-closed="${e => this._onDialogClose(e)}"
      .messages="${this.messages}"
      .itemLabelProvider=${this._itemLabelProvider}
    ></dw-multi-select-base-dialog>`;
  }

  get _isSlotTemplateAvailable() {
    return !!this.querySelector('[slot="trigger-template"]');
  }

  /**
   * Header Template getter
   */
  get _headerTemplate() {
    return nothing;
  }

  /**
   * content Template getter
   */
  get _contentTemplate() {
    return nothing;
  }

  get _inputSuffixTemplate() {
    return nothing;
  }

  /**
   * Footer Template getter
   * Used when this element is used by `Extension` To override this method
   */
  get _footerTemplate() {
    return nothing;
  }

  get _dialogType() {
    if (this._layout === 'small' && this.searchable) return 'fit';

    if ((this._layout === 'small' && !this.popover) || (this.searchable && (this._layout === 'medium' || this._layout === 'large')))
      return 'modal';

    return 'popover';
  }

  get _dialogPlacement() {
    if (this._layout === 'small' && !this.searchable) return 'bottom';

    return 'center';
  }

  get _popoverStyles() {
    return this.popoverStyles;
  }

  connectedCallback() {
    super.connectedCallback();
    this._computeValueProvider();

    this._layout = DeviceInfo.info().layout;
    this._vkb = DeviceInfo.info().vkb;
  }

  firstUpdated(props) {
    super.firstUpdated(props);
    this._setValueText();
  }

  willUpdate(props) {
    super.willUpdate(props);

    if (props.has('value') || props.has('items')) {
      this._setValueText();
    }

    if (props.has('valueProvider') || props.has('valueExpression')) {
      this._computeValueProvider();
    }
  }

  updated(props) {
    super.updated(props);
    if (props.has('_opened')) {
      if (!this._opened) {
        this.reportValidity();
      }

      if(this._opened) {
        this._setPopoverDialogWidth();
      }
    }
  }

  /** set Trigger element value on value change
   * @param { Array } e
   * @returns { String }
   */
  _setValueText(e) {
    if (!this.items) return;
    
    const value = e ? e.detail : this.value || [];
    if (isEmpty(value)) {
      this._selectedValueText = '';
      return;
    }
    
    if (value.length === this.items?.length) {
      this._selectedValueText = this.messages?.all || 'All';
      return;
    }
    
    const firstSelectedItem = this._getSelectedItem(value[0] || value[1]);
    const text = this.valueTextProvider(firstSelectedItem);
    this._selectedValueText = !text ? '' : `${text} ${value.length > 1 ? `(+${value.length - 1} other)` : ''}`;
    return;
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

    // Set Trigger element's offSetWidth to PopOver Dialog
    if (this._triggerElement) {
      this.style.setProperty('--dw-popover-width', this._triggerElement.offsetWidth + 'px');
    }
  }

  /**
   * Compute label of the item
   * @param {Object | String} item
   * @returns {String} returns string that actually represents in list item
   */
  _itemLabelProvider(item) {
    if (!this.valueTextProvider(item)) {
      return item;
    }
    return this.valueTextProvider(item);
  }

  _onTrigger() {
    this._opened = true;
  }

  /**
   * This method is called when the value of the component changes.
   * It updates the component's internal state and dispatches a change event.
   */
  _onApply(e) {
    if (isEqual(this.value, e.detail)) return;

    this.dispatchEvent(new CustomEvent('change', { detail: e.detail }));
    this.value = e.detail;
  }

  /**
   * This method returns the item that matches the given value.
   * @param (String) value
   * @returns {Object}
   */
  _getSelectedItem(selectedValue) {
    const item = find(this.items, item => {
      return this.valueEquator(this._valueProvider(item), selectedValue);
    });

    if (item !== undefined) {
      return item;
    }
  }

  _onDialogOpenToggle() {
    this._opened = !this._opened;
  }

  _onDialogOpen(e) {
    e.stopPropagation();

    if (this._dialogElement) {
      this.dispatchEvent(
        new CustomEvent('dw-multi-select-opened', {
          bubbles: true,
          composed: true,
          detail: { ...e.detail, dialogType: this._dialogElement.type },
        })
      );
    }
  }

  _onDialogClose(e) {
    e.stopPropagation();
    this._setValueText();
    if (!this._vkb) {
      this._triggerElement?.focus();
    }
    if (this._dialogElement) {
      this.dispatchEvent(
        new CustomEvent('dw-multi-select-closed', {
          bubbles: true,
          composed: true,
          detail: { ...e.detail, dialogType: this._dialogElement.type },
        })
      );
    }

    this._opened = false;
  }

  /**
   * Handles keydown events
   */
  _onKeydown(e) {
    const { ENTER, ARROW_DOWN, ARROW_UP, TAB, SHIFT } = KeyCode;
    const { keyCode, metaKey, ctrlKey } = e;

    if (ctrlKey || metaKey) return;

    if ([ENTER, ARROW_DOWN, ARROW_UP].includes(keyCode) && !this._opened) {
      e.stopPropagation();
      this._onTrigger(e);
      return;
    }

    if (![TAB, SHIFT].includes(keyCode)) {
      e.preventDefault();
    }
  }

  _computeValueProvider() {
    if (!this.valueProvider && !this.valueExpression) {
      this._valueProvider = item => item;
      return;
    }

    if (this.valueExpression) {
      this._valueProvider = item => item && item[this.valueExpression];

      return;
    }

    this._valueProvider = this.valueProvider;
  }

  /**
   *
   * Returns true if the element's value is valid, and false otherwise.
   */
  checkValidity() {
    if (this._triggerElement && this._triggerElement.checkValidity && typeof this._triggerElement.checkValidity === 'function') {
      return this._triggerElement.checkValidity();
    }
    return true;
  }

  /**
   * @returns {Boolean}
   * Returns true if the element's value is valid, and false otherwise. If the element is invalid, it also fires an invalid event.
   */
  reportValidity() {
    if (this._triggerElement && this._triggerElement.reportValidity && typeof this._triggerElement.reportValidity === 'function') {
      return this._triggerElement.reportValidity();
    }
    return true;
  }
}

customElements.define('dw-multi-select', DwMultiSelect);
