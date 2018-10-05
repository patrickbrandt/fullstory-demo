
const Aws = require('aws-sdk');
const ddb = new Aws.DynamoDB.DocumentClient();
const prehend = new Aws.Comprehend();
const github = require('./github');


module.exports.ping = async (event, context) => {
  return response.create(200, {
      message: 'this is working',
      input: event,
    });
};

module.exports.save = async (event, context) => {
  const body = JSON.parse(event.body);
  //TODO: validate request body
  const sentimentInference = await sentiment(body.feedback);
  const params = {
    TableName: process.env.FEEDBACK_TABLE_NAME,
    Item: {
      sessionId: body.sessionId,
      date: new Date().toISOString(),
      feedback: body.feedback,
      sentiment: sentimentInference.Sentiment,
    },
  };

  try {
    const putResult = await ddb.put(params).promise();
    console.log(`feedback saved: ${putResult}`);
  } catch (e) {
    console.log(`error: ${JSON.stringify(e)}`);
    return response.create(500, e);
  }


  const ghResponse = await github.createIssue('testing from app', 'this is another test from the app');
  return response.create(200, { ghResponse } );
};

const sentiment = (text) => {
  return new Promise(async (resolve, reject) => {
      const params = {
      LanguageCode: 'en',
      Text: text,
    };
    try {
      const inference = await prehend.detectSentiment(params).promise();
      if (inference.SentimentScore.Negative > .95) {
        inference.Sentiment = 'RAGE';
      }
      resolve(inference);
    } catch (e) {
      reject(e);
    }
  });
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
