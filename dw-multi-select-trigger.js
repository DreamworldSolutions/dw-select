import { css, html, nothing, unsafeCSS } from '@dreamworld/pwa-helpers/lit.js';

// view Elements
import { DwInput } from '@dreamworld/dw-input/dw-input.js';
import '@dreamworld/dw-ripple';
import '@dreamworld/dw-tooltip';
import '@material/mwc-circular-progress';

// Styles
import * as TypographyLiterals from '@dreamworld/material-styles/typography-literals.js';

/**
 * Used to edit and enter text, or only readOnly.
 *
 * [`select-dialog-doc`](docs/select-trigger.md)
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

        :host([readOnly]) {
          --dw-input-outlined-readonly-idle-border-color: transparent;
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
       * Whether or not to show the temprory select dialog.
       * Default false
       */
      opened: { type: Boolean, reflect: true },

      /**
       * When true user isn’t allowed to type anything.
       * Default "false"
       */
      inputAllowed: { type: Boolean, reflect: true },

      /**
       * Input Property
       * Whether error message shows in tooltip or not.
       * Default erro shows at hint text
       */
      errorInTooltip: { type: Boolean },

      /**
       * Whether component is focused or not
       */
      _focused: { type: Boolean, reflect: true, attribute: 'focused' },

      /**
       *
       */
      autoComplete: { type: Boolean },

      suffixTemplate: { type: Object },
    };
  }

  constructor() {
    super();
    this.opened = false;
    this.iconTrailing = 'expand_more';
    this.errorInTooltip = false;
  }

  connectedCallback() {
    super.connectedCallback();

    this.addEventListener('focusin', this._onFocusIn);
    this.addEventListener('focusout', this._onFocusOut);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.removeEventListener('focusin', this._onFocusIn);
    this.removeEventListener('focusout', this._onFocusOut);
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

    if (this.type === 'password' && this._showVisibilityIcon) {
      const icon = this._type === 'text' ? 'visibility' : 'visibility_off';
      return html`
        <dw-icon-button
          @click=${this._toggleType}
          class="mdc-text-field__icon"
          icon="${icon}"
          .iconSize=${this.iconSize}
          tabindex=""
          .iconFont="${this.iconFont}"
          .symbol=${this.symbol}
        ></dw-icon-button>
      `;
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
        tabindex=${this.readOnly ? -1 : 0}
        max=${this.maxNumber}
        min=${this.minNumber}
        id="tf-outlined"
        class="mdc-text-field__input"
        .name="${this.name}"
        ?disabled="${this.disabled}"
        ?required="${this.required}"
        ?readonly="${this.readOnly}"
        .pattern="${this.pattern}"
        .placeholder="${this.placeholder}"
        minlength=${this.minLength}
        .maxLength="${this.maxLength}"
        ?charCounter="${this.charCounter}"
        autocomplete="off"
        @keypress="${this._preventInvalidInput}"
        @keydown="${this._onKeyDown}"
        @focus="${this._onFocus}"
      />
    `;
  }

  renderIcon(icon, isTrailingIcon = false) {
    if (this.autoComplete) return;
    return html` ${this._renderExpandLessMoreButton} `;
  }

  get _renderExpandLessMoreButton() {
    if (this.readOnly) {
      return nothing;
    }

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

  _onExpandClick(e) {
    e.stopPropagation();
    e.preventDefault();
    this.dispatchEvent(new CustomEvent('expand-toggle'));
  }

  _onFocusIn() {
    this._focused = true;
  }

  _onFocusOut() {
    this._focused = false;
  }

  _onClose(e) {
    e.stopPropagation();
    this.dispatchEvent(new Event('clear-selection'));
  }
}

customElements.define('dw-multi-select-trigger', DwMultiSelectTrigger);
