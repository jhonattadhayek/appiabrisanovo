const FirebaseService = require("../../../config/firebase");

const { validator } = require("../../../config/validator");
const { ResponseCodesEnum } = require("../../../enums/ResponseCodesEnum");
const { bucket } = require("../../../config/bucket");

const translate = require("../../../translate");
const sendErrors = require("../../../helpers/sendErrors");

class UpdateBanners {
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
      cta: "required|string",
      URL: "required|string",
      description: "string",
      title: "required|string",
      id: "required|string",
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
        project.pages.more = project.pages.more.filter(
          menu => menu.id !== body.id
        );

        await dbRef
          .update({ "pages.more": project.pages.more })
          .catch(error => {
            throw new Error(error.code);
          });
      } else {
        const regex = /^https:\/\/firebasestorage\.googleapis\.com/;

        if (body.image && !regex.test(body.image)) {
          body.image = await bucket.upload({
            file: body.image,
            pathname: `apps/${id}/more/${body.id}}`
          });
        }

        body.image = body.image || null;
        delete body.token;

        const index = project.pages.more.findIndex(menu => menu.id === body.id);

        project.pages.more[index] = Object.assign(
          project.pages.more[index],
          body
        );

        await dbRef
          .update({ "pages.more": project.pages.more })
          .catch(error => {
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
  const updateBannersInstance = new UpdateBanners(request, response);
  updateBannersInstance.init();
};
