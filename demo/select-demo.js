import { LitElement, html, css } from "lit";
import "../dw-select";
import "../dw-select-group-item";
import "../dw-select-dialog-input";

import { country_list, country_list_with_code, list, groupList, groups, accounts } from "./utils";

class SelectDemo extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          box-sizing: border-box;
        }
      `,
    ];
  }

  render() {
    return html`
      <dw-select
        searchable
        .items=${country_list_with_code}
        valueExpression="name"
        label="Select country"
        placeholder="placeholder"
        helper="helper text"
        required
        requiredMessage="required Message"
      ></dw-select>

      <dw-select
        .items=${list}
        valueExpression=""
        label="Download"
        placeholder="placeholder"
        helper="helper text"
        layout="small"
      ></dw-select>

      <dw-select
        vkb
        searchable
        .items=${accounts}
        .groups=${groups}
        groupExpression="type"
        valueExpression="name"
        label="Contacts"
      ></dw-select>

      <!-- <dw-select-dialog-input
        @input=${(e) => console.log(e.target.value)}
        @cancel=${() => console.log("cancel")}
      ></dw-select-dialog-input> -->

      <!-- <dw-select-group-item label="Contact" collapsible collapsed></dw-select-group-item> -->
    `;
  }
}

customElements.define("select-demo", SelectDemo);
