const translate = require("../translate");

const sendErrors = (response, error) => {
  const { status, messageKey, lang = "pt_br", additionalData = {} } = error;

  return response.status(status).send({
    message: translate(messageKey, lang),
    ...additionalData
  });
};

module.exports = sendErrors;
