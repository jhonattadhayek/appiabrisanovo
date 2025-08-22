const express = require("express");
const router = express.Router();

const GetNumUsers = require("./actions/GetNumUsers");
const UsersCountByDay = require("./actions/UsersCountByDay");

class Reports {
  router() {
    router.get("/num-users/:token", (req, res) => {
      return GetNumUsers(req, res);
    });

    router.get("/users-by-day/:token", (req, res) => {
      return UsersCountByDay(req, res);
    });

    return router;
  }
}

module.exports = new Reports().router();
