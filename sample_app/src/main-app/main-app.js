import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import './feedback.js';

/**
 * @customElement
 * @polymer
 */
class MainApp extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <h2>Hello [[prop1]]!</h2>
      <feedback-form/>
    `;
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'main-app'
      }
    };
  }
}

window.customElements.define('main-app', MainApp);
