const request = require('request-promise-native');
const jwt = require('jsonwebtoken');

const baseRequest = request.defaults({
  baseUrl: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github.machine-man-preview+json',
    'User-Agent': 'fullstory-test',
    },
});

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

const authRequest = (token) => {
  return baseRequest.defaults({
    headers: { Authorization: `Bearer ${token}` },
  });
};

const getAccessToken = () => {
  // https://developer.github.com/v3/apps/#find-installations
  return new Promise(async (resolve, reject) => {
    const ghResponse = await authRequest(makeJWT()).post(`/app/installations/${process.env.INSTALLATION_ID}/access_tokens`);
    resolve(JSON.parse(ghResponse));
  });
};

const createIssue = (title, text) => {
  return new Promise(async (resolve, reject) => {
    let ghResponse;
    try {
      console.log('getting access token for the installation from GitHub');
      // https://developer.github.com/v3/apps/#find-installations
      ghResponse = await getAccessToken();
      console.log(`/app/installations/${process.env.INSTALLATION_ID}/access_tokens response: ${JSON.stringify(ghResponse)}`);

      // read this: https://developer.github.com/v3/apps/available-endpoints/
      ghResponse = await authRequest(ghResponse.token).post({
        url: '/repos/patrickbrandt/fullstory-demo/issues',
        json: {
          title,
          body: text,
          labels: ['negative-feedback'],
        }
      });
    } catch(e) {
      console.log(`there was an error: ${e}`);
      reject(e) ;
    }

    resolve(ghResponse);
  });

};

module.exports = {
  createIssue,
};

