const express = require("express");
const router = express.Router();

const { CheckAccessToken } = require("../../middlewares/CheckAccessToken");

const UserLogin = require("./actions/UserLogin");
const CurrentUser = require("./actions/CurrentUser");
const ListUsers = require("./actions/ListUsers");
const UpdateUsers = require("./actions/UpdateUsers");

class Users {
  router() {
    router.get("/me", CheckAccessToken, (request, response) => {
      return CurrentUser(request, response);
    });

    router.post("/login", (request, response) => {
      return UserLogin(request, response);
    });

    router.post("/list", (request, response) => {
      return ListUsers(request, response);
    });

    router.patch("/update", (request, response) => {
      return UpdateUsers(request, response);
    });

    return router;
  }
}

module.exports = new Users().router();
