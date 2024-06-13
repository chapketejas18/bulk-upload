"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importCSV = void 0;
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const CustomerRepository_1 = __importDefault(require("../repository/CustomerData/CustomerRepository"));
const customerSchema_1 = require("../config/customerSchema");
const DataWithErrorRepository_1 = __importDefault(require("../repository/DataWithError/DataWithErrorRepository"));
const CsvDataMapperRepository_1 = __importDefault(require("../repository/CsvDataMapper/CsvDataMapperRepository"));
const importCSV = (req, res) => {
    const filePath = req.filePath;
    if (!filePath) {
        res.status(400).send("File path not found.");
        return;
    }
    const startedAt = new Date();
    const customers = [];
    const customersWithError = [];
    let currentRowNumber = 0;
    const readStream = fs_1.default.createReadStream(filePath);
    const parser = (0, csv_parser_1.default)();
    readStream
        .pipe(parser)
        .on("data", (data) => {
        currentRowNumber++;
        try {
            const customer = {
                customerId: data["Customer Id"],
                firstName: data["First Name"],
                lastName: data["Last Name"],
                company: data.Company,
                city: data.City,
                country: data.Country,
                phone1: data["Phone 1"],
                phone2: data["Phone 2"],
                email: data.Email,
                subscriptionDate: new Date(data["Subscription Date"]),
                website: data.Website,
            };
            const { error } = customerSchema_1.customerSchema.validate(customer);
            if (error) {
                customersWithError.push({
                    rowNumber: currentRowNumber,
                    validationerrors: error.message,
                });
                return;
            }
            customers.push(customer);
        }
        catch (error) {
            console.error("Error parsing row:", error, data);
        }
    })
        .on("end", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const endedAt = new Date();
            fs_1.default.unlinkSync(filePath);
            const csvInfo = {
                filename: filePath.split("/")[3],
                startedat: startedAt,
                endedat: endedAt,
            };
            const csvInfoRecord = yield CsvDataMapperRepository_1.default.insertCsvInfo(csvInfo);
            const customersWithCsvId = customers.map((customer) => (Object.assign(Object.assign({}, customer), { csvid: csvInfoRecord._id })));
            yield CustomerRepository_1.default.insertCustomers(customersWithCsvId);
            yield DataWithErrorRepository_1.default.insertErrorInfo(customersWithError);
            yield CsvDataMapperRepository_1.default.updateCsvInfo(csvInfoRecord._id.toString(), { endedat: new Date() });
            res.status(200).json({
                message: "CSV file imported successfully.",
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).send("Error importing CSV file");
        }
    }))
        .on("error", (error) => {
        console.error("Error reading CSV file:", error);
        res.status(500).send("Error reading CSV file: " + error.message);
    });
};
exports.importCSV = importCSV;
