const FirebaseService = require("../../../config/firebase");

const { validator } = require("../../../config/validator");
const { ResponseCodesEnum } = require("../../../enums/ResponseCodesEnum");
const { cleanString } = require("../../../utils/strings");
const { bucket } = require("../../../config/bucket");

const translate = require("../../../translate");
const isFieldUnique = require("../common/isFieldUnique");
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

      if (body.slug) {
        body.slug = cleanString(body.slug);

        if (project.data().slug !== body.slug) {
          const unique = await isFieldUnique("slug", body.slug);
          if (!unique) throw new Error("projects.unique_slug");
        }
      }

      return this.update(project.data());
    } catch (error) {
      return this.handleInternalError(error);
    }
  }

  async update(project) {
    try {
      const { body } = this.request;
      const { id } = this.request.params;

      const dbRef = this.adminSdk.dbProjects().doc(id);
      const regex = /^https:\/\/firebasestorage\.googleapis\.com/;

      if (body.settings && body.settings.logoURL) {
        if (!regex.test(body.settings.logoURL)) {
          const ext = body.settings.logoURL.substring(
            "data:image/".length,
            body.settings.logoURL.indexOf(";base64")
          );

          body.settings.logoURL = await bucket.upload({
            file: body.settings.logoURL,
            pathname: `apps/${id}/logo.${ext}`
          });

          project.pages.login.logoURL = body.settings.logoURL;

          await dbRef
            .update({ "pages.login.logoURL": body.settings.logoURL })
            .catch(error => {
              throw new Error(error.code);
            });
        }
      }

      delete body.token;

      await dbRef.update(body).catch(error => {
        throw new Error(error.code);
      });

      if (body.name && body.name !== project.name) {
        const adminRef = this.adminSdk
          .dbAdmins()
          .where(`projects.${id}`, "!=", null);

        const admin = await adminRef.get().then(snap => {
          if (!snap.empty) {
            const admin = snap.docs[0].data();
            return { ...admin, id: snap.docs[0].id };
          }

          return null;
        });

        if (admin) {
          await this.adminSdk
            .dbAdmins()
            .doc(admin.id)
            .update({ [`projects.${id}.name`]: body.name });
        }
      }

      const updated = Object.assign(project, body);

      return this.response.status(ResponseCodesEnum.OK).send({
        project: { ...updated, id }
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
