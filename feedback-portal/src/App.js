import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import FeedbackList from './FeedbackList';
import SentimentFilter from './SentimentFilter';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedback: [],
      loading: true,
    };
    this.filters = [];
    this.feedbackAPI = 'https://mh9x17nwee.execute-api.us-east-1.amazonaws.com/v1/feedback';
    this.handleFilterSelect = this.handleFilterSelect.bind(this);
  }

  async handleFilterSelect(e) {
    const value = e.target.value;
    if (e.target.checked) {
      this.filters.push(value);
    } else {
      const removeAt = this.filters.findIndex(element => element === value);
      this.filters.splice(removeAt, 1);
    }

    const query = `?filter=${this.filters.join(',')}`;
    const response = await fetch(this.feedbackAPI + query, {
      method: 'GET'
    });
    const feedback = await response.json();
    this.setState(state => ({feedback}));
  }

  async componentDidMount() {
    const response = await fetch(this.feedbackAPI, {
      method: 'GET'
    });
    const feedback = await response.json();
    this.setState(state => ({feedback}));
    this.setState(state => (state.loading = false));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Feedback Sentiment</h1>
        </header>
        <SentimentFilter onFilterChange={this.handleFilterSelect} />
        {this.state.feedback.length > 0 && !this.state.loading ? (
          <FeedbackList Feedback={this.state.feedback}></FeedbackList>
        ) : (
          <p>I haven't received any feedback yet. Please go here and send some: <a href="https://wpb.is/FullStory">https://wpb.is/FullStory</a></p>
        )}
        <footer></footer>
      </div>
    );
  }
}

export default App;
