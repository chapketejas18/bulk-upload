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
const DataWithErrorRepository_1 = __importDefault(require("../repository/DataWithError/DataWithErrorRepository"));
const CsvDataMapperRepository_1 = __importDefault(require("../repository/CsvDataMapper/CsvDataMapperRepository"));
const worker_threads_1 = require("worker_threads");
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const NUM_WORKERS = os_1.default.cpus().length;
const importCSV = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = req.filePath;
    if (!filePath) {
        res.status(400).send("File path not found.");
        return;
    }
    const startedAt = new Date();
    let csvInfoRecordId;
    const dataRows = [];
    let currentRowNumber = 0;
    const readStream = fs_1.default.createReadStream(filePath);
    const parser = (0, csv_parser_1.default)();
    readStream.pipe(parser);
    parser.on("data", (data) => {
        dataRows.push(data);
        currentRowNumber++;
    });
    parser.on("end", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const endedAt = new Date();
            fs_1.default.unlinkSync(filePath);
            const csvInfo = {
                filename: path_1.default.basename(filePath),
                startedat: startedAt,
                endedat: endedAt,
                noofuploadeddata: 0,
            };
            const csvInfoRecord = yield CsvDataMapperRepository_1.default.insertCsvInfo(csvInfo);
            csvInfoRecordId = csvInfoRecord._id;
            const chunkSize = Math.ceil(dataRows.length / NUM_WORKERS);
            const chunks = Array.from({ length: NUM_WORKERS }, (_, i) => dataRows.slice(i * chunkSize, (i + 1) * chunkSize));
            const workerPromises = chunks.map((chunk) => new Promise((resolve, reject) => {
                const worker = new worker_threads_1.Worker(path_1.default.join(__dirname, "workerScript.js"), {
                    workerData: { data: chunk, csvInfoRecordId },
                });
                worker.on("message", resolve);
                worker.on("error", reject);
                worker.on("exit", (code) => {
                    if (code !== 0) {
                        reject(new Error(`Worker stopped with exit code ${code}`));
                    }
                });
            }));
            const results = yield Promise.all(workerPromises);
            const customers = [];
            const customersWithError = [];
            results.forEach((resultArray) => {
                resultArray.forEach((result) => {
                    if (result.validationerrors) {
                        customersWithError.push(result);
                    }
                    else {
                        customers.push(result);
                    }
                });
            });
            const customersWithCsvId = customers.map((customer) => (Object.assign(Object.assign({}, customer), { csvid: csvInfoRecordId })));
            customersWithError.forEach((errorRecord) => {
                errorRecord.csvid = csvInfoRecordId;
            });
            yield CustomerRepository_1.default.insertCustomers(customersWithCsvId);
            yield DataWithErrorRepository_1.default.insertErrorInfo(customersWithError);
            yield CsvDataMapperRepository_1.default.updateCsvInfo(csvInfoRecordId.toString(), {
                endedat: new Date(),
                noofuploadeddata: customers.length,
            });
            res.status(200).json({
                message: "CSV file imported successfully.",
                totalRowsInserted: customers.length,
                errorData: customersWithError,
                errorDataLength: customersWithError.length,
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).send("Error importing CSV file");
        }
    }));
    parser.on("error", (error) => {
        console.error("Error reading CSV file:", error);
        res.status(500).send("Error reading CSV file: " + error.message);
    });
});
exports.importCSV = importCSV;
