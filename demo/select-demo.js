import { LitElement, html, css } from 'lit-element';
import '../dw-select';

class SelectDemo extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: inline-block;
          box-sizing: border-box
        }
      `
    ];
  } 

  render() {
    return html`
      <dw-select></dw-select>
    `;
  }
}

customElements.define('select-demo', SelectDemo);