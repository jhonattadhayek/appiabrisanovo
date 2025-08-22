const FirebaseService = require("../../../config/firebase");

const { validator } = require("../../../config/validator");
const { ResponseCodesEnum } = require("../../../enums/ResponseCodesEnum");

const translate = require("../../../translate");
const sendErrors = require("../../../helpers/sendErrors");

class UsersCountByDay {
  constructor(request, response) {
    this.request = request;
    this.response = response;
    this.lang = request.query.lang || "pt_br";
    this.translate = translate;
    this.validator = validator;
    this.adminSdk = new FirebaseService();
  }

  async verifyRequest() {
    try {
      const { token } = this.request.params;
      const project = await this.getProject(token);

      if (!project) {
        return sendErrors(this.response, {
          status: ResponseCodesEnum.BAD_REQUEST,
          messageKey: "projects.not_found"
        });
      }

      return this.getUsers(project);
    } catch (error) {
      return this.handleInternalError(error);
    }
  }

  async getProject(token) {
    const queries = [{ filterKey: "token", type: "==", value: token }];

    let dbRef = this.adminSdk.dbProjects();
    dbRef = this.applyFilters(dbRef, queries);

    return await dbRef.get().then(snap => {
      if (!snap.empty) {
        return { ...snap.docs[0].data(), id: snap.docs[0].id };
      }

      return null;
    });
  }

  applyFilters(dbRef, queries) {
    for (const filter of queries) {
      dbRef = dbRef.where(filter.filterKey, filter.type, filter.value);
    }
    return dbRef;
  }

  async getUsers(project) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const results = [];
      for (let i = 0; i < 10; i++) {
        const day = new Date(today);
        day.setUTCDate(day.getUTCDate() - i);

        const startTimestamp = new Date(day);
        startTimestamp.setUTCHours(0, 0, 0, 0);

        const endTimestamp = new Date(day);
        endTimestamp.setUTCHours(23, 59, 59, 999);

        const countProducts = await this.adminSdk
          .dbUsers()
          .where("createdAt", ">=", startTimestamp.getTime())
          .where("createdAt", "<=", endTimestamp.getTime())
          .where("projectId", "==", project.id)
          .count()
          .get();

        const count = countProducts.data().count;
        const fullDate = day.toISOString().split("T")[0];

        results.push({ fullDate, value: count });
      }

      results.forEach(result => {
        result.label = this.formatDateLabel(result.fullDate);
      });

      results.sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));

      return this.response.status(ResponseCodesEnum.OK).send(results);
    } catch (error) {
      return sendErrors(this.response, {
        status: ResponseCodesEnum.INTERNAL_SERVER_ERROR,
        messageKey: error.message
      });
    }
  }

  formatDateLabel(dateString) {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, "0");
    const month = date
      .toLocaleDateString("pt-BR", { month: "short" })
      .replace("de ", "")
      .replace(".", "");

    return `${day} ${month.charAt(0).toUpperCase() + month.slice(1)}`;
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
  const usersByDayInstance = new UsersCountByDay(request, response);
  usersByDayInstance.verifyRequest();
};
