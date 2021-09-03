import Joi, { CustomHelpers, ErrorReport } from "joi";
import { SMSRequest } from "SMSRequest";
import { notificationRules } from "../notification/validate";
import { PhoneNumberUtil } from "google-libphonenumber";

const phoneUtil = PhoneNumberUtil.getInstance();

const phoneNumberCustom = (value: any, helpers: CustomHelpers) : any | ErrorReport => {
  try {
    const phone = phoneUtil.parse(value);
    if(phoneUtil.isValidNumber(phone)) return value;
    throw Error();
  } catch(err) {
    return helpers.error("any.invalid"); 
  }
};
export const smsRules = {
  message: Joi.string().min(10).max(1024).required(),
  to: Joi.array().min(1).items(Joi.string().custom(phoneNumberCustom, "validate Phone Numbers").required()).required()
};
export const validate = (data: SMSRequest) : SMSRequest | never => {
  const schema = Joi.object({
    ...notificationRules,
    ...smsRules,
  });
  return Joi.attempt(data, schema);
};