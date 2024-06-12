"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCSV = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const tempUploadsFolder = path_1.default.join(os_1.default.tmpdir(), "uploads");
if (!fs_1.default.existsSync(tempUploadsFolder)) {
    fs_1.default.mkdirSync(tempUploadsFolder, { recursive: true });
}
const uploadCSV = (req, res, next) => {
    if (!req.files || !req.files.file) {
        res.status(400).send("No file uploaded.");
        return;
    }
    const file = req.files.file;
    const filePath = path_1.default.join(tempUploadsFolder, file.name);
    file.mv(filePath, (err) => {
        if (err) {
            console.error("Error moving file:", err);
            res.status(500).send("Error uploading file.");
            return;
        }
        req.filePath = filePath;
        next();
    });
};
exports.uploadCSV = uploadCSV;
