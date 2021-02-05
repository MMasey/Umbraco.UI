import { html, css, property, query, LitElement } from 'lit-element';

import { UUIRadioChangeEvent } from '../../../event/UUIRadioChangeEvent';
import {
  UUIHorizontalShakeKeyframes,
  UUIHorizontalShakeAnimationValue,
} from '../../../animations/uui-shake';
/**
 *  @element uui-radio
 *  @slot - for label
 *
 */

export class UUIRadioElement extends LitElement {
  static styles = [
    UUIHorizontalShakeKeyframes,
    css`
      :host {
        font-family: inherit;
        color: currentColor;
        --uui-radio-button-size: calc(var(--uui-size-base-unit) * 3);
      }

      label {
        display: block;
        margin: 5px 0;
        display: flex;
        align-items: center;
        cursor: pointer;
      }

      #input {
        width: 0;
        height: 0;
        opacity: 0;
        margin: 0;
      }

      #button {
        display: inline-block;
        width: var(--uui-radio-button-size, 18px);
        height: var(--uui-radio-button-size, 18px);
        background-color: var(--uui-interface-background, white);
        border: 1px solid var(--uui-interface-border, #d8d7d9);
        border-radius: 100%;
        margin-right: 10px;
        position: relative;
      }

      #button::after {
        content: '';
        width: calc(var(--uui-radio-button-size) / 2);
        height: calc(var(--uui-radio-button-size) / 2);
        background-color: var(--uui-interface-selected, #1b264f);
        border-radius: 100%;
        position: absolute;
        top: calc(var(--uui-radio-button-size) / 2);
        left: calc(var(--uui-radio-button-size) / 2);
        transform: translate(-50%, -50%) scale(0);
        transition: all 0.15s ease-in-out;
      }

      input:checked ~ #button::after {
        transform: translate(-50%, -50%) scale(1);
      }

      label:hover #button {
        border: 1px solid var(--uui-interface-border-hover, #c4c4c4);
      }

      input:checked ~ #button {
        border: 1px solid var(--uui-interface-selected, #1b264f);
      }

      input:checked:hover ~ #button {
        border: 1px solid var(--uui-interface-selected-hover, #2152a3);
      }

      input:checked:hover ~ #button::after {
        background-color: var(--uui-interface-selected-hover, #2152a3);
      }

      input:disabled ~ #button {
        border: 1px solid var(--uui-interface-border-disabled);
      }

      input:disabled ~ #label {
        color: var(--uui-interface-contrast-disabled);
      }

      :host([disabled]) label {
        cursor: default;
      }

      :host([disabled]) input:checked ~ #button {
        border: 1px solid var(--uui-interface-selected-disabled);
      }

      :host([disabled]) input:checked ~ #button::after {
        background-color: var(--uui-interface-selected-disabled);
      }

      :host([disabled]) #button:active {
        animation: ${UUIHorizontalShakeAnimationValue};
      }
    `,
  ];

  @query('#input')
  private inputElement!: HTMLInputElement;

  @property({ type: String, reflect: true })
  public name = '';

  //private _value: FormDataEntryValue = '';
  @property({ type: String, reflect: true })
  public value = '';
  // get value() {
  //   return this._value;
  // }
  // set value(newVal) {
  //   const oldValue = this._value;
  //   this._value = newVal;
  //   this.requestUpdate('value', oldValue);
  // }

  @property({ type: String })
  public label = '';

  //private _checked = false;
  @property({ type: Boolean, reflect: true })
  public checked = false;
  // get checked() {
  //   return this._checked;
  // }

  // set checked(newVal) {
  //   const oldValue = this._checked;
  //   this._checked = newVal;
  //   this.requestUpdate('checked', oldValue);
  // }

  @property({ type: Boolean, reflect: true })
  public disabled = false;

  private _onChange() {
    if (this.inputElement.checked) this.check();
    else this.uncheck();
    this.dispatchEvent(new UUIRadioChangeEvent());
  }

  public uncheck() {
    if (this.disabled) return;
    this.checked = false;
    this.setAttribute('tabindex', '-1');
    this.setAttribute('aria-checked', 'false');
  }

  public check() {
    if (this.disabled) return;
    this.checked = true;
    this.setAttribute('tabindex', '0');
    this.setAttribute('aria-checked', 'true');
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute('role')) this.setAttribute('role', 'radio');
    if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '-1');
    if (!this.hasAttribute('aria-checked'))
      this.setAttribute('aria-checked', 'false');
  }

  render() {
    return html` <label id="radio-label">
      <input
        id="input"
        aria-labelledby="radio-label"
        type="radio"
        name=${this.name}
        value=${this.value}
        .checked=${this.checked}
        .disabled=${this.disabled}
        @change=${this._onChange}
      />
      <div id="button"></div>
      <div id="label">
        ${this.label ? html`<span>${this.label}</span>` : html`<slot></slot>`}
      </div>
    </label>`;
  }
}
