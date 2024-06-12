"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvDataMapperModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CsvDataMapperSchema_1 = require("./CsvDataMapperSchema");
exports.CsvDataMapperModel = mongoose_1.default.model("csvinfo", CsvDataMapperSchema_1.CsvDataMapperSchema);
