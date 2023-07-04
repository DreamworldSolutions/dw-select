import '@dreamworld/dw-list-item';
import { html } from '@dreamworld/pwa-helpers/lit.js';
import { DwSelect } from '../dw-select';

import { country_list_with_code } from './utils';

export class DwSelectExtensionDemo extends DwSelect {
  constructor() {
    super();
    this.items = country_list_with_code;
    this.valueTextProvider = item => item.name;
    this.label = 'Extenstion Select';
    this.layout = 'small';
    this.searchable = true;
    this.value = 'India';
    this.valueExpression = 'name';
    this.renderItem = (item, selected, activated, query, onClick) => this._renderProductListItem(item, selected, activated, query, onClick);
  }

  _renderProductListItem(item, selected, activated, query, onClick) {
    return html`
      <dw-list-item
        .title1=${item.name}
        title2="${item?.code || ''}"
        twoLine
        ?selected=${selected}
        .trailingIcon=${'done'}
        .leadingIconFont=${'OUTLINED'}
        ?hasTrailingIcon=${selected}
        .highlight=${query}
        ?activated=${activated}
        @click=${() => onClick(item)}
      ></dw-list-item>
    `;
  }

  _onClick(value) {
    this.value = value;
    this._opened = false;
    this.dispatchEvent(new CustomEvent('selection-done', { detail: value }));
  }

  get _footerTemplate() {
    return html`<b><i>Footer Template</i></b>`;
  }
}

customElements.define('dw-select-extension-demo', DwSelectExtensionDemo);
