const request = require('request-promise-native');
const jwt = require('jsonwebtoken');

const baseRequest = request.defaults({
  baseUrl: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github.machine-man-preview+json',
    'User-Agent': 'fullstory-feedback',
    },
});

const makeJWT = () => {
  const issued = Math.floor(Date.now() / 1000);
  const payload = {
    iat: issued,
    exp: issued + (10 * 60),
    iss: process.env.GITHUB_APP_ID,
  };
  console.log(`creating JWT`);
  try {
    return jwt.sign(payload, process.env.SIGNING_KEY, { algorithm: 'RS256' });
  } catch(e) {
    console.log(`error creating JWT: ${e}`);
    throw e;
  }
};

const authRequest = (token) => {
  return baseRequest.defaults({
    headers: { Authorization: `Bearer ${token}` },
  });
};

const getAccessToken = async () => {
  // https://developer.github.com/v3/apps/#find-installations
  // TODO: cache access_token and only make /access_tokens service request on a cache miss
  const ghResponse = await authRequest(makeJWT()).post(`/app/installations/${process.env.INSTALLATION_ID}/access_tokens`);
  return JSON.parse(ghResponse);
};

const createIssue = async (title, text) => {
  let ghResponse;
  try {
    console.log('getting access token for the installation from GitHub');
    // https://developer.github.com/v3/apps/#find-installations
    ghResponse = await getAccessToken();

    // read this: https://developer.github.com/v3/apps/available-endpoints/
    ghResponse = await authRequest(ghResponse.token).post({
      url: '/repos/patrickbrandt/fullstory-demo/issues', // TODO: parameterize --> /repos/:owner/:repo/issues
      json: {
        title,
        body: text,
        labels: ['negative-feedback'],
      },
    });
  } catch(e) {
    console.log(`there was an error creating an issue: ${e}`);
    throw e;
  }
  return ghResponse;
};

module.exports = {
  issue: {
    create: createIssue,
  },
};

