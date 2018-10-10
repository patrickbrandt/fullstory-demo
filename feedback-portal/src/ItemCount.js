import React, { Component } from 'react';

class  ItemCount extends Component {
  render() {
    return (
        <h3 className="issueCount">{this.props.count} items</h3>
    )};
}

export default ItemCount;
