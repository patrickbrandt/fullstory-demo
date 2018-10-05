
const Aws = require('aws-sdk');
const ddb = new Aws.DynamoDB.DocumentClient();
const prehend = new Aws.Comprehend();
const util = require('util');
const request = require('request-promise-native');
const jwt = require('jsonwebtoken');

//axios.defaults.baseURL = 'https://api.github.com';
//axios.defaults.headers.common['Accept'] = 'application/vnd.github.machine-man-preview+json';
const baseRequest = request.defaults({
  baseUrl: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github.machine-man-preview+json',
    'User-Agent': 'fullstory-test',
    },
});

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


  let ghResponse;
  try {
    ghResponse = await authRequest().post('/app/installations/365557/access_tokens');
    console.log(`/app/installations/365557/access_tokens response: ${ghResponse}`);
    const iRequest = baseRequest.defaults({
      headers: { Authorization: `Bearer ${JSON.parse(ghResponse).token}` },
    });

    // read this: https://developer.github.com/v3/apps/available-endpoints/
    ghResponse = await iRequest.post({
      url: '/repos/patrickbrandt/fullstory-demo/issues',
      json: {
        title: 'made from the app',
        body: 'include feedback text and seesion URL',
      }
    });
  } catch(e) {
    ghResponse = e;
    console.log(`there was an error: ${e}`);
  }
  return response.create(200, { ghResponse } );
};

const authRequest = () => {
  console.log('making JWT');
  const token = makeJWT();
  console.log(`JWT made: ${token}`);

  // https://developer.github.com/v3/apps/#find-installations
  //access_token = await installationRequest.post('/app/installations/365557/access_tokens');
  //console.log(`access_token: ${access_token}`);


  return baseRequest.defaults({
    headers: { Authorization: `Bearer ${token}` },
  });
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

const makeJWT = () => {
  const issued = Math.floor(Date.now() / 1000);
  const payload = {
    iat: issued,
    exp: issued + (10 * 60),
    iss: process.env.GITHUB_APP_ID,
  };
  console.log(`signing JWT`);
  try {
    return jwt.sign(payload, process.env.SIGNING_KEY, { algorithm: 'RS256'});
  } catch(e) {
    console.log(`error creating token: ${e}`);
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

//https://mh9x17nwee.execute-api.us-east-1.amazonaws.com/v1
