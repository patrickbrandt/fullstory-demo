import React, { Component } from 'react';
import './App.css';
import FeedbackList from './FeedbackList';
import SentimentFilter from './SentimentFilter';
import ItemCount from './ItemCount';
import LoadSpinner from './LoadSpinner';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedback: [],
      loading: true,
      itemCount: 0,
    };
    this.filters = [];
    this.feedbackAPI = 'https://mh9x17nwee.execute-api.us-east-1.amazonaws.com/v1/feedback';
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  async handleFilterChange(value) {
    const removeAt = this.filters.findIndex(element => element === value);
    if (removeAt > -1) {
      this.filters.splice(removeAt, 1);
    } else {
      this.filters.push(value);
    }    

    const query = `?sentiment=${this.filters.join(',')}`;
    const feedback = await this.getFeedback(query);
    this.setState(() => ({feedback}));
  }

  async componentDidMount() {
    const feedback = await this.getFeedback();
    this.setState(state => ({feedback}));
    this.setState(state => (state.loading = false));
  }

  async getFeedback(query) {
    this.setState(state => state.loading = true);
    const response = await fetch(this.feedbackAPI + (query ? query : ''), {
      method: 'GET'
    });
    const data = await response.json();
    this.setState(state => state.loading = false);
    this.setState(state => (state.itemCount = data.length));
    return data;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Feedback Sentiment</h1>
        </header>
        <SentimentFilter onFilterChange={this.handleFilterChange} />
        <ItemCount count={this.state.itemCount} />
        <LoadSpinner loading={this.state.loading} />
        {this.state.feedback.length > 0 ? (
          <FeedbackList feedback={this.state.feedback}></FeedbackList>
        ) : (
          <p>I haven't received any feedback yet. Please go here and send some: <a href="https://wpb.is/FullStory">https://wpb.is/FullStory</a></p>
        )}
        <footer></footer>
      </div>
    );
  }
}

export default App;
