const swaggerJsdoc = require("swagger-jsdoc");
const options = {
    definition: {
      openapi: "3.1.0",
      info: {
        title: "Tradify Express API with Swagger",
        version: "0.1.0",
        description:
          "This is a Tradify API  made with Express and documented with Swagger",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        },
        contact: {
          name: "Trio-s Software Consultancy Pvt Ltmd",
          url: "https://trio-s.com/",
          email: "kani@trio-s.com",
        },
      },
      servers: [
        {
          url: "http://localhost:8100",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            name: "authorization",
            scheme: "bearer",
            in: "header"
          },
          csrfToken:{
            type: "apiKey",
            name: "x-csrf-token",
            in: "header",
            scheme: "basic",
          },
        },
      },
      security: [
        {
          bearerAuth: [],
          csrfToken:[],
        },
      ],
    },
    apis: ["./swaggerDoc/*js"],
  };

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;