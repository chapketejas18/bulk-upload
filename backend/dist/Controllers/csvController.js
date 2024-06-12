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
const CustomerRepository_1 = __importDefault(require("../repository/CustomerRepository"));
const importCSV = (req, res) => {
    const filePath = req.filePath;
    if (!filePath) {
        res.status(400).send("File path not found.");
        return;
    }
    const customers = [];
    const readStream = fs_1.default.createReadStream(filePath);
    const parser = (0, csv_parser_1.default)();
    readStream
        .pipe(parser)
        .on("data", (data) => {
        try {
            customers.push({
                index: parseInt(data.Index, 10),
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
            });
        }
        catch (error) {
            console.error("Error parsing row:", error, data);
        }
    })
        .on("end", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            fs_1.default.unlinkSync(filePath);
            yield CustomerRepository_1.default.insertCustomers(customers);
            res.status(200).send("CSV file imported successfully.");
        }
        catch (error) {
            console.log(error);
            res.status(500).send("Error importing CSV file: ");
        }
    }))
        .on("error", (error) => {
        console.error("Error reading CSV file:", error);
        res.status(500).send("Error reading CSV file: " + error.message);
    });
};
exports.importCSV = importCSV;
