import React, { Component } from 'react';

class  IssueCount extends Component {
  render() {
    return (
        <h3 className="issueCount">{this.props.count} issues</h3>
    )};
}

export default IssueCount;
