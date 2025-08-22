const FirebaseService = require("../../../config/firebase");

const { validator } = require("../../../config/validator");
const { ResponseCodesEnum } = require("../../../enums/ResponseCodesEnum");
const { FieldValue } = require("firebase-admin/firestore");
const { bucket } = require("../../../config/bucket");

const translate = require("../../../translate");
const sendErrors = require("../../../helpers/sendErrors");

class AddBanners {
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
      image: "required|string",
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

      if (body.image) {
        body.image = await bucket.upload({
          file: body.image,
          pathname: `apps/${id}/banners/banner_${
            project.pages.home.banners.length + 1
          }`
        });
      }

      const newBannerData = {
        url: body.url || null,
        image: body.image
      };

      await dbRef
        .update({ "pages.home.banners": FieldValue.arrayUnion(newBannerData) })
        .catch(error => {
          throw new Error(error.code);
        });

      project.pages.home.banners.push(newBannerData);

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
  const addBannersInstance = new AddBanners(request, response);
  addBannersInstance.init();
};
