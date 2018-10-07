import React, { Component } from 'react';
import FeedbackListItem from './FeedbackListItem';

class FeedbackList extends Component {
  render() {
    return (
      <React.Fragment>
      {this.props.Feedback.map((f, i) =>
        <FeedbackListItem item={f} key={i} />
      )}
      </React.Fragment>
    );
  }
}


export default FeedbackList;
