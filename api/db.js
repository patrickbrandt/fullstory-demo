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
  },
};

module.exports = db;
