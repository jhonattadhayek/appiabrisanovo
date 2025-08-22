const FirebaseService = require("../../../config/firebase");

const { validator } = require("../../../config/validator");
const { ResponseCodesEnum } = require("../../../enums/ResponseCodesEnum");

const translate = require("../../../translate");
const sendErrors = require("../../../helpers/sendErrors");

class GetNumUsers {
  constructor(request, response) {
    this.request = request;
    this.response = response;
    this.lang = request.query.lang || "pt_br";
    this.translate = translate;
    this.validator = validator;
    this.adminSdk = new FirebaseService();
  }

  async verifyRequest() {
    try {
      const { token } = this.request.params;
      const project = await this.getProject(token);

      if (!project) {
        return sendErrors(this.response, {
          status: ResponseCodesEnum.BAD_REQUEST,
          messageKey: "projects.not_found"
        });
      }

      return this.getUsers(project);
    } catch (error) {
      return this.handleInternalError(error);
    }
  }

  async getProject(token) {
    const queries = [{ filterKey: "token", type: "==", value: token }];

    let dbRef = this.adminSdk.dbProjects();
    dbRef = this.applyFilters(dbRef, queries);

    return await dbRef.get().then(snap => {
      if (!snap.empty) {
        return { ...snap.docs[0].data(), id: snap.docs[0].id };
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

  async getUsers(project) {
    try {
      let { filterKey, filterValue } = this.request.query;

      const filteredDbRef = this.adminSdk
        .dbUsers()
        .where("projectId", "==", project.id)
        .where(filterKey, "==", filterValue)
        .count();

      const usersCount = await filteredDbRef.get().then(doc => {
        return doc.data().count;
      });

      return this.response.status(ResponseCodesEnum.OK).send({
        value: usersCount
      });
    } catch (error) {
      return sendErrors(this.response, {
        status: ResponseCodesEnum.INTERNAL_SERVER_ERROR,
        messageKey: error.message
      });
    }
  }

  handleValidationErrors(fail) {
    sendErrors(this.response, {
      status: ResponseCodesEnum.BAD_REQUEST,
      messageKey: "invalid_constraints",
      additionalData: { errors: fail.errors }
    });
  }

  handlePermissionDenied() {
    sendErrors(this.response, {
      status: ResponseCodesEnum.FORBIDDEN,
      messageKey: "permission_denied"
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
  const getNumUsersInstance = new GetNumUsers(request, response);
  getNumUsersInstance.verifyRequest();
};
