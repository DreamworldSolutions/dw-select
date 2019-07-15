import { LitElement, html, css } from 'lit-element';
import { checkIcon } from './dw-select-icons';

export class DwSelectItem extends LitElement {
  
  static get styles() {
    return css`
      :host {
        display: flex;
        display: -ms-flexbox;
        display: -webkit-flex;
        flex-direction: row;
        -ms-flex-direction: row;
        -webkit-flex-direction: row;
        align-items: center;
        -ms-flex-align: center;
        -webkit-align-items: center;
        box-sizing: border-box;
        cursor: pointer;
        padding: 0px 16px;
        font-size: 16px;
        line-height: 16px;
        font-weight: 400;
        min-height: var(--dw-select-item-height, 48px);
        color: var(--dw-select-item-color);
      }

      :host(:hover) {
        background: var(--dw-select-item-hover-color, rgba(0,0,0,0.06));
      }

      .content {
        flex: 1;
        -ms-flex: 1 1 0.000000001px;
        -webkit-flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .check-icon {
        height: 24px;
        width: 24px;
        fill: var(--dw-select-check-icon);
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
      <div class="content">${this._getName(this.item, this.itemLabel)}</div>
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