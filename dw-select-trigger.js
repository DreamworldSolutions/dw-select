import { LitElement, html, css } from "lit";

/**
 * Used to edit and enter text, or only readOnnly.
 * 
 * [`select-dialog-doc`](docs/select-trigger.md)
 */

export class DwSelectTrigger extends LitElement {
  render() {
    return html`Dw-Trigger`;
  }
}

customElements.define('dw-select-trigger', DwSelectTrigger)