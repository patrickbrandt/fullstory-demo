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
    console.log(db);
    await db.feedback.save(body.sessionId, body.feedback, sentimentInference.Sentiment);
  } catch (e) {
    console.log(`error: ${JSON.stringify(e)}`);
    return response.create(500, e);
  }

  const ghResponse = await github.issue.create('testing from app', 'this is another test from the app');
  return response.create(200, { ghResponse } );
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
