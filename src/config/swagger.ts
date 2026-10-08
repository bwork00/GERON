import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GERON Sales Training LMS Platform API',
      version: '1.0.0',
      description: 'Backend REST API for GERON candidate sales training landing page (2nd stage selection).',
      contact: {
        name: 'GERON IT Team',
        email: 'dev@geron-school.kz'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Local Server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT or Token',
          description: 'Pass Candidate Token or Admin JWT token in Authorization header as "Bearer <token>"'
        }
      }
    }
  },
  apis: ['./src/routes/*.ts']
};

export const swaggerSpec = swaggerJSDoc(options);
