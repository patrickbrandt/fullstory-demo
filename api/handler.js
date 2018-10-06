const Aws = require('aws-sdk');
const prehend = new Aws.Comprehend();
const github = require('./github');
const db = require('./db');

module.exports.ping = async (event, context) => {
  return response.create(200, {
      message: 'this is working',
      input: event,
    });
};

module.exports.save = async (event, context) => {
  // TODO: validate input
  const body = JSON.parse(event.body);
  const sentimentInference = await sentiment(body.feedback);

  try {
    await db.feedback.save(
      body.sessionId,
      body.sessionURL,
      body.feedback,
      sentimentInference.Sentiment);
  } catch (e) {
    console.log(`error: ${JSON.stringify(e)}`);
    return response.genericError();
  }

  let ghResponse;
  if (sentimentInference.Sentiment === 'NEGATIVE' || sentimentInference.Sentiment === 'RAGE') {
    ghResponse = await github.issue.create(makeTitle(body.feedback), addSessionURL(body.sessionURL, body.feedback));
  }
  return response.create(200, ghResponse || { message: '😊 only happy thoughts 😊' } );
};

const makeTitle = (feedback) => {
  const maxLength = 6;
  const splitFeedback = feedback.split(' ');
  if (splitFeedback.length > maxLength) {
    return feedback.split(' ').splice(0, maxLength).join(' ') + '...';
  }
  return feedback;
};

const addSessionURL = (sessionURL, feedback) => {
  const callToAction = `\n\nView FullStory session replay:\n${sessionURL}`;
  return feedback + callToAction;
};

const sentiment = async (text) => {
  const params = {
    LanguageCode: 'en',
    Text: text,
  };

  try {
    const inference = await prehend.detectSentiment(params).promise();
    if (inference.SentimentScore.Negative > .95) {
      inference.Sentiment = 'RAGE';
    }
    return inference;
  } catch (e) {
    console.log(`error with sentiment inference: ${e}`);
    throw e;
  }
};

const response = {
  create: (statusCode, body, cors = { 'Access-Control-Allow-Origin': '*' }) => {
    return {
      statusCode : statusCode,
      headers: !cors ? {} : cors,
      body: JSON.stringify(body),
    };
  },
  genericError: () => {
    return this.create(500, {
      name: 'server_error',
      message: 'server error'
    });
  },
};
