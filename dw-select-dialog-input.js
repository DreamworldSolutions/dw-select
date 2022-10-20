import { LitElement, html, css, nothing } from "lit";
import "@dreamworld/dw-icon-button";

/**
 * #Behaviours
 *  - on Focus: Updates border color to primary color
 *
 * #Events
 *  - `cancel`: When Back icon-button is clicked.
 *  - `input`: Proxied from input element. Before it’s proxied, value property is synced/updated.
 */

export class DwSelectDialogInput extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
          height: 48px;
          border: 1px solid;
          border-radius: 24px;
          box-sizing: border-box;
        }

        :host([_hasFocus]) {
          border: 2px solid;
          border-color: var(--mdc-theme-primary, #6200ee);
        }

        .container {
          height: 100%;
          display: flex;
          align-items: center;
        }

        input {
          border: none;
          background: none;
          appearance: none;
          padding: 0px;
          height: 28px;
          width: 100%;
          min-width: 0px;
          font-size: 1rem;
          font-weight: 400;
          text-decoration: inherit;
          text-transform: inherit;
          caret-color: var(--mdc-theme-primary, #6200ee);
          color: var(--mdc-theme-text-primary-on-surface, rgba(0, 0, 0, 0.87));
        }

        input:focus {
          outline: none;
        }
      `,
    ];
  }

  static get properties() {
    return {
      /**
       * Contains value of the input
       */
      value: String,

      /**
       * Whether close icon button is visible or not
       */
      _hasCloseButton: Boolean,

      /**
       * Whether element has focused or not
       */
      _hasFocus: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.value = "";
  }

  render() {
    return html`
      <div class="container">
        <dw-icon-button icon="arrow_back" @click=${this._onBack}></dw-icon-button>
        <input
          @focus=${this._onFocus}
          @blur=${this._onBlur}
          @input=${this._onInput}
          .value=${this.value}
        />
        ${this._hasCloseButton
          ? html`<dw-icon-button icon="close" @click=${this._onClear}></dw-icon-button>`
          : nothing}
      </div>
    `;
  }

  _onFocus() {
    this._hasFocus = true;
  }

  _onBlur() {
    this._hasFocus = false;
  }

  _onInput(e) {
    e.stopPropagation();
    this.value = e.target && e.target.value;
    this._hasCloseButton = Boolean(this.value);
    this.dispatchEvent(new CustomEvent("input-change"));
  }

  _onBack() {
    this.dispatchEvent(new CustomEvent("cancel"));
  }

  _onClear() {
    this.value = "";
    this.dispatchEvent(new CustomEvent("input-change"));
  }
}

customElements.define("dw-select-dialog-input", DwSelectDialogInput);
