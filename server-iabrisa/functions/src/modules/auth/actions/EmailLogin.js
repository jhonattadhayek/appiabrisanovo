const FirebaseService = require("../../../config/firebase/index");

const { ResponseCodesEnum } = require("../../../enums/ResponseCodesEnum");
const { validator } = require("../../../config/validator");

const translate = require("../../../translate");
const sendErrors = require("../../../helpers/sendErrors");
const makeAccessToken = require("../../../helpers/makeAccessToken");

class EmailLogin {
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
      email: "required|email"
    };

    this.validator(this.request.body, constraints, (fail, success) => {
      if (success) return this.action();
      return this.handleValidationErrors(fail);
    });
  }

  async action() {
    const { email } = this.request.body;

    try {
      const userInDb = await this.getUserFromDb(email);
      const userInAuth = await this.getUserFromAuth(email);

      if (userInDb && userInAuth) {
        return this.signIn(userInDb);
      }

      return sendErrors(this.response, {
        status: ResponseCodesEnum.BAD_REQUEST,
        messageKey: "auth.not_found"
      });
    } catch (error) {
      this.handleInternalError(error);
    }
  }

  async getUserFromDb(email) {
    const usersRef = this.adminSdk.dbAdmins().where("email", "==", email);
    const docs = await usersRef.get();

    if (docs.empty) return null;

    return Object.assign(docs.docs[0].data(), {
      id: docs.docs[0].id
    });
  }

  async getUserFromAuth(email) {
    const authRef = this.adminSdk.authAdmin();

    try {
      return await authRef.getUserByEmail(email);
    } catch (error) {
      if (error.code !== "auth/user-not-found") {
        return sendErrors(this.response, {
          status: ResponseCodesEnum.INTERNAL_SERVER_ERROR,
          messageKey: "auth.error_fetching_user_in_auth",
          additionalData: { error: error.message }
        });
      }
      return null;
    }
  }

  async createUser() {
    try {
      const { email } = this.request.body;
      const password = `${email.split("@")[0]}@sinalmax`;

      const authRef = this.adminSdk.authAdmin();
      const newUser = await authRef.createUser({ email, password });
      const userData = await this.mountUserData();

      await this.adminSdk.dbAdmins().doc(newUser.uid).set(userData);

      const user = Object.assign(userData, { id: newUser.uid });

      return this.signIn(user);
    } catch (error) {
      this.handleInternalError(error);
    }
  }

  async createUserInDb(userInAuth) {
    try {
      const userData = await this.mountUserData();
      await this.adminSdk.dbAdmins().doc(userInAuth.uid).set(userData);

      return Object.assign(userData, { id: userInAuth.uid });
    } catch (error) {
      this.handleInternalError(error);
    }
  }

  async mountUserData() {
    const { email } = this.request.body;

    const countRef = this.adminSdk.dbAdmins().count();
    const size = await countRef.get().then(doc => doc.data().count);
    const countId = size + 150;

    return {
      countId: countId,
      createdAt: Date.now(),
      email: email.toLowerCase(),
      phone: null,
      name: null,
      cpfCnpj: null,
      actived: true,
      projects: {}
    };
  }

  async signIn(user) {
    try {
      const accessToken = makeAccessToken(user.id);

      return this.response.status(ResponseCodesEnum.OK).send({
        message: this.translate("auth.user_logged", this.lang),
        accessToken
      });
    } catch (error) {
      this.handleInternalError(error);
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
  const emailLoginInstance = new EmailLogin(request, response);
  emailLoginInstance.init();
};
