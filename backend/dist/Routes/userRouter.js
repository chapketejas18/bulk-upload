"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const csvController_1 = require("../Controllers/csvController");
const upload_1 = require("../Middleware/upload");
const userController_1 = __importDefault(require("../Controllers/userController"));
const router = (0, express_1.Router)();
router.get("/customerinfo", userController_1.default.getAllCustomerData);
router.post("/addcustomer", userController_1.default.createData);
router.post("/import-csv", upload_1.uploadCSV, csvController_1.importCSV);
exports.default = router;
