const express = require("express");
const router = express.Router();

const Investing = require("./actions/Investing");

class Crawlers {
  router() {
    router.get("/investing", (request, response) => {
      return Investing(request, response);
    });

    return router;
  }
}

module.exports = new Crawlers().router();
