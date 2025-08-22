const FirebaseService = require("../../../config/firebase");

const { validator } = require("../../../config/validator");
const { ResponseCodesEnum } = require("../../../enums/ResponseCodesEnum");
const { FieldValue } = require("firebase-admin/firestore");

const translate = require("../../../translate");
const sendErrors = require("../../../helpers/sendErrors");

class AddDomains {
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

      if (project.data().domains.some(domain => domain.url === body.url)) {
        return sendErrors(this.response, {
          status: ResponseCodesEnum.FORBIDDEN,
          messageKey: "projects.domain_already_exists"
        });
      }

      return this.create(project.data());
    } catch (error) {
      return this.handleInternalError(error);
    }
  }

  async create(project) {
    try {
      const { body } = this.request;
      const { id } = this.request.params;

      const dbRef = this.adminSdk.dbProjects().doc(id);
      const isDomainsEmpty = project.domains.length === 0;

      const newDomainData = {
        actived: false,
        url: body.url
      };

      await dbRef
        .update({ domains: FieldValue.arrayUnion(newDomainData) })
        .catch(error => {
          throw new Error(error.code);
        });

      if (isDomainsEmpty) {
        await dbRef.update({
          dns: { conected: true, domain: body.url }
        });
      }

      project.domains.push(newDomainData);

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
  const addDomainsInstance = new AddDomains(request, response);
  addDomainsInstance.init();
};
