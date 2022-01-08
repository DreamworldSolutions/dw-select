import { css } from "lit-element";

export const dwSelectStyle = css`
  :host {
    display: flex;
    box-sizing: border-box;
    width: var(--dw-select-width, 250px);
    --dw-select-error-color: var(--error-color);
    --dw-select-error-color: var(--error-color);
    --dw-select-label-color: var(--secondary-text-color);
    --dw-select-expand-more-icon-color: var(--light-theme-secondary-color);
    --dw-select-border-color: var(--light-theme-divider-color);
    --dw-select-value-color: var(--primary-text-color);
    --dw-select-placeholder-color: var(--light-theme-disabled-color);
    --dw-error-message-color: var(--error-color);
  }

  :host([trigger-icon]),
  :host([trigger-label]),
  :host([custom-trigger]) {
    width: var(--dw-select-width, auto);
  }

  .main-container {
    flex: 1;
  }

  :host([trigger-icon]) .main-container #dropdownContainer,
  :host([trigger-label]) .main-container #dropdownContainer,
  .main-container #dropdownContainer .trigger-icon,
  .main-container #dropdownContainer .trigger-label {
    display: flex;
    align-items: center;
    box-sizing: border-box;
  }

  .main-container #dropdownContainer .trigger-icon,
  .main-container #dropdownContainer .trigger-label {
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
  }

  .main-container #dropdownContainer dw-icon-button.trigger-icon {
    --dw-icon-color: var(--dw-select-trigger-icon-color, #000);
  }

  .main-container #dropdownContainer .trigger-label {
    width: var(--dw-select-trigger-label-width, auto);
    height: var(--dw-select-trigger-label-height, 36px);
  }

  .main-container #dropdownContainer .trigger-icon-label dw-icon {
    margin-right: 8px;
    --dw-icon-color: var(--dw-select-trigger-icon-color);
  }

  :host([invalid]) .main-container #dropdownContainer .label {
    color: var(--dw-select-error-color);
  }

  :host([invalid]) .main-container #dropdownContainer .dropdown-input {
    border-bottom: 2px solid var(--dw-select-error-color);
  }

  .main-container #dropdownContainer {
    outline: none;
    padding: var(--dw-select-dropdown-container-padding, 0px 0px 4px 0px);
    margin: var(--dw-select-dropdown-container-margin, 0px);
    cursor: pointer;
  }

  .main-container #dropdownContainer .label {
    color: var(--dw-select-label-color);
    padding-top: 4px;
  }

  .main-container #dropdownContainer .dropdown-input dw-icon {
    --dw-icon-color: var(--dw-select-expand-more-icon-color);
    padding: 0px 4px;
  }

  .main-container #dropdownContainer .dropdown-input {
    display: flex;
    display: -ms-flexbox;
    display: -webkit-flex;
    flex-direction: row;
    -ms-flex-direction: row;
    -webkit-flex-direction: row;
    align-items: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    justify-content: space-between;
    -ms-flex-pack: space-between;
    -webkit-justify-content: space-between;
    border-bottom: 1px solid var(--dw-select-border-color);
  }

  .main-container #dropdownContainer .dropdown-input .value-container {
    padding: 8px 0px 6px 0px;
    overflow: hidden;
  }

  .main-container #dropdownContainer .dropdown-input .value-container .value {
    color: var(--dw-select-value-color);
    padding-top: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .main-container
    #dropdownContainer
    .dropdown-input
    .value-container
    .placeholder {
    color: var(--dw-select-placeholder-color);
  }

  .error-message {
    color: var(--dw-error-message-color);
    padding-bottom: 4px;
  }

  #overlay {
    position: fixed;
    display: none;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: var(--overlay-color, rgba(0, 0, 0, 0.4));
    overflow: hidden;
    width: 100%;
    height: 100%;
    z-index: 99;
    cursor: pointer;
  }

  :host([overlay][mobile-mode]) #overlay {
    display: block;
  }

  :host([readOnly]) .main-container #dropdownContainer {
    cursor: default;
  }

  :host([readOnly]) .main-container #dropdownContainer .label,
  :host([readOnly]) .main-container #dropdownContainer .dropdown-input {
    opacity: 0.6;
  }

  #select-dialog {
    border-radius: 4px;
  }

  [data-tippy-root] {
    position: absolute;
  }
`;

export const externalStyle = css`
  #select-dialog,
  .tippy-box {
    border-radius: 4px;
  }

  .tippy-box {
    overflow-x: hidden !important;
  }

  .tippy-box:focus {
    outline: none;
  }

  .tippy-box[data-animation="expand"] {
    box-shadow: 0px 2px 6px #ccc;
    will-change: transform, transform-origin;
    animation-name: expand;
    animation-duration: var(--dw-popover-animation-time, 0.3s);
  }

  .tippy-box[data-placement="bottom-start"] {
    transform-origin: top left;
  }

  .tippy-box[data-placement="bottom-end"] {
    transform-origin: top right;
  }

  .tippy-box[data-placement="top-start"] {
    transform-origin: bottom left;
  }

  .tippy-box[data-placement="top-end"] {
    transform-origin: bottom right;
  }

  @keyframes expand {
    from {
      transform: scale(0, 0);
    }

    to {
      transform: scaleY(1, 1);
    }
  }
`;
