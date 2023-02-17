import { html } from "@dreamworld/pwa-helpers/lit.js";
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
  }

  get _footerTemplate() {
    return html`<b><i>Footer Template</i></b>`;
  }
}

customElements.define("dw-select-extension-demo", DwSelectExtensionDemo);
