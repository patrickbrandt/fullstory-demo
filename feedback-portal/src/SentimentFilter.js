import React, { Component } from 'react';

class SentimentFilter extends Component {
  constructor(props) {
    super(props);
    this.handleFilterSelect = this.handleFilterSelect.bind(this);
  }

  handleFilterSelect(e) {
    this.props.onFilterChange(e);
  }

  render() {
    return (
      <ul>
        <li><label><input type="checkbox" id="Positive" value="POSITIVE" onClick={this.handleFilterSelect} />Positive</label></li>
        <li><label><input type="checkbox" id="Neutral" value="NEUTRAL" onClick={this.handleFilterSelect} />Neutral</label></li>
        <li><label><input type="checkbox" id="Mixed" value="MIXED" onClick={this.handleFilterSelect} />Mixed</label></li>
        <li><label><input type="checkbox" id="Negative" value="NEGATIVE" onClick={this.handleFilterSelect} />Negative</label></li>
        <li><label><input type="checkbox" id="Rage" value="RAGE" onClick={this.handleFilterSelect} />Rage</label></li>
      </ul>
    );
  }
}

export default SentimentFilter;
