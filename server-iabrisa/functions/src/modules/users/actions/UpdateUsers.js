const FirebaseService = require("../../../config/firebase");

const { validator } = require("../../../config/validator");
const { ResponseCodesEnum } = require("../../../enums/ResponseCodesEnum");

const translate = require("../../../translate");
const sendErrors = require("../../../helpers/sendErrors");

class UpdateUsers {
  constructor(request, response) {
    this.request = request;
    this.response = response;
    this.lang = request.query.lang || "pt_br";
    this.translate = translate;
    this.validator = validator;
    this.adminSdk = new FirebaseService();
  }

  init() {
    const constraints = {
      token: "required|string"
    };

    this.validator(this.request.body, constraints, (fail, success) => {
      if (success) return this.verifyRequest();

      return this.handleValidationErrors(fail);
    });
  }

  async verifyRequest() {
    try {
      const { body } = this.request;

      const dbRef = this.adminSdk.dbProjects().where("token", "==", body.token);
      const project = await dbRef.get();

      if (project.empty) {
        return this.handlePermissionDenied();
      }

      if (project.docs[0].data().token !== body.token) {
        return this.handlePermissionDenied();
      }

      return this.update();
    } catch (error) {
      return this.handleInternalError(error);
    }
  }

  async update() {
    try {
      const { body } = this.request;

      const dbRef = this.adminSdk.dbUsers().doc(body.id);

      delete body.id;
      delete body.token;

      await dbRef.update(body).catch(error => {
        throw new Error(error.code);
      });

      return this.response.status(ResponseCodesEnum.OK).send({ status: true });
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
  const updateUsersInstance = new UpdateUsers(request, response);
  updateUsersInstance.init();
};
