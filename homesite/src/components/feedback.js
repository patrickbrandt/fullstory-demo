
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
      this.style.right = '-355px';
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
          right: -355px;
          transition-property: right;
          transition-duration: 0.15s;
          transition-timing-function: ease-in;
        }
        #container {
          padding-right: 1em;
          background-color: #448EE1;
          padding:1em;
          font-family: sans-serif;
          color: #fff;
          font-size: .9rem;
          width:325px;
        }
        #container p {
          margin-top: .1rem;
        }
        #handle {
          transform: rotate(-90deg);
          position: absolute;
          left: -4.2rem;
          top: 90px;
          cursor: pointer;
          background-color: #448EE1;
          color: #fff;
          padding: .8rem;
          border-top-left-radius: 50%;
          border-top-right-radius: 50%;
          font-family: serif;
          font-size: 1.15rem;
        }
        button {
          display: block;
          border: none;
          margin: 0;
          padding: .5rem 1rem;
          border-radius: 5%;
          text-decoration: none;
          background: #F3874A;
          color: #ffffff;
          font-family: sans-serif;
          font-size: .9rem;
          cursor: pointer;
          text-align: center;
          transition: background 250ms ease-in-out,
                      transform 150ms ease;
        }

        button:hover,
        button:focus {
          background: #0053ba;
        }

        button:focus {
          outline: 1px solid #fff;
          outline-offset: -4px;
        }

        button:active {
          transform: scale(0.99);
        }
      </style>
      <div id="container">
        <div id="handle" on-click="handleFeedbackClick">feedback</div>
        <p>Please let us know how we're doing!</p>
        <textarea rows="10" cols="50" id="feedback"></textarea>
        <button id="send" on-click="handleSendClick">send</button>
      </div>
    `;
  }
}

customElements.define('feedback-form', Feedback);
