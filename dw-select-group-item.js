import { LitElement, html, css } from "lit";
import "@dreamworld/dw-icon";
import "@dreamworld/dw-ripple";

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
  static styles = [
    css`
      :host {
        position: relative;
        display: flex;
        height: 42px;
        flex-direction: row;
        align-items: center;
        padding: 0 16px;
      }

      .label {
        flex: 1;
      }
    `,
  ];

  static properties = {
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
    collapsible: { type: Boolean },

    /**
     * Whether group item is collapsed or not.
     */
    collapsed: { type: Boolean },
  };

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
