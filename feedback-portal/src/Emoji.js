import React, { Component } from 'react';

class Emoji extends Component {
  render() {
    return (
      <div className="sentiment">
        <span
          role="img"
          aria-label={this.props.sentiment ? this.props.sentiment : ''}
          aria-hidden={this.props.sentiment ? 'false' : 'true'}
        >
          {this.props.symbol}
        </span>
        {this.props.sentiment}
      </div>
    );
  }
}

export default Emoji;
