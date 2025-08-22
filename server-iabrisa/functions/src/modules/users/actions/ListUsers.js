const FirebaseService = require("../../../config/firebase");

const { validator } = require("../../../config/validator");
const { ResponseCodesEnum } = require("../../../enums/ResponseCodesEnum");

const paginateLists = require("../../../helpers/paginateLists");
const sendErrors = require("../../../helpers/sendErrors");
const translate = require("../../../translate");

class ListUsers {
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
      const { pageSize, lastId, orderBy, sort } = this.request.query;
      const { body } = this.request;

      let dbRef = this.adminSdk.dbUsers();
      let filteredDbRef = this.adminSdk.dbUsers();

      if (body.queries && body.queries.length) {
        for (const filter of body.queries) {
          filteredDbRef = filteredDbRef.where(
            filter.filterKey,
            filter.type,
            filter.value
          );
        }
      }

      const listConfig = {
        dbRef,
        filteredDbRef,
        pageSize: pageSize,
        lastId: lastId,
        orderBy,
        lang: this.lang,
        sort: sort || null
      };

      const data = await paginateLists(listConfig);

      return this.response.status(ResponseCodesEnum.OK).send(data);
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
  const listUsersInstance = new ListUsers(request, response);
  listUsersInstance.init();
};
