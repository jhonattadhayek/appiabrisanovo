const FirebaseService = require("../../../config/firebase");

const { ResponseCodesEnum } = require("../../../enums/ResponseCodesEnum");
const { StatusProjectEnum } = require("../../../enums/StatusProjectEnum");

const translate = require("../../../translate");
const sendErrors = require("../../../helpers/sendErrors");

class GetByUsers {
  constructor(request, response) {
    this.request = request;
    this.response = response;
    this.lang = request.query.lang || "pt_br";
    this.translate = translate;
    this.adminSdk = new FirebaseService();
  }

  async init() {
    try {
      const project = await this.getProject();

      if (!project) {
        return sendErrors(this.response, {
          status: ResponseCodesEnum.BAD_REQUEST,
          messageKey: "projects.not_found"
        });
      }

      if (project.status !== StatusProjectEnum.actived) {
        return sendErrors(this.response, {
          status: ResponseCodesEnum.BAD_REQUEST,
          messageKey: "projects.disabled"
        });
      }

      if (project.games) {
        const games = Object.entries(project.games).map(([key, value]) => ({
          ...value,
          id: key
        }));

        games.sort((a, b) => {
          if (a.sequence < b.sequence) return -1;
          return 0;
        });

        project.games = games;
      }

      return this.response.status(ResponseCodesEnum.OK).send(project);
    } catch (error) {
      return this.handleInternalError(error);
    }
  }

  async getProject() {
    const { filterKey, filterValue } = this.request.query;

    if (!Array.isArray(filterKey) || filterKey.length !== filterValue.length) {
      return this.handleValidationErrors();
    }

    const queries = [];

    for (const i in filterKey) {
      queries.push({
        filterKey: filterKey[i],
        type: "==",
        value: filterValue[i]
      });
    }

    let dbRef = this.adminSdk.dbProjects();
    dbRef = this.applyFilters(dbRef, queries);

    return await dbRef.get().then(snap => {
      if (!snap.empty) {
        const app = snap.docs[0].data();

        delete app.dns;
        delete app.createdAt;
        delete app.countId;
        delete app.numUsers;
        delete app.token;
        delete app.contact;
        delete app.domains;

        return { ...app, id: snap.docs[0].id };
      }

      return null;
    });
  }

  applyFilters(dbRef, queries) {
    for (const filter of queries) {
      dbRef = dbRef.where(filter.filterKey, filter.type, filter.value);
    }
    return dbRef;
  }

  handleValidationErrors(fail) {
    sendErrors(this.response, {
      status: ResponseCodesEnum.BAD_REQUEST,
      messageKey: "invalid_constraints",
      additionalData: { errors: fail?.errors }
    });
  }

  handleInternalError(error) {
    console.error("Internal Error:", error);
    sendErrors(this.response, {
      status: ResponseCodesEnum.INTERNAL_SERVER_ERROR,
      messageKey: error.message || "unknown_error"
    });
  }
}

module.exports = (request, response) => {
  const byUsersInstance = new GetByUsers(request, response);
  byUsersInstance.init();
};
