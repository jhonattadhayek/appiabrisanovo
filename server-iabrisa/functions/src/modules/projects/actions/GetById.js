const FirebaseService = require("../../../config/firebase");

const { ResponseCodesEnum } = require("../../../enums/ResponseCodesEnum");

const translate = require("../../../translate");
const sendErrors = require("../../../helpers/sendErrors");

class GetById {
  constructor(request, response) {
    this.request = request;
    this.response = response;
    this.lang = request.query.lang || "pt_br";
    this.translate = translate;
    this.adminSdk = new FirebaseService();
  }

  async init() {
    try {
      const { id } = this.request.params;

      const dbRef = this.adminSdk.dbProjects().doc(id);
      const project = await dbRef.get();

      if (!project.exists) {
        return this.handlePermissionDenied();
      }

      return this.response
        .status(ResponseCodesEnum.OK)
        .send(Object.assign(project.data(), { id: project.id }));
    } catch (error) {
      return this.handleInternalError(error);
    }
  }

  handleValidationErrors(fail) {
    sendErrors(this.response, {
      status: ResponseCodesEnum.BAD_REQUEST,
      messageKey: "invalid_constraints",
      additionalData: { errors: fail?.errors }
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
  const byIdInstance = new GetById(request, response);
  byIdInstance.init();
};
