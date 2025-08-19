import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Minha API AQUI',
      version: '1.0.0',
      description: 'Documentação da API com Swagger',
    },

    components: {
      securitySchemes: {
        bearerAuth: {
          bearerFormat: 'JWT',
          scheme: 'bearer',
          type: 'http',
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
  },
  // ⚠️  este path é relativo ao **projeto**, não ao arquivo
  apis: ['src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
