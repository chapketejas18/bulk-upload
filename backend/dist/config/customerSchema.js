"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.customerSchema = joi_1.default.object({
    customerId: joi_1.default.string().optional().messages({
        "string.base": "Customer ID should be a type of string",
    }),
    firstName: joi_1.default.string().required().messages({
        "string.base": "Invalid first name",
        "string.empty": "First Name cannot be empty",
        "any.required": "First Name is a required field",
    }),
    lastName: joi_1.default.string().required().messages({
        "string.base": "Invalid Last name",
        "string.empty": "Last Name cannot be empty",
        "any.required": "Last Name is a required field",
    }),
    company: joi_1.default.string().optional().messages({
        "string.base": "Invalid company name",
    }),
    city: joi_1.default.string().optional().messages({
        "string.base": "Invalid City",
    }),
    country: joi_1.default.string().optional().messages({
        "string.base": "Invalid Country",
    }),
    phone1: joi_1.default.string().max(15).required().messages({
        "string.base": "Primary Phone should be valid",
        "string.empty": "Primary Phone cannot be empty",
        "string.max": "Invalid Primary Phone Number",
        "any.required": "Primary Phone is a required field",
    }),
    phone2: joi_1.default.string().max(15).optional().messages({
        "string.base": "Secondary Phone should be valid",
        "string.max": "Invalid Secondary Phone Number",
    }),
    email: joi_1.default.string().email().required().messages({
        "string.base": "Email should be valid",
        "string.empty": "Email cannot be empty",
        "string.email": "Invalid Email",
        "any.required": "Email is a required field",
    }),
    subscriptionDate: joi_1.default.any().optional().messages({
        "any.base": "Subscription Date should be a valid date",
    }),
    website: joi_1.default.string().optional().messages({
        "string.base": "Invalid website URL",
    }),
});
