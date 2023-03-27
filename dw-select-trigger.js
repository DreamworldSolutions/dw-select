import { css, html, nothing, unsafeCSS } from "@dreamworld/pwa-helpers/lit.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { live } from "lit/directives/live.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

// view Elements
import "@dreamworld/dw-ripple";
import "@dreamworld/dw-tooltip";
import "@material/mwc-circular-progress";
import { TextField } from "@material/mwc-textfield";

// Utils
import { NEW_VALUE_STATUS } from "./utils";

// Styles
import * as TypographyLiterals from "@dreamworld/material-styles/typography-literals.js";

/**
 * Used to edit and enter text, or only readOnly.
 *
 * [`select-dialog-doc`](docs/select-trigger.md)
 */

export class DwSelectTrigger extends TextField {
  static get styles() {
    return [
      TextField.styles,
      css`
        :host {
          display: block;
        }

        :host([updatedHighlight]:not([outlined])) {
          --mdc-text-field-fill-color: var(
            --dw-select-updated-highlight-bg-color,
            rgba(2, 175, 205, 0.04)
          );
        }

        :host([dense]) .mdc-text-field--outlined {
          height: var(--dw-select-trigger-height, 48px);
        }

        :host([dense]) .mdc-text-field .mdc-floating-label--float-above {
          top: var(--dw-select-focused-label-top, 60%);
        }

        .mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__icon--trailing {
          color: var(--dw-icon-color, rgba(0, 0, 0, 0.54));
        }

        .mdc-text-field--outlined {
          align-items: center;
        }

        dw-icon-button {
          --dw-icon-color: var(--mdc-theme-text-secondary-on-background, rgba(0, 0, 0, 0.6));
        }

        #error {
          --dw-icon-color: var(--mdc-theme-error, #b00020);
        }

        .new-tag {
          background-color: #259b24;
          color: #ffffff;
          display: inline-flex;
          ${unsafeCSS(TypographyLiterals.caption)};
          padding: 0px 8px;
          border-radius: 4px;
          box-sizing: border-box;
          align-items: center;
          height: 20px;
          margin: 12px 14px;
          text-transform: capitalize;
        }

        mwc-circular-progress {
          padding: 4px;
        }
      `,
    ];
  }

  static get properties() {
    return {
      /**
       * Input Property. When true, shows updated highlights
       * Default "false"
       */
      updatedHighlight: { type: Boolean, reflect: true },

      /**
       * Whether or not to show the temprory select dialog.
       * Default false
       */
      opened: { type: Boolean },

      /**
       * When true user isn’t allowed to type anything.
       * Default "false"
       */
      inputAllowed: { type: Boolean },

      /**
       * When true, helper text isn’t visible. Instead `errorMesage` is shown.
       */
      error: { type: Boolean },

      /**
       * Message to show in the error color at helper text when the textfield is invalid.
       */
      errorMessage: { type: String },

      /**
       * Input Property
       * Whether error message shows in tooltip or not.
       * Default erro shows at hint text
       */
      errorInTooltip: { type: Boolean },

      newValueStatus: { type: String },

      dense: {
        type: Boolean,
        reflect: true,
        attribute: "dense"
      },
    };
  }

  constructor() {
    super();
    this.opened = false;
    this.updatedHighlight = false;
    this.inputAllowed = false;
    this.iconTrailing = "expand_less";
    this.errorInTooltip = false;
  }

  renderTrailingIcon() {
    return this.iconTrailing ? this.renderIcon(this.iconTrailing, true) : nothing;
  }

