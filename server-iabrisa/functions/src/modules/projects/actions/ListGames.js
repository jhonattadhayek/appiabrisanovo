const FirebaseService = require("../../../config/firebase");

const { validator } = require("../../../config/validator");
const { ResponseCodesEnum } = require("../../../enums/ResponseCodesEnum");
const { gamesObApp } = require("../../../utils/games");

const translate = require("../../../translate");
const sendErrors = require("../../../helpers/sendErrors");

class ListGames {
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
      const { type, format } = this.request.params;

      let list = [];

      switch (`${type}.${format}`) {
        case "ob.app":
          list = gamesObApp();
          break;

        default:
          list = [];
          break;
      }

      return this.response.status(ResponseCodesEnum.OK).send(list);
    } catch (error) {
      return sendErrors(this.response, {
        status: ResponseCodesEnum.INTERNAL_SERVER_ERROR,
        messageKey: error.message
      });
    }
  }
}

module.exports = (request, response) => {
  const listGamesInstance = new ListGames(request, response);
  listGamesInstance.init();
};
