const FirebaseService = require("../../../config/firebase");

const { validator } = require("../../../config/validator");
const { ResponseCodesEnum } = require("../../../enums/ResponseCodesEnum");
const { generateProjects } = require("../common/generateProjects");

const sendErrors = require("../../../helpers/sendErrors");
const translate = require("../../../translate");

class CreateProjects {
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
      authId: "required|string",
      type: "required|string",
      format: "required|string"
    };

    this.validator(this.request.body, constraints, (fail, success) => {
      if (success) return this.verifyRequest();

      return this.handleValidationErrors(fail);
    });
  }

  async verifyRequest() {
    try {
      const { authId } = this.request.body;

      if (authId !== "43ca0c03-9630-4025-a048-de948ab01308") {
        return this.handlePermissionDenied();
      }

      await this.create();
    } catch (error) {
      this.handleInternalError(error);
    }
  }

  async create() {
    try {
      const { type, format } = this.request.body;

      const project = await generateProjects(type, format);

      if (!project) {
        return sendErrors(this.response, {
          status: ResponseCodesEnum.BAD_REQUEST,
          messageKey: "projects.invalid_model"
        });
      }

      this.response.status(ResponseCodesEnum.OK).send(project);
    } catch (error) {
      this.handleInternalError(error);
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
  const createProjectsInstance = new CreateProjects(request, response);
  createProjectsInstance.init();
};