  // Override renderInput to disable autocomplete for input
  /** @soyTemplate */
  renderInput(shouldRenderHelperText) {
    const minOrUndef = this.minLength === -1 ? undefined : this.minLength;
    const maxOrUndef = this.maxLength === -1 ? undefined : this.maxLength;
    const autocapitalizeOrUndef = this.autocapitalize ? this.autocapitalize : undefined;
    const showValidationMessage = this.validationMessage && !this.isUiValid;
    const ariaLabelledbyOrUndef = !!this.label ? "label" : undefined;
    const ariaControlsOrUndef = shouldRenderHelperText ? "helper-text" : undefined;
    const ariaDescribedbyOrUndef =
      this.focused || this.helperPersistent || showValidationMessage ? "helper-text" : undefined;
    // TODO: live() directive needs casting for lit-analyzer
    // https://github.com/runem/lit-analyzer/pull/91/files
    // TODO: lit-analyzer labels min/max as (number|string) instead of string
    return html` <input
      aria-labelledby=${ifDefined(ariaLabelledbyOrUndef)}
      aria-controls="${ifDefined(ariaControlsOrUndef)}"
      aria-describedby="${ifDefined(ariaDescribedbyOrUndef)}"
      class="mdc-text-field__input"
      type="${this.type}"
      .value="${live(this.value)}"
      ?disabled="${this.disabled}"
      placeholder="${this.placeholder}"
      ?required="${this.required}"
      ?readonly="${this.readOnly}"
      minlength="${ifDefined(minOrUndef)}"
      maxlength="${ifDefined(maxOrUndef)}"
      pattern="${ifDefined(this.pattern ? this.pattern : undefined)}"
      min="${ifDefined(this.min === "" ? undefined : this.min)}"
      max="${ifDefined(this.max === "" ? undefined : this.max)}"
      step="${ifDefined(this.step === null ? undefined : this.step)}"
      size="${ifDefined(this.size === null ? undefined : this.size)}"
      name="${ifDefined(this.name === "" ? undefined : this.name)}"
      inputmode="${ifDefined(this.inputMode)}"
      autocapitalize="${ifDefined(autocapitalizeOrUndef)}"
      autocomplete="off"
      @input="${this.handleInputChange}"
      @focus="${this.onInputFocus}"
      @blur="${this.onInputBlur}"
    />`;
  }

  /** @soyTemplate */
  renderIcon(icon, isTrailingIcon = false) {
    if (this.newValueStatus) {
      return this._renderNewValueTrailingIcon;
    }
    if (this.errorInTooltip && this.errorMessage && !this.isUiValid) {
      return html`
        <dw-icon-button id="error" icon="error" tabindex="-1"></dw-icon-button>
        <dw-tooltip for="error">${unsafeHTML(this.errorMessage)}</dw-tooltip>
      `;
    }
    return html` ${this._renderExpandLessMoreButton} `;
  }

  get _renderExpandLessMoreButton() {
    return html`
      <dw-icon-button
        icon="${this.iconTrailing}"
        @click=${this._onExpandClick}
        tabindex="-1"
      ></dw-icon-button>
    `;
  }

  get _renderNewValueTrailingIcon() {
    if (this.newValueStatus === NEW_VALUE_STATUS.IN_PROGRESS) {
      return html`<mwc-circular-progress indeterminate density="-2"></mwc-circular-progress>`;
    }

    if (this.newValueStatus === NEW_VALUE_STATUS.NEW_VALUE) {
      return html`<div class="new-tag">new</div>`;
    }
    return nothing;
  }

  _onExpandClick(e) {
    e.stopPropagation();
    e.preventDefault();
    this.focus();
    this.dispatchEvent(new CustomEvent("expand-toggle"));
  }

  willUpdate(_changedProperties) {
    super.willUpdate(_changedProperties);

    if (_changedProperties.has("opened")) {
      this.iconTrailing = this.opened ? "expand_less" : "expand_more";
    }

    if (_changedProperties.has("inputAllowed")) {
      this.readOnly = !this.inputAllowed;
    }

    if (_changedProperties.has("errorMessage")) {
      if (!this.errorInTooltip) {
        this.validationMessage = this.errorMessage;
      }
    }
  }

  updated(_changedProperties) {
    super.updated(_changedProperties);

    if (_changedProperties.has("value")) {
      this.error = this.value ? !this.reportValidity() : !this.checkValidity();

      if (!this.error) {
        this.dispatchEvent(new CustomEvent("valid"));
      }
    }
  }
}

customElements.define("dw-select-trigger", DwSelectTrigger);
