const express = require("express");
const router = express.Router();

const { CheckAccessTokenAdmin } = require("../../middlewares/CheckAccessToken");

const EmailLogin = require("./actions/EmailLogin");
const CurrentUser = require("./actions/CurrentUser");

class Auth {
  router() {
    router.get("/current-user", CheckAccessTokenAdmin, (request, response) => {
      return CurrentUser(request, response);
    });

    router.post("/login/email", (request, response) => {
      return EmailLogin(request, response);
    });

    return router;
  }
}

module.exports = new Auth().router();
