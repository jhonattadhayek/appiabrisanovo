const FirebaseService = require("../../../config/firebase");

const { validator } = require("../../../config/validator");
const { ResponseCodesEnum } = require("../../../enums/ResponseCodesEnum");

const translate = require("../../../translate");
const sendErrors = require("../../../helpers/sendErrors");

class UpdateProject {
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
      url: "required|string",
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
      const { id } = this.request.params;

      const dbRef = this.adminSdk.dbProjects().doc(id);
      const project = await dbRef.get();

      if (!project.exists) {
        return this.handlePermissionDenied();
      }

      if (project.data().token !== body.token) {
        return this.handlePermissionDenied();
      }

      return this.update(project.data());
    } catch (error) {
      return this.handleInternalError(error);
    }
  }

  async update(project) {
    try {
      const { body, query } = this.request;
      const { id } = this.request.params;

      const dbRef = this.adminSdk.dbProjects().doc(id);

      if (query.delete && query.delete !== "false") {
        if (project.dns.domain === body.url) {
          return sendErrors(this.response, {
            status: ResponseCodesEnum.FORBIDDEN,
            messageKey: "projects.cannot_delete_default_domain"
          });
        }

        project.domains = project.domains.filter(
          domain => domain.url !== body.url
        );

        await dbRef.update({ domains: project.domains }).catch(error => {
          throw new Error(error.code);
        });
      } else {
        project.dns.domain = body.url;
        project.dns.conected = true;

        await dbRef.update({ dns: project.dns }).catch(error => {
          throw new Error(error.code);
        });
      }

      return this.response.status(ResponseCodesEnum.OK).send({
        project: { ...project, id }
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
  const updateProjectInstance = new UpdateProject(request, response);
  updateProjectInstance.init();
};
