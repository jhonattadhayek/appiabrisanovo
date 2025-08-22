const functions = require("firebase-functions");
const app = require("./src/app");

const countUsers = require("./src/schedules/countUsers");

module.exports = {
  api: functions.runWith({ memory: "8GB" }).https.onRequest(app),
  countUsers
};
