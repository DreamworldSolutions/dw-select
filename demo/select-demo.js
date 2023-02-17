import { css, html, LitElement } from "@dreamworld/pwa-helpers/lit.js";
import "../dw-select";
import "../dw-select-dialog-input";
import "../dw-select-group-item";
import "../dw-select-trigger";
import "./dw-select-extension-demo";
import "../dw-select-temp.js";

import { DwCompositeDialog } from "@dreamworld/dw-dialog/dw-composite-dialog";

import { queryFilterGenerator } from "../utils";
import { country_list_with_code, groupList, groups, list } from "./utils";

const message = {
  noMatching: "No matching records found!",
};

class SelectDemo extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          box-sizing: border-box;
          --dw-select-item-selected-bg-color: transparent;
          --dw-dialog-header-padding: 12px 4px 12px 16px;
        }

        dw-select {
          margin-bottom: 24px;
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="fit-dialog-container"></div>
      <dw-select
        searchable
        .items=${country_list_with_code}
        .value=${country_list_with_code[2]}
        .valueTextProvider=${(item) => item.name}
        .valueExpression="${"name"}"
        label="Select country"
        placeholder="placeholder"
        helper="helper text"
        selectedTrailingIcon="done"
        .heading=${"Download"}
        showClose
        required
        .requiredMessage=${"Required"}
        errorInTooltip
        autoValidate
        @selected=${this._onSelect}
        .helper=${"Simple Helper Text"}
        helperPersistent
        .helperTextProvider=${this._helperTextProvider}
        .messages="${message}"
        allowNewValue
        .newValueProvider=${(query) => {
          return new Promise((resolve, reject) => {
            resolve({ name: query, code: query });
          });
        }}
      ></dw-select>

      <dw-select
        .items=${list}
        .valueTextProvider=${(item) => item}
        label="Download"
        placeholder="Placeholder"
        helper="helper text"
        layout="small"
        .heading=${"Download"}
        showClose
        searchable
        outlined
        autoValidate
        @selected=${this._onSelect}
        .messages="${message}"
        allowNewValue
        .newValueProvider=${(query) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(query + " +");
            }, 3000);
          });
        }}
      ></dw-select>

      <dw-select
        searchable
        .items=${groupList}
        .groups=${groups}
        .valueExpression="${"name"}"
        .valueTextProvider=${(item) => item.name}
        .groupSelector=${(item) => item.label}
        groupExpression="type"
        label="Contacts"
        @selected=${this._onSelect}
        .searchPlaceholder="${"Search Input placeholder"}"
        .messages="${message}"
      ></dw-select>

      <dw-select-temp
        searchable
        .items=${groupList}
        .groups=${groups}
        .valueExpression="${"name"}"
        .valueTextProvider=${(item) => item.name}
        .groupSelector=${(item) => item.label}
        groupExpression="type"
        label="Contacts"
        @selected=${this._onSelect}
        .searchPlaceholder="${"Search Input placeholder"}"
        .messages="${message}"
        allowNewValue
        outlined
        .newValueProvider=${(query) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(query + " +");
            }, 3000);
          });
        }}
      ></dw-select-temp>

      <dw-select
        vkb
        searchable
        .queryFilter=${queryFilterGenerator(["name", "code"])}
        .items=${groupList}
        .groups=${groups}
        .valueExpression="${"name"}"
        .valueTextProvider=${(item) => item.name}
        .groupSelector=${(item) => item.label}
        groupExpression="type"
        label="Contacts"
        @selected=${this._onSelect}
        .searchPlaceholder="${"Search Input placeholder"}"
        .messages="${message}"
        allowNewValue
        .newValueProvider=${(query) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(query + " +");
            }, 3000);
          });
        }}
      ></dw-select>

      <dw-select
        .label=${"Filter By"}
        .heading="${"Filter By"}"
        showClose
        .items=${this._filterBySelectItems}
        .valueTextProvider=${(item) => item.name}
        .value=${this._filterByValue}
        @selected=${this._onSelect}
      ></dw-select>

      <!-- <dw-select-extension-demo></dw-select-extension-demo> -->

      <!-- <dw-select-trigger label="Trigger" updatedHighlight></dw-select-trigger> -->

      <!-- <dw-select-dialog-input
        @input=${(e) => console.log(e.target.value)}
        @cancel=${() => console.log("cancel")}
      ></dw-select-dialog-input> -->

      <!-- <dw-select-group-item label="Contact" collapsible collapsed></dw-select-group-item> -->
    `;
  }

  firstUpdated() {
    let elFitDialogContainer = this.shadowRoot.querySelector(".fit-dialog-container");
    DwCompositeDialog.setAppendTo(elFitDialogContainer);
  }

  _helperTextProvider(value) {
    if (value && value.name) {
      return "Country Code: " + value.code;
    }
  }

  _onSelect(e) {
    console.log(e);
  }

  get _filterBySelectItems() {
    return [
      { name: "transactionDate", value: "TXN_DATE" },
      { name: "dueDate", value: "DUE_DATE" },
    ];
  }

  get _filterByValue() {
    return this._filterBySelectItems.find((item) => item.value === "DUE_DATE");
  }
}

customElements.define("select-demo", SelectDemo);
