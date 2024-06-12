"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataWithErrorSchema = void 0;
const mongoose_1 = require("mongoose");
exports.DataWithErrorSchema = new mongoose_1.Schema({
    customerId: { type: String, required: true },
    validationerrors: { type: String, required: true },
});
