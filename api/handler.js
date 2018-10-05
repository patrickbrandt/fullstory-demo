
const Aws = require('aws-sdk');
const ddb = new Aws.DynamoDB.DocumentClient();
const prehend = new Aws.Comprehend();

module.exports.ping = async (event, context) => {
  return response.create(200, {
      message: 'this is working',
      input: event,
    });
};

// TODO: get sentiment from AWS Comprehend + create GitHub issue for negative sentiment
// with feedback text and FullStory session replay URL
// docs: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Comprehend.html#detectSentiment-property
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
      sentiment: 'PLACEHOLDER',
    },
  };

  try {
    const putResult = await ddb.put(params).promise();
    console.log(`feedback saved: ${putResult}`);
  } catch (e) {
    console.log(`error: ${JSON.stringify(e)}`);
    return response.create(500, e);
  }

  return response.create(200, { sentimentInference } );
};

const sentiment = async (text) => {
  const params = {
    LanguageCode: 'en',
    Text: text,
  };
  const inference = await prehend.detectSentiment(params).promise();
  if (inference.SentimentScore.Negative > .95) {
    inference.Sentiment = 'RAGE';
  }
  return inference;
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

//https://mh9x17nwee.execute-api.us-east-1.amazonaws.com/v1
