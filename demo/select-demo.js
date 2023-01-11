import { LitElement, html, css } from "@dreamworld/pwa-helpers/lit.js";
import "../dw-select";
import "../dw-select-group-item";
import "../dw-select-dialog-input";
import "../dw-select-trigger";
import "./dw-select-extension-demo";

import { DwCompositeDialog } from "@dreamworld/dw-dialog/dw-composite-dialog";

import { country_list, country_list_with_code, list, groupList, groups, accounts } from "./utils";
import { queryFilterGenerator } from "../utils";

const message = {
  noMatching: "No matching records found!",
};

class SelectDemo extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          box-sizing: border-box;
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
        .items=${list}
        .valueTextProvider=${(item) => item}
        label="Download"
        placeholder="placeholder"
        helper="helper text"
        layout="small"
        .heading=${"Download"}
        showClose
        searchable
        outlined
        autoValidate
        @selected=${this._onSelect}
        .messages="${message}"
      ></dw-select>

      <dw-select
        searchable
        .items=${groupList}
        .groups=${groups.map((e) => {
          return { ...e, collapsible: false, collapsed: false };
        })}
        .valueExpression="${"name"}"
        .valueTextProvider=${(item) => item.name}
        .groupSelector=${(item) => item.label}
        groupExpression="type"
        label="Contacts"
        @selected=${this._onSelect}
        .searchPlaceholder="${"Search Input placeholder"}"
        .messages="${message}"
      ></dw-select>

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
      ></dw-select>

      <dw-select
        searchable
        .items=${country_list_with_code}
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
        .showClearSelection=${true}
        @selected=${this._onSelect}
        .helper=${"Simple Helper Text"}
        helperPersistent
        .helperTextProvider=${this._helperTextProvider}
        .messages="${message}"
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
}

customElements.define("select-demo", SelectDemo);
