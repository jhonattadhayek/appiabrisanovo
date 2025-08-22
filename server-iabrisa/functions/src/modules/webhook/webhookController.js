const express = require("express");
const router = express.Router();

const Signature = require("./actions/Signature");
const Created = require("./actions/Created");

class Webhook {
  router() {
    router.post("/:platform/:projectId", (request, response) => {
      return Signature(request, response);
    });

    router.post("/create", (request, response) => {
      return Created(request, response);
    });

    return router;
  }
}

module.exports = new Webhook().router();
