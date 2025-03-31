import paths from './paths';
import schemas from './schemas';
import parameters from './parameters';

export = {
  openapi: '3.0.0',
  info: {
    title: 'Celeris API',
    version: '1.0.0',
    description: 'API documentation for the Metallix platform',
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Development server',
    },
    {
      url: 'https://api.celeris.studio',
      description: 'Production server',
    },
  ],
  paths,
  components: {
    schemas,
    parameters,
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your access token with Bearer prefix (e.g. "Bearer eyJhbG..."). Access tokens are short-lived and can be refreshed using the refresh token obtained during login.'
      }
    }
  },
  tags: [],
};