"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataWithErrorSchema = void 0;
const mongoose_1 = require("mongoose");
exports.DataWithErrorSchema = new mongoose_1.Schema({
    rowNumber: { type: Number, required: true },
    validationerrors: { type: String, required: true },
    csvid: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "csvinfo",
    },
});
