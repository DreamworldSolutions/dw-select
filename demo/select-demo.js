import { LitElement, html, css } from 'lit-element';
import '../dw-select';

class SelectDemo extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: inline-block;
          box-sizing: border-box
        }
        dw-select {
          --dw-select-width: 150px;
        }
      `
    ];
  } 

  static get properties() {
    return {
      items: { type: Array },
      value: { type: String },
      singleSelect: { type: Boolean, reflect: true, attribute:'single-select'},
      itemLabel: { type: String },
      itemValue: { type: String },
      hAlign: { type: String, reflect: true, attribute:'h-align' },
      vAlign: { type: String, reflect: true, attribute:'v-align' },
      hOffset: Number,
      vOffset: Number,
      allowFilter: { type: Boolean, reflect: true, attribute:'allow-filter' },
      groupBy: { type: String, reflect: true, attribute:'group-by' },
      groupByOrder: { type: Array },
      groupText: { type: Object }
    };
  }

  constructor() {
    super();
    let array = [];
    for(let i=0; i< 100; i++){
      array.push({
        id: 'id' + i,
        name: i % 2 === 0 ? 'bank name ' + i : 'contact name ' + i,
        type: i % 2 === 0 ? 'BANK' : 'CONTACT'
      });
    }
    this.items = array;
    this.singleSelect = false;
    this.allowFilter = false;
    this.groupByOrder = ['CONTACT', 'BANK'];
    this.groupText = (group) => {
      if(group === 'CONTACT') {
        return 'Contact';
      }
      if(group === 'BANK') {
        return 'Bank';
      }
    };
  }

  connectedCallback(){
    super.connectedCallback();
    if(this.singleSelect){
      this.items = [{
        id: '', name: 'Select one'
      }, ...this.items];
    } else {
      this.value = ['id2', 'id3'];
    }
  }

  render() {
    return html`
      <dw-select
       .items=${this.items}
       itemValue="id"
       itemLabel="name"
       label="Account"
       required
       .dialogTitle=${'Select account'}
       .filterPlaceholder=${'Search account'}
       placeholder="Select account"
       .hAlign=${this.hAlign}
       .vAlign=${this.vAlign}
       .hOffset=${this.hOffset}
       .vOffset=${this.vOffset}
       .value=${this.value}
       .singleSelect=${this.singleSelect}
       .allowFilter=${this.allowFilter}
       .groupBy=${this.groupBy}
       .groupByOrder=${this.groupByOrder}
       .groupText=${this.groupText}
       .selectedItemsText=${this.selectedItemsText}
       @invalid-changed=${this._invalidChanged}
       @value-changed=${this._valueChanged}
       @opened-changed=${this._openedChanged}>
      </dw-select>
    `;
  }

  _valueChanged(e) {
    console.log('Value change', e.detail);
  }

  _openedChanged(e) {
    console.log('opened change', e.detail);
  }

  _invalidChanged(e) {
    console.log('invalid change', e.detail);
  }
}

customElements.define('select-demo', SelectDemo);