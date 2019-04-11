import React, { Component } from 'react';
import Emoji from './Emoji';

class SentimentFilter extends Component {
  constructor(props) {
    super(props);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleFilterClick = this.handleFilterClick.bind(this);
    this.positiveCheck = React.createRef();
    this.neutralCheck = React.createRef();
    this.mixedCheck = React.createRef();
    this.negativeCheck = React.createRef();
    this.rageCheck = React.createRef();

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

  handleCheck(e) {
    this.props.onFilterChange(e);
  }

  handleFilterClick(id) {
    switch (id) {
      case 'positive':
        this.positiveCheck.current.click();
        break;
      case 'neutral':
        this.neutralCheck.current.click();
        break;
      case 'mixed':
        this.mixedCheck.current.click();
        break;
      case 'negative':
        this.negativeCheck.current.click();
        break;
      case 'rage':
        this.rageCheck.current.click();
        break;
    }
    this.toggleFilter(id);
  }

  toggleFilter(id) {
    this.setState(state => state.toggles[id] = !state.toggles[id]);
  }

  render() {
    return (
      <div className='sentimentFilters'>
        <div className={`filter ${this.state.toggles.positive ? 'select' : 'unselect' }`} onClick={e => this.handleFilterClick('positive')}><Emoji symbol='🙂' /><div>Positive</div></div>
        <div className={`filter ${this.state.toggles.neutral ? 'select' : 'unselect' }`} onClick={e => this.handleFilterClick('neutral')}><Emoji symbol='😐' /><div>Neutral</div></div>
        <div className={`filter ${this.state.toggles.mixed ? 'select' : 'unselect' }`} onClick={e => this.handleFilterClick('mixed')}><Emoji symbol='😕' /><div>Mixed</div></div>
        <div className={`filter ${this.state.toggles.negative ? 'select' : 'unselect' }`} onClick={e => this.handleFilterClick('negative')}><Emoji symbol='🙁' /><div>Negative</div></div>
        <div className={`filter ${this.state.toggles.rage ? 'select' : 'unselect' }`} onClick={e => this.handleFilterClick('rage')}><Emoji symbol='😡' /><div>Rage</div></div>

        <input ref={this.positiveCheck} type='checkbox' value='POSITIVE' onClick={this.handleCheck} />
        <input ref={this.neutralCheck} type='checkbox' value='NEUTRAL' onClick={this.handleCheck} />
        <input ref={this.mixedCheck} type='checkbox' value='MIXED' onClick={this.handleCheck} />
        <input ref={this.negativeCheck} type='checkbox' value='NEGATIVE' onClick={this.handleCheck} />
        <input ref={this.rageCheck} type='checkbox' value='RAGE' onClick={this.handleCheck} />
      </div>
    );
  }
}

export default SentimentFilter;
