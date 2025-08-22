const express = require("express");
const router = express.Router();

const { CheckAccessTokenAdmin } = require("../../middlewares/CheckAccessToken");

const CreateProjects = require("./actions/CreateProjects");
const GetByUsers = require("./actions/GetByUsers");
const GetById = require("./actions/GetById");
const ListGames = require("./actions/ListGames");
const UpdateProject = require("./actions/UpdateProject");
const AddDomains = require("./actions/AddDomains");
const UpdateDomains = require("./actions/UpdateDomains");
const AddBanners = require("./actions/AddBanners");
const UpdateBanners = require("./actions/UpdateBanners");
const AddMenu = require("./actions/AddMenu");
const UpdateMenu = require("./actions/UpdateMenu");

class Projects {
  router() {
    router.post("/create", (req, res) => {
      return CreateProjects(req, res);
    });

    router.get("/users", (req, res) => {
      return GetByUsers(req, res);
    });

    router.get("/id/:id", CheckAccessTokenAdmin, (req, res) => {
      return GetById(req, res);
    });

    router.get("/games/:type/:format", (req, res) => {
      return ListGames(req, res);
    });

    router.post("/banners/:id", CheckAccessTokenAdmin, (req, res) => {
      return AddBanners(req, res);
    });

    router.patch("/banners/:id", CheckAccessTokenAdmin, (req, res) => {
      return UpdateBanners(req, res);
    });

    router.post("/menu/:id", CheckAccessTokenAdmin, (req, res) => {
      return AddMenu(req, res);
    });

    router.patch("/menu/:id", CheckAccessTokenAdmin, (req, res) => {
      return UpdateMenu(req, res);
    });

    router.post("/domains/:id", CheckAccessTokenAdmin, (req, res) => {
      return AddDomains(req, res);
    });

    router.patch("/domains/:id", CheckAccessTokenAdmin, (req, res) => {
      return UpdateDomains(req, res);
    });

    router.patch("/update/:id", CheckAccessTokenAdmin, (req, res) => {
      return UpdateProject(req, res);
    });

    return router;
  }
}

module.exports = new Projects().router();
