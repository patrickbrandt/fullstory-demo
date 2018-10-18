const Aws = require('aws-sdk'); // eslint-disable-line import/no-unresolved
const xss = require('xss');
const github = require('./github');
const db = require('./db');
const Response = require('./Response');

const prehend = new Aws.Comprehend();
const response = new Response();

const sentiment = async (text) => {
  const params = {
    LanguageCode: 'en',
    Text: text,
  };

  try {
    const inference = await prehend.detectSentiment(params).promise();
    if (inference.SentimentScore.Negative > 0.95) {
      inference.Sentiment = 'RAGE';
    }
    return inference;
  } catch (e) {
    console.log(`error with sentiment inference: ${e}`);
    throw e;
  }
};

const makeTitle = (feedback) => {
  const maxLength = 6;
  const splitFeedback = feedback.split(' ');
  if (splitFeedback.length > maxLength) {
    return `${feedback.split(' ').splice(0, maxLength).join(' ')}...`;
  }
  return feedback;
};

const addSessionURL = (sessionURL, feedback) => {
  const callToAction = `\n\nView FullStory session replay:\n${sessionURL}`;
  return feedback + callToAction;
};

module.exports.ping = async () => response.create(200, {
  message: 'this is working',
});

module.exports.save = async (event) => {
  // TODO: validate input
  const body = JSON.parse(event.body);
  const sentimentInference = await sentiment(body.feedback);

  let ghResponse;
  if (sentimentInference.Sentiment === 'NEGATIVE' || sentimentInference.Sentiment === 'RAGE') {
    ghResponse = await github.issue.create(makeTitle(body.feedback),
      addSessionURL(body.sessionURL, body.feedback));
  }

  // NOTE: if a session user is deleted in FullStory,
  // their browser sessionId and sessionURL will be null
  // ALSO: sessionId will be null if one's FullStory pro trial has expired ;)
  const sessionId = body.sessionId || 'no-id-from-client';
  try {
    await db.feedback.save(sessionId,
      body.sessionURL,
      body.feedback,
      sentimentInference.Sentiment,
      ghResponse ? ghResponse.html_url : undefined);
  } catch (e) {
    console.log(`error: ${JSON.stringify(e)}`);
    return response.genericError();
  }

  return response.create(200, ghResponse || { message: '😊 only happy thoughts 😊' });
};

module.exports.get = async (event) => {
  const qstring = event.queryStringParameters;
  let filter;
  if (qstring) {
    filter = qstring.sentiment;
  }

  // TODO: validate that filter has expected values

  try {
    const feedback = filter ? await db.feedback.get(filter.split(',')) : await db.feedback.get();
    feedback.feedback = xss(feedback.feedback);
    feedback.sessionURL = xss(feedback.sessionURL);
    return response.create(200, feedback);
  } catch (e) {
    console.log(`error: ${e}`);
    return response.genericError();
  }
};
