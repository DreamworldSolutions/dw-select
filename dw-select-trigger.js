import { LitElement, html, css } from "lit";

// view Elements
import { TextField } from "@material/mwc-textfield";
import "@dreamworld/dw-ripple";

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
      `,
    ];
  }

  static get properties() {
    return {
      /**
       * The input control's value.
       * Text to be shown as the value.
       * It’s output property also when readOnly=false.
       */
      // value: { type: String },

      /**
       * Sets floating label value.
       */
      // label: { type: String },

      /**
       * Sets disappearing input placeholder.
       */
      // placeholder: { type: String },

      /**
       * Helper text to display below the input.
       * Display default only when focused.
       */
      // helper: { type: String },

      /**
       * Whether or not to show the material outlined variant.
       */
      // outlined: { type: Boolean },

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
       * Whether or not to show the read-only variant.
       */
      // readOnly: { type: Boolean },

      /**
       * When true user isn’t allowed to type anything.
       * Default "false"
       */
      inputAllowed: { type: Boolean },

      /**
       * Displays error state if value is empty and input is blurred.
       */
      // required: { type: Boolean },

      /**
       * Whether or not to show the `disabled` variant.
       */
      // disabled: { type: Boolean },

      /**
       * When true, helper text isn’t visible. Instead `errorMesage` is shown.
       */
      error: { type: Boolean },

      /**
       * Message to show in the error color at helper text when the textfield is invalid.
       */
      errorMessage: { type: String },
    };
  }

  constructor() {
    super();
    this.opened = false;
    this.updatedHighlight = false;
    this.inputAllowed = false;
    this.iconTrailing = "expand_less";
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
      this.validationMessage = this.errorMessage;
    }
  }
}

customElements.define("dw-select-trigger", DwSelectTrigger);
