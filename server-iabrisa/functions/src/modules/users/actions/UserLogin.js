const request = require("request");

const FirebaseService = require("../../../config/firebase/index");

const { ResponseCodesEnum } = require("../../../enums/ResponseCodesEnum");
const { validator } = require("../../../config/validator");

const translate = require("../../../translate");
const sendErrors = require("../../../helpers/sendErrors");
const makeAccessToken = require("../../../helpers/makeAccessToken");

class UserLogin {
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
      email: "required|email",
      password: "required",
      id: "required|string"
    };

    this.validator(this.request.body, constraints, (fail, success) => {
      if (success) return this.action();
      return this.handleValidationErrors(fail);
    });
  }

  async action() {
    try {
      const body = this.request.body;

      const user = await this.fetchUser({
        email: body.email,
        id: body.id
      });

      if (!user) {
        return sendErrors(this.response, {
          status: ResponseCodesEnum.BAD_REQUEST,
          messageKey: "users.not_found"
        });
      }

      if (!user.actived) {
        return sendErrors(this.response, {
          status: ResponseCodesEnum.UNAUTHORIZED,
          messageKey: "users.disabled"
        });
      }

      const options = {
        method: "POST",
        url: "https://broker-api.mybroker.dev/auth/login",
        headers: {
          "content-type": "application/json"
        },
        body: {
          tenantId: "01K2Z26WR108DZ3SP9Z87V4ZRP",
          email: body.email,
          password: body.password,
          agentNavigator:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
          recaptchaToken: "bypass-2",
          cookie:
            "_ga=GA1.1.1016882324.1755827505; _ga_QH9XEDDF6Y=GS2.1.s1755832726$o2$g1$t1755834482$j60$l0$h0"
        },
        json: true
      };

      const loginResponse = await new Promise((resolve, reject) => {
        request(options, function (error, response, body) {
          if (error) {
            reject(error);
          } else {
            resolve(body);
          }
        });
      });

      if (loginResponse.status === "error") {
        return sendErrors(this.response, {
          status: ResponseCodesEnum.BAD_REQUEST,
          messageKey: loginResponse.data.message
        });
      }

      const token = makeAccessToken(user.id);

      return this.response.status(ResponseCodesEnum.OK).send({
        ...user,
        accessToken: token,
        stakbrokerToken: loginResponse.token
      });
    } catch (error) {
      this.handleInternalError(error);
    }
  }

  async fetchUser({ email, id }) {
    try {
      const dbRef = this.adminSdk
        .dbUsers()
        .where("email", "==", email)
        .where("projectId", "==", id);

      const docs = await dbRef.get();
      if (docs.empty) return null;

      let user = null;

      docs.forEach(doc => {
        const data = { ...doc.data(), id: doc.id };
        if (!user || data.signature === "paid") {
          user = data;
        }
      });

      return user;
    } catch (error) {
      throw new Error("Error fetching user: " + error.message);
    }
  }

  handleValidationErrors(fail) {
    sendErrors(this.response, {
      status: ResponseCodesEnum.BAD_REQUEST,
      messageKey: "invalid_constraints",
      additionalData: { errors: fail?.errors }
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
  const userLoginInstance = new UserLogin(request, response);
  userLoginInstance.init();
};
