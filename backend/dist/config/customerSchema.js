"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.customerSchema = joi_1.default.object({
    index: joi_1.default.number().required(),
    customerId: joi_1.default.string().required(),
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    company: joi_1.default.string().optional(),
    city: joi_1.default.string().optional(),
    country: joi_1.default.string().optional(),
    phone1: joi_1.default.string().required(),
    phone2: joi_1.default.string().optional(),
    email: joi_1.default.string().email().required(),
    subscriptionDate: joi_1.default.any().optional(),
    website: joi_1.default.string().optional(),
});
