import { LitElement, html, css } from 'lit-element';
import { checkIcon } from './dw-select-icons';

export class DwSelectItem extends LitElement {
  
  static get styles() {
    return css`
      :host {
        box-sizing: border-box;
        align-items: center;
        min-height: 48px;
        padding: 0px 16px;
        cursor: pointer;
      }
      :host(:hover) {
        background: #f3f3f3;
      }
      .check-icon {
        height: 24px;
        width: 24px;
      }
      svg {
        height: 100%;
        width: 100%;
        fill: green;
      }
    `;
  } 

  static get properties() {
    return {
      /**
       * Input property. The item to render
       */
      item: { type: Object },
      /**
       * Input property. Path for label of the item. If items is an array of objects, the itemLabel is used to fetch the displayed string label for each item.
       * The item label is also used for matching items when processing user input, i.e., for filtering .
       */
      itemLabel: { type: String },
      /**
       * Input property. Path for the value of the item. If items is an array of objects, the itemValue: is used to fetch the string value for the selected item.
       */
      itemValue: { type: String },
      /**
       * Input property. True when item is selected
       */
      selected: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.selected = false;
  }

  render() {
    return html`
      <div>${this._getName(this.item, this.itemLabel)}</div>
      <div class="check-icon">${this.selected ? this._getCheckIcon() : ''}</div>
    `;
  }

  _getName(item, itemLabel){
    return itemLabel ? item[itemLabel] : item;
  }

  _getCheckIcon(){
    return checkIcon;
  }
}

customElements.define('dw-select-item', DwSelectItem);