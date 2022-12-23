import { LitElement, html, css } from '@dreamworld/pwa-helpers/lit.js';
import { styleMap } from 'lit/directives/style-map.js';
import '@dreamworld/dw-icon';

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
        font-size: 16px;
        line-height: 16px;
        font-weight: 400;
        min-height: var(--dw-select-item-height, 48px);
        color: var(--dw-select-item-color, var(--primary-text-color));
      }

      .trail-icon{
        transition: transform 0.2s ease-out;
      }

      :host(.expanded) .trail-icon{
        transform: rotate(-180deg);
      }

      .container {
        flex: 1;
        -ms-flex: 1 1 0.000000001px;
        -webkit-flex: 1;
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
        padding: var(--dw-select-item-padding, 0px 16px);
        min-height: var(--dw-select-item-height, 48px);
        overflow: hidden; 
      }

      :host(:hover) {
        background: var(--dw-select-item-hover-color, rgba(0,0,0,0.06));
      }

      :host([disabled]) {
        pointer-events: none;
        opacity: var(--dw-select-item-disabled-opacity, 0.3);
        cursor: default;
      }

      .content {
        flex: 1;
        -ms-flex: 1 1 0.000000001px;
        -webkit-flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: var(--dw-select-item-content-color);
        text-transform: var(--dw-select-item-content-text-transform, initial);
        padding: var(--dw-select-item-content-padding, 0px);
        margin: var(--dw-select-item-content-margin, 0px);
      }

      .icon {
        -ms-flex: none;
        -webkit-flex: none;
        flex: none;
        height: var(--dw-select-item-icon-height, 24px);
        width: var(--dw-select-item-icon-width, 24px);
        margin: var(--dw-select-item-icon-margin, 0px 8px 0px 0px);
        --dw-icon-color: var(--dw-select-item-icon-color);
      }

      :host([disabled]) .icon{
        --dw-icon-color: var(--dw-select-item-disabled-icon-color);
      } 
      

      .check-icon {
        display: var(--dw-select-item-check-icon-display, block);
        -ms-flex: none;
        -webkit-flex: none;
        flex: none;
        height: 24px;
        width: 24px;
      }

      .check-icon dw-icon {
        --dw-icon-color: var(--dw-select-check-icon, var(--primary-color));
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
      selected: { type: Boolean },

      /**
       * Input property. True when item is disabled
       */
      disabled: { type: Boolean, reflect: true },

      /**
       * Input property. Show tooltip if item is disabled.
       */
      disabledTooltip: { type: String },

      /**
       * Input property. Show icon for item.
       */
      icon: { type: String },

      /**
       * Input property. Show trail icon
       */
      trailIcon: { type: String },

      /**
       * Input property. Represent icon size.
       */
      iconSize: { tyep: Number }
    };
  }

  constructor() {
    super();
    this.selected = false;
  }

  render() {
    return html`
      <div class="container" title=${this._getToolTipText()}>
        <div class="icon" ?hidden="${!this.icon}">
          <dw-icon style="${styleMap(this._setIconColor(this.item))}" name="${this.icon}" size="${this.iconSize}"></dw-icon>
        </div>
        <div class="content" style="${styleMap(this._setTextColor(this.item))}">${this._getName(this.item, this.itemLabel)}</div>
        <div class="check-icon">${this.selected ? this._getCheckIcon() : ''}</div>
        ${this.trailIcon ? html`
        <dw-icon class="trail-icon" style="${styleMap(this._setIconColor(this.item))}" name="${this.trailIcon}" size="${this.iconSize}"></dw-icon>
        ` : ''}
      </div>
    `;
  }

  /**
   * Sets icon color if provided.
   * @param {Object} item item
   */
  _setIconColor(item) {
    if (item.iconColor) {
      if (item.iconColor.startsWith('-')) {
        return { '--dw-icon-color': `var(${item.iconColor})` };
      } else {
        return { '--dw-icon-color': `${item.iconColor}` };
      }
    }
    return {};
  }

  /**
   * Set text color if provided.
   * @param {Object} item Item
   */
  _setTextColor(item) {
    if (item.textColor) {
      if (item.textColor.startsWith('-')) {
        return { 'color': `var(${item.textColor})` };
      } else {
        return { 'color': `${item.textColor}` };
      }
    }
    return {};
  }

  _getName(item, itemLabel){
    return itemLabel ? item[itemLabel] : item;
  }

  _getCheckIcon(){
    return html `<dw-icon name="check_circle"></dw-icon>`;
  }

  /**
   * @return {String} `disabledTooltip` when item is disabled, otherwise empty string.
   * @protected
   */
  _getToolTipText() {
    if(this.disabled) {
      return this.disabledTooltip || '';
    }

    return '';
  }
}

customElements.define('dw-select-item', DwSelectItem);