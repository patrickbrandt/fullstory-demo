import React, { Component } from 'react';
import './App.css';
import FeedbackList from './FeedbackList';
import SentimentFilter from './SentimentFilter';
import LoadSpinner from './LoadSpinner';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedback: [],
      loading: true,
    };
    this.filters = [];
    this.feedbackAPI = 'https://mh9x17nwee.execute-api.us-east-1.amazonaws.com/v1/feedback';
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  async componentDidMount() {
    const { feedback } = await this.getFeedback();
    this.setState(() => ({ feedback }));
    this.setState((state) => { state.loading = false; });
  }

  async getFeedback(query) {
    this.setState((state) => { state.loading = true; });
    const response = await fetch(this.feedbackAPI + (query || ''), {
      method: 'GET',
    });
    const data = await response.json();
    this.setState((state) => { state.loading = false; });
    return data;
  }

  async handleFilterChange(e) {
    const val = e.target.value;
    if (e.target.checked) {
      this.filters.push(val);
    } else {
      const removeAt = this.filters.findIndex(element => element === val);
      this.filters.splice(removeAt, 1);
    }

    const query = `?filter=${this.filters.join(',')}`;
    const feedback = await this.getFeedback(query);
    this.setState(() => ({ feedback }));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Feedback Sentiment</h1>
        </header>
        <SentimentFilter onFilterChange={this.handleFilterChange} />
        <LoadSpinner loading={this.state.loading} />
        {this.state.feedback.length > 0 ? (
          <FeedbackList feedback={this.state.feedback} />
        ) : (
          <p>
            I haven
            {'\''}
            t received any feedback yet. Please go here and send some:
            <a href="https://wpb.is/FullStory">https://wpb.is/FullStory</a>
          </p>
        )}
        <footer />
      </div>
    );
  }
}

export default App;
