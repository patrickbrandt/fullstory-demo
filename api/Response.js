class Response {
  create(statusCode, body, cors = { 'Access-Control-Allow-Origin': '*' }) {
    return {
      statusCode,
      headers: !cors ? {} : cors,
      body: JSON.stringify(body),
    };
  }

  genericError() {
    return this.create(500, {
      error: {
        name: 'server_error',
        message: 'server error',
      },
    });
  }
}

module.exports = Response;
