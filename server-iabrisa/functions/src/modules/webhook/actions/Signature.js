const FirebaseService = require("../../../config/firebase");

const { validator } = require("../../../config/validator");
const { ResponseCodesEnum } = require("../../../enums/ResponseCodesEnum");

const translate = require("../../../translate");
const sendErrors = require("../../../helpers/sendErrors");
const validateSignature = require("../common/validateSignature");

class Signature {
  constructor(request, response) {
    this.request = request;
    this.response = response;
    this.lang = request.query.lang || "pt_br";
    this.translate = translate;
    this.validator = validator;
    this.adminSdk = new FirebaseService();
  }

  async init() {
    try {
      const { projectId, platform } = this.request.params;
      const { body } = this.request;

      console.log("SIGNATURE =>", body);

      await validateSignature(projectId, platform, body);

      this.response.status(ResponseCodesEnum.OK).send({ status: true });
    } catch (error) {
      return this.handleInternalError(error);
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
  const signatureInstance = new Signature(request, response);
  signatureInstance.init();
};
