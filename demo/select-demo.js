import { LitElement, html, css } from "lit";
import "../dw-select";
import "../dw-select-group-item";

import { country_list, country_list_with_code, list, groupList, groups, accounts } from "./utils";

class SelectDemo extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: row;
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

      <dw-select
        searchable
        .items=${accounts}
        .groups=${groups}
        groupExpression="type"
        valueExpression="name"
        label="Contacts"
      ></dw-select>

      <!-- <dw-select-group-item label="Contact" collapsible collapsed></dw-select-group-item> -->
    `;
  }
}

customElements.define("select-demo", SelectDemo);
