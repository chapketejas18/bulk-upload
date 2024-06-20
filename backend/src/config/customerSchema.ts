import Joi from "joi";

export const customerSchema = Joi.object({
  customerId: Joi.string().optional().messages({
    "string.base": "Customer ID should be a type of string",
  }),
  firstName: Joi.string().required().messages({
    "string.base": "Invalid first name",
    "string.empty": "First Name cannot be empty",
    "any.required": "First Name is a required field",
  }),
  lastName: Joi.string().required().messages({
    "string.base": "Invalid Last name",
    "string.empty": "Last Name cannot be empty",
    "any.required": "Last Name is a required field",
  }),
  company: Joi.string().optional().messages({
    "string.base": "Invalid company name",
  }),
  city: Joi.string().optional().messages({
    "string.base": "Invalid City",
  }),
  country: Joi.string().optional().messages({
    "string.base": "Invalid Country",
  }),
  phone1: Joi.string().max(15).required().messages({
    "string.base": "Primary Phone should be valid",
    "string.empty": "Primary Phone cannot be empty",
    "string.max": "Invalid Primary Phone Number",
    "any.required": "Primary Phone is a required field",
  }),
  phone2: Joi.string().max(15).optional().messages({
    "string.base": "Secondary Phone should be valid",
    "string.max": "Invalid Secondary Phone Number",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email should be valid",
    "string.empty": "Email cannot be empty",
    "string.email": "Invalid Email",
    "any.required": "Email is a required field",
  }),
  subscriptionDate: Joi.any().optional().messages({
    "any.base": "Subscription Date should be a valid date",
  }),
  website: Joi.string().optional().messages({
    "string.base": "Invalid website URL",
  }),
});
