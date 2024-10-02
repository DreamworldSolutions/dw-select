import { css, html, nothing } from '@dreamworld/pwa-helpers/lit.js';

// view Elements
import { DwInput } from '@dreamworld/dw-input/dw-input.js';
import '@dreamworld/dw-ripple';
import '@dreamworld/dw-tooltip';
import '@material/mwc-circular-progress';

/**
 * @behaviors
 * - Its extended from `dw-input`
 * - It shows selected items label. It does not allow to type anything.
 * - It has a trailing icon that can be clicked to toggle the expansion of the select dialog.
 *
 * @event expand-toggle Dispatches on click of trailing icon.
 */

export class DwMultiSelectTrigger extends DwInput {
  static get styles() {
    return [
      DwInput.styles,
      css`
        :host {
          display: block;
        }

        :host([opened]) {
          --dw-input-outlined-idle-border-color: var(--mdc-theme-primary);
          --dw-input-border-width: 2px;
        }

        .mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__icon--trailing {
          color: var(--dw-icon-color, rgba(0, 0, 0, 0.54));
        }

        .mdc-text-field__icon[tabindex='-1'] {
          pointer-events: unset;
        }

        .up-down-arrow {
          transition: 0.2s ease-in-out;
        }

        .mdc-text-field--with-trailing-icon .mdc-text-field__icon {
          position: unset;
          margin-right: 12px;
          align-self: center;
        }

        :host([opened]) .up-down-arrow {
          rotate: 180deg;
        }

        dw-icon-button {
          --dw-icon-color: var(--mdc-theme-text-secondary-on-background, rgba(0, 0, 0, 0.6));
        }

        #error {
          --dw-icon-color: var(--mdc-theme-error, #b00020);
        }

        mwc-circular-progress {
          padding: 4px;
        }

        .mdc-text-field--with-trailing-icon.mdc-text-field--outlined .mdc-text-field__input {
          padding-right: 12px;
        }

        input {
          pointer-events: none;
        }
      `,
    ];
  }

  static get properties() {
    return {
      /**
       * `true` when dialog is opened.
       * Default false
       */
      opened: { type: Boolean, reflect: true },

      /**
       * A template for the suffix of the input field. This can be used to display additional content, such as an icon or text, after the input field.
       */
      suffixTemplate: { type: Object },
    };
  }

  constructor() {
    super();
    this.opened = false;
    this.iconTrailing = 'expand_more';
  }

  /**
   * Returns suffix template based on `iconTrailing` and `suffixText` property
   */
  get _getSuffixTemplate() {
    return html`
      ${this.invalid || this._warning || this.hint
        ? html`<span @mousedown=${e => e.stopPropagation()}>${this._tipIconButtons}</span>`
        : nothing}
      ${this._suffixTemplate} ${this.renderIcon(this.iconTrailing, true)}
    `;
  }

  get _suffixTemplate() {
    if (this.suffixTemplate) {
      return this.suffixTemplate;
    }

    if (this.suffixText) {
      return html` <span class="suffix-text">${this.suffixText}</span> `;
    }

    return nothing;
  }

  get inputTemplate() {
    return html`
      <input
        .type="${this._type || this.type}"
        max=${this.maxNumber}
        min=${this.minNumber}
        id="tf-outlined"
        class="mdc-text-field__input"
        .name="${this.name}"
        ?disabled="${this.disabled}"
        ?required="${this.required}"
        .pattern="${this.pattern}"
        .placeholder="${this.placeholder}"
        minlength=${this.minLength}
        .maxLength="${this.maxLength}"
        ?charCounter="${this.charCounter}"
        @keypress="${this._preventInvalidInput}"
        @keydown="${this._onKeyDown}"
        @focus="${this._onFocus}"
      />
    `;
  }

  renderIcon(icon, isTrailingIcon = false) {
    return html` ${this._renderExpandLessMoreButton} `;
  }

  get _renderExpandLessMoreButton() {
    return html`
      <dw-icon-button
        class="mdc-text-field__icon up-down-arrow"
        icon="${this.iconTrailing}"
        .iconSize=${this.iconSize}
        .buttonSize=${this.iconButtonSize}
        ?disabled="${this.disabled}"
        tabindex="-1"
        @mousedown=${this._onExpandClick}
        @click="${e => e.stopPropagation()}"
      ></dw-icon-button>
    `;
  }

  /**
   * on icon click close and open dialog
   */
  _onExpandClick(e) {
    e.stopPropagation();
    e.preventDefault();
    this.dispatchEvent(new CustomEvent('expand-toggle'));
  }
}

customElements.define('dw-multi-select-trigger', DwMultiSelectTrigger);
