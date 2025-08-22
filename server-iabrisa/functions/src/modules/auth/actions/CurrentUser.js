const { ResponseCodesEnum } = require("../../../enums/ResponseCodesEnum");

const sendErrors = require("../../../helpers/sendErrors");

class CurrentUser {
  constructor(request, response) {
    this.request = request;
    this.response = response;
  }

  init() {
    try {
      const { currentUser } = this.request;

      return this.response.status(ResponseCodesEnum.OK).send(currentUser);
    } catch (error) {
      this.handleInternalError(error);
    }
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
  const currentUserInstance = new CurrentUser(request, response);
  currentUserInstance.init();
};
