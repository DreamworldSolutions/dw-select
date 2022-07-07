import { LitElement, html } from "lit";

// View Elements
import "./dw-select-trigger.js";
import "./dw-select-dialog.js";

export class DwSelect extends LitElement {
  render() {
    return html`
      Dw-select
      <dw-select-trigger @click=${this._onTrigger}></dw-select-trigger>
      <dw-select-dialog id="selectDialog"></dw-select-dialog>
    `;
  }

  _onTrigger(e) {
    let dialogElement = this.renderRoot.querySelector('#selectDialog');
    dialogElement && dialogElement.open(e.target);
  }
}

customElements.define('dw-select', DwSelect)