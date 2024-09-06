import { LitElement, css, html, unsafeCSS } from '@dreamworld/pwa-helpers/lit.js';

// View Elements
import '@dreamworld/dw-icon';
import '@dreamworld/dw-ripple';

// Styles
import * as TypographyLiterals from '@dreamworld/material-styles/typography-literals';

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

export class DwMultiSelectGroupItem extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          position: relative;
          display: flex;
          flex-direction: row;
          align-items: center;
          box-sizing: border-box;
        }

        .label {
          flex: 1;
          color: var(--mdc-theme-text-secondary-on-background, rgba(0, 0, 0, 0.6));
          ${unsafeCSS(TypographyLiterals.subtitle2)};
          padding: 14px 16px 8px;
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
    };
  }

  render() {
    return html` <div class="label">${this.label}</div> `;
  }
}

customElements.define('dw-multi-select-group-item', DwMultiSelectGroupItem);
