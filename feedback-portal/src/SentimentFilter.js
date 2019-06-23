import React, { Component } from 'react';
import Emoji from './Emoji';

class SentimentFilter extends Component {
  constructor(props) {
    super(props);
    this.handleFilterClick = this.handleFilterClick.bind(this);

    this.state = {
      toggles: {
        positive: false,
        neutral: false,
        mixed: false,
        negative: false,
        rage: false,
      },
    }
  }

  handleFilterClick(id) {
    this.props.onFilterChange(id);
    this.toggleFilter(id.toLowerCase());
  }

  toggleFilter(id) {
    this.setState(state => state.toggles[id] = !state.toggles[id]);
  }

  render() {
    return (
      <div className='sentimentFilters'>
        <div className={`filter ${this.state.toggles.positive ? 'select' : 'unselect' }`} onClick={e => this.handleFilterClick('POSITIVE')}><Emoji symbol='🙂' /><div>Positive</div></div>
        <div className={`filter ${this.state.toggles.neutral ? 'select' : 'unselect' }`} onClick={e => this.handleFilterClick('NEUTRAL')}><Emoji symbol='😐' /><div>Neutral</div></div>
        <div className={`filter ${this.state.toggles.mixed ? 'select' : 'unselect' }`} onClick={e => this.handleFilterClick('MIXED')}><Emoji symbol='😕' /><div>Mixed</div></div>
        <div className={`filter ${this.state.toggles.negative ? 'select' : 'unselect' }`} onClick={e => this.handleFilterClick('NEGATIVE')}><Emoji symbol='🙁' /><div>Negative</div></div>
        <div className={`filter ${this.state.toggles.rage ? 'select' : 'unselect' }`} onClick={e => this.handleFilterClick('RAGE')}><Emoji symbol='😡' /><div>Rage</div></div>
      </div>
    );
  }
}

export default SentimentFilter;
