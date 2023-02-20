import { LitElement, html, css } from "@dreamworld/pwa-helpers/lit.js";
import { DwSelect } from "../dw-select";
import "@dreamworld/dw-list-item";
import isEqual from "lodash-es/isEqual.js";

import { country_list, country_list_with_code, list, groupList, groups, accounts } from "./utils";

export class DwSelectExtensionDemo extends DwSelect {
  constructor() {
    super();
    this.items = country_list_with_code;
    this.valueTextProvider = (item) => item.name;
    this.label = "Extenstion Select";
    this.layout = "small";
    this.searchable = true;
    this.renderItem = (index, item) => this._renderProductListItem(index, item);
  }

  _renderProductListItem(index, item) {
    return html`
      <dw-list-item
        .title1=${item.value.name}
        title2="${item.value?.code || ""}"
        twoLine
        ?selected=${isEqual(item.value, this.value)}
        .trailingIcon=${"done"}
        .leadingIconFont=${"OUTLINED"}
        ?hasTrailingIcon=${this._isTrailingIconAvailable(item.value)}
        .highlight=${this._query}
        ?activated=${index === this.activatedItemIndex}
        @click=${(e) => this._onItemClick(e, item.value)}
        
      ></dw-list-item>
    `;
  }

  _onItemClick(e, item) {
    this.value = item;
    this._opened = false;
    this.dispatchEvent(new CustomEvent("selection-done", { detail: item }));
  }

  _isTrailingIconAvailable(item) {
    if (this.value) {
      return isEqual(item, this.value);
    }
    return false;
  }

  get _footerTemplate() {
    return html`<b><i>Footer Template</i></b>`;
  }
}

customElements.define("dw-select-extension-demo", DwSelectExtensionDemo);
