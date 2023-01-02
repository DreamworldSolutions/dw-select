import { css, html, nothing, unsafeCSS } from "@dreamworld/pwa-helpers/lit.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

// view Elements
import { TextField } from "@material/mwc-textfield";
import "@dreamworld/dw-ripple";
import "@dreamworld/dw-tooltip";
import "@material/mwc-circular-progress";

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
       * Whether clear selection button is availbale or not
       * default false
       */
      showClearSelection: { type: Boolean },

      /**
       * Input Property
       * Whether error message shows in tooltip or not.
       * Default erro shows at hint text
       */
      errorInTooltip: { type: Boolean },

      newValueStatus: { type: String },
    };
  }

  constructor() {
    super();
    this.opened = false;
    this.updatedHighlight = false;
    this.inputAllowed = false;
    this.iconTrailing = "expand_less";
    this.showClearSelection = false;
    this.errorInTooltip = false;
  }

  renderTrailingIcon() {
    return this.iconTrailing ? this.renderIcon(this.iconTrailing, true) : nothing;
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
    return html` ${this._renderClearButton} ${this._renderExpandLessMoreButton} `;
  }

  get _renderClearButton() {
    if (this.value && this.focused && this.showClearSelection) {
      return html`<dw-icon-button
        icon="close"
        @click=${this._onClearClick}
        tabindex="-1"
      ></dw-icon-button>`;
    }

    return nothing;
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

  _onClearClick(e) {
    e.stopPropagation();
    e.preventDefault();
    this.value = "";
    this.dispatchEvent(new CustomEvent("clear"));
  }

  _onExpandClick(e) {
    e.stopPropagation();
    e.preventDefault();
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
      this.error = !this.checkValidity();

      if (!this.error) {
        this.dispatchEvent(new CustomEvent("valid"));
      }
    }
  }

  onInputBlur() {
    setTimeout(() => {
      this.focused = false;
      this.reportValidity();
    }, 100);
  }
}

customElements.define("dw-select-trigger", DwSelectTrigger);
