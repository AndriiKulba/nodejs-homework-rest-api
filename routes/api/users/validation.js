const Joi = require("joi");
const mongoose = require("mongoose");
const { Subscription } = require("../../../helpers/constants");

const schemaSubscription = Joi.object({
  email: Joi.string().required(),
  subscription: Joi.string()
    .valid(Subscription.STARTER, Subscription.PRO, Subscription.BUSINESS)
    .required(),
});

const validate = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj);
    next();
  } catch (err) {
    next({ status: 400, message: err.message.replace(/"/g, "") });
  }
};

module.exports = {
  validationSubscription: (req, res, next) => {
    return validate(schemaSubscription, req.body, next);
  },
};
