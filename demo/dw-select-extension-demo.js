import "@dreamworld/dw-list-item";
import { html } from "@dreamworld/pwa-helpers/lit.js";
import isEqual from "lodash-es/isEqual.js";
import { DwSelect } from "../dw-select";

import { country_list_with_code } from "./utils";

export class DwSelectExtensionDemo extends DwSelect {
  constructor() {
    super();
    this.items = country_list_with_code;
    this.valueTextProvider = (item) => item.name;
    this.label = "Extenstion Select";
    this.layout = "small";
    this.searchable = true;
    this.renderItem = (item, selected, activated, query) =>
      this._renderProductListItem(item, selected, activated, query);
  }

  _renderProductListItem(item, selected, activated, query) {
    return html`
      <dw-list-item
        .title1=${item.value.name}
        title2="${item.value?.code || ""}"
        twoLine
        ?selected=${selected}
        .trailingIcon=${"done"}
        .leadingIconFont=${"OUTLINED"}
        ?hasTrailingIcon=${selected}
        .highlight=${query}
        ?activated=${activated}
        @click=${(e) => this._onClick(item.value)}
      ></dw-list-item>
    `;
  }

  _onClick(value) {
    this.value = value;
    this._opened = false;
    this.dispatchEvent(new CustomEvent("selection-done", { detail: value }));
  }

  get _footerTemplate() {
    return html`<b><i>Footer Template</i></b>`;
  }
}

customElements.define("dw-select-extension-demo", DwSelectExtensionDemo);
