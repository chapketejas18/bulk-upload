"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanUpTempFile = void 0;
const fs_1 = __importDefault(require("fs"));
const cleanUpTempFile = (req, res, next) => {
    const filePath = req.filePath;
    if (filePath) {
        fs_1.default.unlink(filePath, (err) => {
            if (err)
                console.error("Error deleting temp file:", err);
        });
    }
    next();
};
exports.cleanUpTempFile = cleanUpTempFile;
