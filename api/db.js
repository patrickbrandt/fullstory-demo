const Aws = require('aws-sdk');
const ddb = new Aws.DynamoDB.DocumentClient();

const db = {
  feedback: {
    save: async (sessionId, sessionURL, feedback, sentiment) => {
      // TODO: validate input
      const params = {
        TableName: process.env.FEEDBACK_TABLE_NAME,
        Item: {
          sessionId,
          sessionURL,
          feedback,
          sentiment,
          date: new Date().toISOString(),
        },
      };

      try {
        const putResult = await ddb.put(params).promise();
        console.log(`feedback saved for sessionId: ${sessionId}`);
        return putResult;
      } catch (e) {
        console.log(`error saving feedback: ${JSON.stringify(e)}`);
        throw e;
      }
    },
    get: async (sentimentFilter = ['POSITIVE', 'NEGATIVE', 'NEUTRAL', 'MIXED', 'RAGE']) => {
      const KeyConditionExpression =  sentimentFilter.reduce((acc, value, index) => {
        return acc + `#sentiment = :filter${index + 1}` + (index < sentimentFilter.length - 1 ? ' or ' : '')
      }, '');

      const ExpressionAttributeValues = sentimentFilter.reduce((acc, value, index) => {
        acc[`:filter${index + 1}`] = value;
        return acc;
      }, {});

      const ExpressionAttributeNames = { '#sentiment' : 'sentiment' };

      const params = {
        TableName: process.env.FEEDBACK_TABLE_NAME,
        IndexName: 'sentiment-index',
        KeyConditionExpression,
        ExpressionAttributeValues,
        ExpressionAttributeNames,
      };

      try {
        const data = await ddb.query(params).promise();
        console.log(`retrieved feedback from ddb ${JSON.stringify(data)}`);
        return data.Items;
      } catch(e) {
        console.log(`error retrieving feedback: ${e}`);
        throw e;
      }
    },
  },
};

module.exports = db;
