import '@dreamworld/dw-form';
import '@dreamworld/dw-list-item';
import { css, html, LitElement } from '@dreamworld/pwa-helpers/lit.js';
import '../dw-select';
import '../dw-select-dialog-input';
import '../dw-select-group-item';
import '../dw-select-trigger';
import './dw-select-extension-demo';

import { DwCompositeDialog } from '@dreamworld/dw-dialog/dw-composite-dialog';

import { queryFilterGenerator } from '../utils';
import { country_list_with_code, groupList, groups, list } from './utils';

const message = {
  noMatching: 'No matching records found!',
};

class SelectDemo extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          box-sizing: border-box;
          --dw-dialog-header-padding: 12px 4px 12px 16px;
        }

        dw-select,
        dw-select-extension-demo {
          margin-bottom: 24px;
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="fit-dialog-container"></div>
      <dw-form>
        <dw-select
          name="country"
          searchable
          outlined
          .items=${country_list_with_code}
          .value=${'India'}
          .originalValue="${'India'}"
          .valueTextProvider=${item => `${item.name} - ${item.code}`}
          .valueExpression="${'name'}"
          label="Select country"
          placeholder="placeholder"
          helper="helper text"
          selectedTrailingIcon="done"
          .heading=${'Download'}
          showClose
          required
          highlightChanged
          .requiredMessage=${'Required'}
          errorInTooltip
          autoValidate
          @change=${this._onChange}
          .helper=${'Simple Helper Text'}
          helperPersistent
          .helperTextProvider=${this._helperTextProvider}
          .messages="${message}"
          allowNewValue
          .newValueProvider=${query => {
            return new Promise((resolve, reject) => {
              resolve({ name: query, code: query });
            });
          }}
        ></dw-select>
      </dw-form>
      <dw-select label="Select" outlined .items=${list} .value="${'PDF'}" @change=${this._onChange} required></dw-select>

      <dw-select
        label="Select"
        outlined
        searchable
        .value=${'Antigua and Barbuda'}
        .items=${country_list_with_code}
        .valueTextProvider=${item => item.name}
        .valueProvider=${item => item.name}
        .selectedTrailingIcon=${'done'}
        @change=${this._onChange}
        required
      ></dw-select>

      <dw-select
        .items=${list}
        .valueTextProvider=${item => item}
        .value=${list[2]}
        label="Download"
        placeholder="Placeholder"
        helper="helper text"
        layout="small"
        .heading=${'Download'}
        showClose
        searchable
        outlined
        autoValidate
        @change=${this._onChange}
        .messages="${message}"
        allowNewValue
        .newValueProvider=${query => {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve(query + ' +');
            }, 3000);
          });
        }}
      ></dw-select>

      <dw-select
        searchable
        outlined
        .items=${groupList}
        .value=${groupList[0].name}
        .groups=${groups}
        .valueExpression="${'name'}"
        .valueTextProvider=${item => item.name}
        .groupSelector=${item => item.label}
        groupExpression="type"
        label="Contacts"
        @change=${this._onChange}
        .renderItem=${(item, selected, activated, query, onClick) =>
          html`<dw-list-item
            .title1=${item.type + '#' + item.name}
            .title2=${item?.code || ''}
            twoLine
            ?selected=${selected}
            .trailingIcon=${'done'}
            .leadingIconFont=${'OUTLINED'}
            ?hasTrailingIcon=${selected}
            .highlight=${query}
            ?activated=${activated}
            @click=${() => onClick(item)}
            .focusable=${false}
          ></dw-list-item>`}
      ></dw-select>

      <dw-select
        vkb
        searchable
        outlined
        .queryFilter=${queryFilterGenerator(['name', 'code'])}
        .items=${groupList}
        .value=${groupList[1].name}
        .groups=${groups}
        .valueExpression="${'name'}"
        .valueTextProvider=${item => item.name}
        .groupSelector=${item => item.label}
        groupExpression="type"
        label="Contacts"
        @change=${this._onChange}
        .searchPlaceholder="${'Search Input placeholder'}"
        .messages="${message}"
        allowNewValue
        .newValueProvider=${query => {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve(query + ' +');
            }, 3000);
          });
        }}
      ></dw-select>

      <dw-select
        .label=${'Filter By'}
        .heading="${'Filter By'}"
        showClose
        outlined
        .items=${this._filterBySelectItems}
        .valueTextProvider=${item => item.name}
        .valueExpression="${'value'}"
        .value=${'DUE_DATE'}
        @change=${this._onChange}
      ></dw-select>

      <dw-select-extension-demo outlined @change=${this._onChange}></dw-select-extension-demo>

      <dw-select
        .label=${'Highlight'}
        .heading="${'Country'}"
        showClose
        outlined
        .items=${country_list_with_code}
        .valueTextProvider=${item => item.name}
        .valueExpression="${'code'}"
        .value=${'IN'}
        .originalValue="${'IN'}"
        highlightChanged
        @change=${this._onChange}
      ></dw-select>

      <!-- <dw-select-trigger label="Trigger" updatedHighlight></dw-select-trigger> -->

      <!-- <dw-select-dialog-input
        @input=${e => console.log(e.target.value)}
        @cancel=${() => console.log('cancel')}
      ></dw-select-dialog-input> -->

      <!-- <dw-select-group-item label="Contact" collapsible collapsed></dw-select-group-item> -->
    `;
  }

  firstUpdated() {
    let elFitDialogContainer = this.shadowRoot.querySelector('.fit-dialog-container');
    DwCompositeDialog.setAppendTo(elFitDialogContainer);
  }

  _helperTextProvider(value) {
    if (value && value.name) {
      return 'Country Code: ' + value.code;
    }
  }

  _onChange(e) {
    console.log('_onChange', e);
  }

  get _filterBySelectItems() {
    return [
      { name: 'Transaction Date', value: 'TXN_DATE' },
      { name: 'Due Date', value: 'DUE_DATE' },
    ];
  }
}

customElements.define('select-demo', SelectDemo);
