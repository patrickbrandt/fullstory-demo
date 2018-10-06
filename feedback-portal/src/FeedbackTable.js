import React, { Component } from 'react';

class FeedbackTable extends Component {
  render() {
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <th>Feedback</th>
              <th>Sentiment</th>
              <th>Date</th>
              <th>Replay Link</th>
            </tr>
            {this.props.Feedback.map(f =>
              <tr>
                <td>{f.feedback}</td>
                <td>{f.sentiment}</td>
                <td>{new Date(f.date).toDateString()}, {new Date(f.date).toLocaleTimeString()}</td>
                <td><a href={f.sessionURL}>View Session</a></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default FeedbackTable;
