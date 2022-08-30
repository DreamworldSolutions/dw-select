import { LitElement, html, css } from "lit";
import "../dw-select";
import "../dw-select-group-item";
import "../dw-select-dialog-input";
import "../dw-select-trigger";
import "./dw-select-extension-demo";

import { country_list, country_list_with_code, list, groupList, groups, accounts } from "./utils";

class SelectDemo extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          box-sizing: border-box;
        }

        dw-select {
          margin-bottom: 24px;
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
        @selected=${this._onSelect}
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

      <dw-select-extension-demo></dw-select-extension-demo>

      <!-- <dw-select-trigger label="Trigger" updatedHighlight></dw-select-trigger> -->

      <!-- <dw-select-dialog-input
        @input=${(e) => console.log(e.target.value)}
        @cancel=${() => console.log("cancel")}
      ></dw-select-dialog-input> -->

      <!-- <dw-select-group-item label="Contact" collapsible collapsed></dw-select-group-item> -->
    `;
  }

  _onSelect(e) {
    console.log(e);
  }
}

customElements.define("select-demo", SelectDemo);
