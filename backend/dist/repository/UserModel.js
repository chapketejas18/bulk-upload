"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userErrorModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema_1 = require("./UserSchema");
exports.default = mongoose_1.default.model("Userdetails", UserSchema_1.UserSchema);
exports.userErrorModel = mongoose_1.default.model("errorData", UserSchema_1.UserSchema);
