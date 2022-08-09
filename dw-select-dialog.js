import { css, html } from "lit-element";

// View Elements
import { DwCompositeDialog } from "@dreamworld/dw-dialog/dw-composite-dialog.js";

/**
 * Renders the list of choices on temporary Composite Dialog.
 * Using `dw-list-item` or custom template provider `renderItem` to render List of Items
 * 
 * [`select-dialog-doc`](docs/select-dialog.md)
 */

export class DwSelectDialog extends DwCompositeDialog {

  constructor() {
    super();
    this.type = "popover";
  }

  get _contentTemplate() {
    return html`Dw-Select-dialog`
  }
}

window.customElements.define('dw-select-dialog', DwSelectDialog)