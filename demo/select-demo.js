import { LitElement, html, css } from "lit-element";
import "../dw-select";

import { country_list, country_list_with_code, list } from "./utils";

class SelectDemo extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }
      `,
    ];
  }

  render() {
    return html`
      <dw-select
        .items=${country_list_with_code}
        valueExpression="name"
        label="select country"
        placeholder="placeholder"
        helper="helper text"
      ></dw-select>

      <dw-select
        .items=${list}
        valueExpression=""
        label="Download"
        placeholder="placeholder"
        helper="helper text"
      ></dw-select>
    `;
  }
}

customElements.define("select-demo", SelectDemo);
