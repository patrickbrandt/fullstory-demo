import React, { Component } from 'react';

class LoadSpinner extends Component {
  render() {
    return (
      <div className='spinner'>
        {this.props.loading &&
          <div>Loading...</div>
        }
      </div>
    )
  }
}

export default LoadSpinner;
