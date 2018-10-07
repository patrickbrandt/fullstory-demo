import React, { Component } from 'react';
import Emoji from './Emoji';

class FeedbackListItem extends Component {
  render() {
    let sentimentEmoji;
    switch (this.props.item.sentiment) {
      case 'POSITIVE':
        sentimentEmoji = <Emoji sentiment='Positive' symbol='🙂' />
        break;
      case 'NEUTRAL':
        sentimentEmoji = <Emoji sentiment='Neutral' symbol='😐' />
        break;
      case 'MIXED':
        sentimentEmoji = <Emoji sentiment='Mixed' symbol='😕' />
        break;
      case 'NEGATIVE':
        sentimentEmoji = <Emoji sentiment='Negative' symbol='☹️' />
        break;
      case 'RAGE':
        sentimentEmoji = <Emoji sentiment='Rage' symbol='😡' />
        break;
    }

    const feedback = this.props.item.feedback;
    const feedbackDate = this.props.item.date;
    const sessionURL = this.props.item.sessionURL;
    console.log(feedback)
    return (
      <div className='feedbackItem'>
        <h4>{feedback}</h4>
        {sentimentEmoji}
        <div className='date'>
          <h4>{new Date(feedbackDate).toDateString()}</h4>
          <h5>{new Date(feedbackDate).toLocaleTimeString()}</h5>
        </div>
        <div className='replayLink'>
          <a href={sessionURL}>View Replay</a>
        </div>
      </div>
    );
  }
}


export default FeedbackListItem;
