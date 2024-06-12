"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvDataMapperSchema = void 0;
const mongoose_1 = require("mongoose");
exports.CsvDataMapperSchema = new mongoose_1.Schema({
    startedat: { type: Date, required: true },
    endedat: { type: Date, required: true },
    filename: { type: String, required: true },
});
