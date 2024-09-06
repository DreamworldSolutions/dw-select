import '@dreamworld/dw-icon-button';
import { LitElement, css, html, nothing, unsafeCSS } from '@dreamworld/pwa-helpers/lit.js';

// Styles
import * as TypographyLiterals from '@dreamworld/material-styles/typography-literals.js';

// View Elements
import '@material/mwc-circular-progress';
import '@dreamworld/dw-icon/dw-icon.js';

/**
 * #Behaviours
 *  - on Focus: Updates border color to primary color
 *
 * #Events
 *  - `cancel`: When Back icon-button is clicked.
 *  - `input`: Proxied from input element. Before it’s proxied, value property is synced/updated.
 */

export class DwMultiSelectDialogInput extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
          height: 48px;
          border: 1px solid var(--mdc-theme-divider-color, rgba(0, 0, 0, 0.12));
          border-radius: 24px;
          box-sizing: border-box;
          transition: border-width 0.1s, border-color 0.1s;
          transition-timing-function: ease-in;
          box-sizing: border-box;
        }

        :host([_hasFocus]) {
          border: 2px solid;
          border-color: var(--mdc-theme-text-secondary-on-surface, rgba(0, 0, 0, 0.6));
        }

        dw-icon-button {
          --dw-icon-color: var(--mdc-theme-text-secondary-on-surface, rgba(0, 0, 0, 0.6));
        }

        .search-icon {
          --dw-icon-color: var(--mdc-theme-text-icon-on-surface, rgba(0, 0, 0, 0.38));
          padding: 12px;
        }

        :host([_hasFocus]) .search-icon {
          --dw-icon-color: var(--mdc-theme-text-secondary-on-surface, rgba(0, 0, 0, 0.6));
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

        input::placeholder {
          color: var(--mdc-theme-text-hint-on-surface, rgba(0, 0, 0, 0.38));
          ${TypographyLiterals.subtitle1};
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
       * Contains value of the input
       */
      value: String,

      /**
       * Placeholder for search input
       */
      searchPlaceholder: String,

      /**
       * Whether close icon button is visible or not
       */
      _hasCloseButton: Boolean,

      /**
       * Whether element has focused or not
       */
      _hasFocus: { type: Boolean, reflect: true },

      suffixTemplate: { type: Object },
    };
  }

  constructor() {
    super();
    this.value = '';
  }

  willUpdate(_changedProperties) {
    super.willUpdate(_changedProperties);

    if (_changedProperties.has('value')) {
      this._hasCloseButton = Boolean(this.value);
    }
  }

  render() {
    return html`
      <div class="container">
        <dw-icon class="search-icon" name=${'search'}></dw-icon>
        <input
          @focus=${this._onFocus}
          @blur=${this._onBlur}
          @input=${this._onInput}
          .value=${this.value}
          .placeholder="${this.searchPlaceholder}"
        />
        ${this.suffixTemplate ? this.suffixTemplate : this._renderTrailingIcons}
      </div>
    `;
  }

  get _renderTrailingIcons() {
    return this._hasCloseButton
      ? html`<dw-icon-button .iconFont="${'OUTLINED'}" icon="cancel" @click=${this._onClear}></dw-icon-button>`
      : nothing;
  }

  _onFocus() {
    this._hasFocus = true;
    this.dispatchEvent(new CustomEvent('input-focus'));
  }

  _onBlur() {
    this._hasFocus = false;
    this.dispatchEvent(new CustomEvent('input-blur'));
  }

  _onInput(e) {
    e.stopPropagation();
    this.value = e.target && e.target.value;
    this.dispatchEvent(new CustomEvent('input-change'));
  }

  _onClear() {
    this.value = '';
    this.dispatchEvent(new CustomEvent('clear-selection'));
  }
}

customElements.define('dw-multi-select-dialog-input', DwMultiSelectDialogInput);
