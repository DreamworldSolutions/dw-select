import { LitElement, html, css } from "lit";

/**
 * Used to edit and enter text, or only readOnnly.
 *
 * [`select-dialog-doc`](docs/select-trigger.md)
 */

export class DwSelectTrigger extends LitElement {
  static properties = {
    /**
     * The input control's value.
     * Text to be shown as the value.
     * It’s output property also when readOnly=false.
     */
    value: { type: String },

    /**
     * Sets floating label value.
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
     * Whether or not to show the material outlined variant.
     */
    outlined: { type: Boolean },

    /**
     * Input Property. When true, shows updated highlights
     */
    updatedHighlight: { type: Boolean },

    /**
     * Whether or not to show the temprory select dialog.
     */
    opened: { type: Boolean },

    /**
     * Whether or not to show the read-only variant.
     */
    readOnly: { type: Boolean },

    /**
     * When true user isn’t allowed to type anything.
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
  };

  render() {
    return html` <input type="text" @input=${this._onInput} value=${this.value} /> `;
  }

  _onInput(e) {
    this.value = e.target.value;
  }
}

customElements.define("dw-select-trigger", DwSelectTrigger);
