import { LitElement, html } from "lit";

// View Elements
import "./dw-select-trigger.js";
import "./dw-select-dialog.js";

/**
 * A Select is an input widget with an associated dropdown that allows users to select a value from a list of possible values.
 * 
 * ## Types of Select
 * 
 * ### Default
 *  - Sometimes Select does not support to allowed user intrect with text input (Non-searchable). 
 *  - It is used when the list of options is predefined and limited.
 * 
 * ### Searchable
 *  - Sometimes Select support to allowed user intrect with text input (searchable).
 *  - Typing input serves to filter suggestions presented in the popup.
 *  - It is used when the list of options is variable and very long.
 * 
 * ## Behaviour
 *  - Renders `dw-select-trigger` and `dw-select-dialog`
 *  - When `opened` is true attach and open dialog
 * 
 * ### Focus:
 *  - For searchable types, it shows a cursor. For non searchable type, doesn’t show cursor.
 *  - The dropdown opens when the user clicks the field using a pointing device.
 * 
 * ### Typing:
 *  - Not applicable to non searchable
 *  - Typing a character when the field is focused also opens the popup.
 *  - Shows result matching with any word of the input string. For e.g. if the user types ‘hdfc bank’ it should show a records which contains words ‘hdfc’ or ‘bank’ anywhere (at start, middle or at end)  
 *  - Matching string is highlighted
 *  - Shows the most relevant matches in dropdown in sorted order. Sorting order is most matched to least matched.
 * 
 * ### Keyboard accessibility
 *  TODO - write documentation
 * 
 * ### Toggle icon
 *  TODO - write documentation
 * 
 * ### Reset Icon
 *  TODO - write documentation
 * 
 * 
 */

export class DwSelect extends LitElement {
  render() {
    return html`
      <dw-select-trigger @click=${this._onTrigger}></dw-select-trigger>
      ${this._loadFragments}
    `;
  }

  get _loadFragments() {
    return html`<dw-select-dialog id="selectDialog"></dw-select-dialog>`
  }

  _onTrigger(e) {
    let dialogElement = this.renderRoot.querySelector('#selectDialog');
    dialogElement && dialogElement.open(e.target);
  }
}

customElements.define('dw-select', DwSelect)