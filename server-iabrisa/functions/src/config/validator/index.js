const Validator = require("validatorjs");

exports.validator = async (context, constraints, callback) => {
  const validation = new Validator(context, constraints);

  validation.passes(() => callback(null, true));
  validation.fails(() => callback(validation.errors, false));
};
