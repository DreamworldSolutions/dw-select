import { LitElement, html, css } from "lit-element";
import { DwSelect } from "../dw-select";

import { country_list, country_list_with_code, list, groupList, groups, accounts } from "./utils";

export class DwSelectExtensionDemo extends DwSelect {
  constructor() {
    super();
    this.items = country_list_with_code;
    this.valueExpression = "name";
    this.label = "Extenstion Select";
    this.layout = "small";
    this.searchable = true;
  }

  get _footerTemplate() {
    return html`<b><i>Footer Template</i></b>`;
  }
}

customElements.define("dw-select-extension-demo", DwSelectExtensionDemo);
