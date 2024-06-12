"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerSchema = void 0;
const mongoose_1 = require("mongoose");
exports.CustomerSchema = new mongoose_1.Schema({
    customerId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    company: { type: String },
    city: { type: String },
    country: { type: String },
    phone1: { type: String, required: true },
    phone2: { type: String },
    email: { type: String, required: true },
    subscriptionDate: { type: Date },
    website: { type: String },
    csvid: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "csvinfo",
        required: true,
    },
}, { timestamps: true });
