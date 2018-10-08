const Aws = require('aws-sdk');
const prehend = new Aws.Comprehend();
const github = require('./github');
const db = require('./db');
const Response = require('./Response');
const response = new Response();

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

  let ghResponse;
  if (sentimentInference.Sentiment === 'NEGATIVE' || sentimentInference.Sentiment === 'RAGE') {
    ghResponse = await github.issue.create(makeTitle(body.feedback), addSessionURL(body.sessionURL, body.feedback));
  }

  // NOTE: if a session user is deleted in FullStory, their browser sessionId and sessionURL will be null
  try {
    await db.feedback.save(
      body.sessionId,
      body.sessionURL,
      body.feedback,
      sentimentInference.Sentiment,
      ghResponse ? ghResponse.html_url : undefined);
  } catch (e) {
    console.log(`error: ${JSON.stringify(e)}`);
    return response.genericError();
  }

  return response.create(200, ghResponse || { message: '😊 only happy thoughts 😊' } );
};

module.exports.get = async (event, context) => {
  const qstring = event.queryStringParameters;
  let filter;
  if(qstring) {
    filter = qstring.filter;
  }

  //TODO: validate that filter has expected values

  try {
    const feedback = filter ? await db.feedback.get(filter.split(',')) : await db.feedback.get();
    return response.create(200, feedback);
  } catch(e) {
    console.log(`error: ${e}`);
    return response.genericError();
  }
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

/*
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
};*/
