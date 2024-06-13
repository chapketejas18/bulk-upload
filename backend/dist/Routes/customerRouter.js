"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const csvController_1 = require("../Controllers/csvController");
const upload_1 = require("../Middleware/upload");
const customerController_1 = __importDefault(require("../Controllers/customerController"));
const router = (0, express_1.Router)();
router.get("/customerinfo", customerController_1.default.getAllCustomerData);
router.post("/addcustomer", customerController_1.default.createData);
router.post("/import-csv", upload_1.uploadCSV, csvController_1.importCSV);
router.post("/search", customerController_1.default.searchCustomer);
exports.default = router;
