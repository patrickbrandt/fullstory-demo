
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class Feedback extends PolymerElement {
  static get properties () {
    return {
      visible: {
        type: Boolean,
        value: false,
      }
    };
  }

  handleFeedbackClick() {
    this.toggleForm();
  }

  async handleSaveClick() {
    //TODO: make API call
    //const response = await fetch('http://www.google.com');
    console.log(this.$.feedback.value);
    this.$.feedback.value = '';
    this.toggleForm();
  }

  toggleForm() {
    if (this.visible) {
      this.style.right = '-340px';
    } else {
      this.style.right = '0';
    }
    this.visible = !this.visible;
  }

  static get template () {
    return html`
      <style>
        :host {
          position: fixed;
          bottom: 50px;
          right: -340px;
          transition-property: right;
          transition-duration: 0.15s;
          transition-timing-function: ease-in;
        }
        #container {
          padding-right: 1em;
        }
        #handle {
          transform: rotate(-90deg);
          position: absolute;
          left: -40px;
          top: 20px;
          cursor: pointer;
        }
        button {
          display: block;
          right: 0;
        }
      </style>
      <div id="container">
        <div id="handle" on-click="handleFeedbackClick">feedback</div>
        <textarea rows="10" cols="50" id="feedback"></textarea>
        <button id="save" on-click="handleSaveClick">save</button>
      </div>
    `;
  }
}

customElements.define('feedback-form', Feedback);
