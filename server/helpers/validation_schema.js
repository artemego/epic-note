const Joi = require("@hapi/joi");

// TODO: change the min length of password to 6-8
// TODO: add a regex for password (lowercase, uppercase, numbers required)

const authSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(2).required(),
});

module.exports = {
  authSchema,
};
