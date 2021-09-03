import Joi from "joi";
export const notificationRules = {
  deliveryDate: Joi.date().greater("now")
};