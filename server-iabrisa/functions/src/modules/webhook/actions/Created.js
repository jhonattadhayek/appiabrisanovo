const FirebaseService = require("../../../config/firebase");

const { validator } = require("../../../config/validator");
const { ResponseCodesEnum } = require("../../../enums/ResponseCodesEnum");

const translate = require("../../../translate");
const sendErrors = require("../../../helpers/sendErrors");

class Created {
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
      const { body } = this.request;

      console.log("CREATED =>", body.data);

      await this.adminSdk.dbUsers().add({
        stakbroker: {
          userId: body.data.userId,
          tenantId: body.data.tenantId,
          affiliateId: body.data.affiliateId || null,
          language: body.data.country || null
        },
        name: body.data.name || null,
        phone: body.data.phone || null,
        email: body.data.email,
        phoneCountryCode: body.data.phoneCountryCode || null,
        country: body.data.country || null,
        actived: true,
        createdAt: Date.now(),
        projectId: "eQa4Iky8JbHLJtIh1Z15",
        signature: "free"
      });

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
  const createdInstance = new Created(request, response);
  createdInstance.init();
};
