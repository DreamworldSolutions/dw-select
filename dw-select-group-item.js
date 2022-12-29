import { LitElement, html, css, unsafeCSS } from "@dreamworld/pwa-helpers/lit.js";

// View Elements
import "@dreamworld/dw-icon";
import "@dreamworld/dw-ripple";

// Styles
import * as TypographyLiterals from "@dreamworld/material-styles/typography-literals";

/**
 * # Behaviour
 *  - Renders content based on collapsible & collapsed.
 *  - When collapsible = false
 *    - It doesn’t show icon on the right, though collapsed=true
 *    - no hover & not focusable.
 *  - When collapsible = true
 *    - icon is rendered on the right side based on collapsed value.
 *    - Hover effect is visible
 *    - On click, ripple is shown
 */

export class DwSelectGroupItem extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          position: relative;
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid var(--mdc-theme-divider-color, rgba(0, 0, 0, 0.12));
          box-sizing: border-box;
        }

        :host(:not([collapsible])) {
          padding: 14px 16px 8px;
          border-bottom: none;
        }

        :host(:not([collapsible])) .label {
          ${unsafeCSS(TypographyLiterals.subtitle2)};
        }

        .label {
          flex: 1;
          color: var(--mdc-theme-text-primary-on-surface, rgba(0, 0, 0, 0.87));
          ${unsafeCSS(TypographyLiterals.subtitle1)};
        }
      `,
    ];
  }

  static get properties() {
    return {
      /**
       * Name of the group item
       */
      name: { type: String },

      /**
       * Label of the group item
       */
      label: { type: String },

      /**
       * Whether group item is collapsible or not.
       */
      collapsible: { type: Boolean, reflect: true },

      /**
       * Whether group item is collapsed or not.
       */
      collapsed: { type: Boolean },
    };
  }

  render() {
    return html`
      <div class="label">${this.label}</div>
      ${this._renderTrailingIcon}
    `;
  }

  get _renderTrailingIcon() {
    if (this.collapsible) {
      return html`
        <dw-ripple></dw-ripple>
        <dw-icon name=${this.collapsed ? "expand_more" : "expand_less"}></dw-icon>
      `;
    }

    return html``;
  }
}

customElements.define("dw-select-group-item", DwSelectGroupItem);
