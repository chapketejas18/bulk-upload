"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataWithErrorModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const DataWithErrorSchema_1 = require("./DataWithErrorSchema");
exports.DataWithErrorModel = mongoose_1.default.model("customerlogswitherror", DataWithErrorSchema_1.DataWithErrorSchema);
