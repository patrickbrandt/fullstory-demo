
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

export class Feedback extends PolymerElement {
  constructor() {
    super();
    this.feedbackAPI = 'https://mh9x17nwee.execute-api.us-east-1.amazonaws.com/v1/feedback';
  }

  static get properties () {
    return {
      visible: {
        type: Boolean,
        value: false,
      },
      FS: {
        type: Object,
        observer: '_fsChanged',
      }
    };
  }

  _fsChanged() {
    console.log('FS was set in feedback form');
  }

  handleFeedbackClick() {
    this.toggleForm();
  }

  async handleSendClick() {
    this.toggleForm();
    const feedback = this.$.feedback.value;
    if (feedback === '') {
      return;
    }
    const sessionId = this.FS.getCurrentSession();
    const sessionURL = this.FS.getCurrentSessionURL(true);
    const response = await fetch(this.feedbackAPI, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
          'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        sessionId,
        feedback,
        sessionURL,
      }),
    });
    console.log(JSON.stringify(await response.json()));
    this.$.feedback.value = '';
  }

  toggleForm() {
    if (this.visible) {
      this.style.right = '-340px';
    } else {
      this.$.feedback.focus();
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
        <button id="send" on-click="handleSendClick">send</button>
      </div>
    `;
  }
}

customElements.define('feedback-form', Feedback);
