const express = require("express");
const cors = require("cors");

class App {
  constructor() {
    this.app = express();
  }

  server() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors({ origin: true }));
    this.app.use(express.json());

    this.modules();
    this.notFound();

    return this.app;
  }

  modules() {
    this.app.use("/auth", require("./modules/auth/authController"));
    this.app.use("/projects", require("./modules/projects/projectsController"));
    this.app.use("/users", require("./modules/users/usersController"));
    this.app.use("/webhook", require("./modules/webhook/webhookController"));
    this.app.use("/reports", require("./modules/reports/reportsController"));
    this.app.use("/crawlers", require("./modules/crawlers/crawlersController"));
  }

  notFound() {
    this.app.use((request, response, next) => {
      next({ status: 404, message: "Rota não encontrada!" });
    });

    this.app.use((error, request, response, next) => {
      response.status(error.status || 500).send({ message: error.message });
    });
  }
}

module.exports = new App().server();
