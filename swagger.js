const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Gestão de Tarefas",
      version: "1.0.0",
      description: "Documentação da API de Gestão de Tarefas",
    },
  },
  apis: ["./index.js"], // Caminho para os arquivos da API
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
