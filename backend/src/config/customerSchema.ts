import Joi from "joi";

export const customerSchema = Joi.object({
  index: Joi.number().required(),
  customerId: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  company: Joi.string().optional(),
  city: Joi.string().optional(),
  country: Joi.string().optional(),
  phone1: Joi.string().required(),
  phone2: Joi.string().optional(),
  email: Joi.string().email().required(),
  subscriptionDate: Joi.any().optional(),
  website: Joi.string().optional(),
});
