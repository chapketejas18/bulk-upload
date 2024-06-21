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
const customerController_1 = __importDefault(require("../../Controllers/customerController"));
const CustomerRepository_1 = __importDefault(require("../../repository/CustomerData/CustomerRepository"));
const CsvDataMapperRepository_1 = __importDefault(require("../../repository/CsvDataMapper/CsvDataMapperRepository"));
const CsvDataMapperModel_1 = require("../../repository/CsvDataMapper/CsvDataMapperModel");
const DataWithErrorRepository_1 = __importDefault(require("../../repository/DataWithError/DataWithErrorRepository"));
const customerSchema_1 = require("../../config/customerSchema");
jest.mock("../../repository/CustomerData/CustomerRepository");
jest.mock("../../repository/CsvDataMapper/CsvDataMapperRepository");
jest.mock("../../repository/DataWithError/DataWithErrorRepository");
jest.mock("../../repository/CsvDataMapper/CsvDataMapperModel");
describe("customerController", () => {
    let req;
    let res;
    let statusMock;
    let jsonMock;
    beforeEach(() => {
        req = {};
        statusMock = jest.fn().mockReturnThis();
        jsonMock = jest.fn();
        res = {
            status: statusMock,
            json: jsonMock,
        };
    });
    describe("getAllCustomerData", () => {
        it("should fetch all customer data and return 200 status", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockCustomerData = [{ id: 1, name: "John Doe" }];
            const mockCount = 1;
            CustomerRepository_1.default.getAllCustomers.mockResolvedValue(mockCustomerData);
            CustomerRepository_1.default.getCustomerCount.mockResolvedValue(mockCount);
            req.query = { page: "1", limit: "10" };
            req.body = { searchField: "", searchText: "" };
            yield customerController_1.default.getAllCustomerData(req, res);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "Data fetched successfully",
                customerData: mockCustomerData,
                totalCount: mockCount,
            });
        }));
        it("should handle errors and return 500 status", () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error("Error fetching data");
            CustomerRepository_1.default.getAllCustomers.mockRejectedValue(error);
            req.query = { page: "1", limit: "10" };
            req.body = { searchField: "", searchText: "" };
            yield customerController_1.default.getAllCustomerData(req, res);
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ error: error });
        }));
    });
    describe("createData", () => {
        it("should create new customer data and return 200 status", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockData = { id: 1, name: "John Doe" };
            customerSchema_1.customerSchema.validate.mockReturnValue({ error: null });
            CustomerRepository_1.default.addCustomer.mockResolvedValue(mockData);
            req.body = mockData;
            yield customerController_1.default.createData(req, res);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                status: "Created Successfully",
                addedData: mockData,
            });
        }));
        it("should return validation error and 404 status", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockError = { details: [{ message: "Validation error" }] };
            customerSchema_1.customerSchema.validate.mockReturnValue({
                error: mockError,
            });
            req.body = {};
            yield customerController_1.default.createData(req, res);
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "Data not inserted due validation error in data provided",
                validationErrors: mockError,
            });
        }));
        it("should handle errors and return 500 status", () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error("Error creating data");
            customerSchema_1.customerSchema.validate.mockReturnValue({ error: null });
            CustomerRepository_1.default.addCustomer.mockRejectedValue(error);
            req.body = { id: 1, name: "John Doe" };
            yield customerController_1.default.createData(req, res);
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ error: "Internal server error" });
        }));
    });
    describe("getSingleCustomer", () => {
        it("should fetch a single customer and return 200 status", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockCustomer = { id: 1, name: "John Doe" };
            CustomerRepository_1.default.getCustomerById.mockResolvedValue(mockCustomer);
            req.body = { customerId: 1 };
            yield customerController_1.default.getSingleCustomer(req, res);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "Customer found",
                customer: mockCustomer,
            });
        }));
        it("should return 404 status if customer not found", () => __awaiter(void 0, void 0, void 0, function* () {
            CustomerRepository_1.default.getCustomerById.mockResolvedValue(null);
            req.body = { customerId: 1 };
            yield customerController_1.default.getSingleCustomer(req, res);
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ error: "Customer not found" });
        }));
        it("should handle errors and return 500 status", () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error("Error fetching customer");
            CustomerRepository_1.default.getCustomerById.mockRejectedValue(error);
            req.body = { customerId: 1 };
            yield customerController_1.default.getSingleCustomer(req, res);
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ error: "Internal server error" });
        }));
    });
    describe("editCustomer", () => {
        it("should update customer data and return 200 status", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUpdatedCustomer = { id: 1, name: "John Doe Updated" };
            customerSchema_1.customerSchema.validate.mockReturnValue({ error: null });
            CustomerRepository_1.default.updateCustomer.mockResolvedValue(mockUpdatedCustomer);
            req.body = { customerId: 1, newData: mockUpdatedCustomer };
            yield customerController_1.default.editCustomer(req, res);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "Customer updated",
                customer: mockUpdatedCustomer,
            });
        }));
        it("should return validation error and 400 status", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockError = { details: [{ message: "Validation error" }] };
            customerSchema_1.customerSchema.validate.mockReturnValue({
                error: mockError,
            });
            req.body = { customerId: 1, newData: {} };
            yield customerController_1.default.editCustomer(req, res);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "Validation error in edited data",
                validationErrors: mockError,
            });
        }));
        it("should handle errors and return 500 status", () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error("Error updating customer");
            customerSchema_1.customerSchema.validate.mockReturnValue({ error: null });
            CustomerRepository_1.default.updateCustomer.mockRejectedValue(error);
            req.body = { customerId: 1, newData: { name: "John Doe Updated" } };
            yield customerController_1.default.editCustomer(req, res);
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ error: "Internal server error" });
        }));
    });
    describe("getCsvInfos", () => {
        it("should fetch CSV info data and return 200 status", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockCsvData = [{ id: 1, name: "CSV Data" }];
            const mockCount = 1;
            CsvDataMapperRepository_1.default.getInfoData.mockResolvedValue(mockCsvData);
            CsvDataMapperModel_1.CsvDataMapperModel.countDocuments.mockResolvedValue(mockCount);
            req.query = { page: "1", limit: "10" };
            yield customerController_1.default.getCsvInfos(req, res);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "Data fetched successfully",
                csvInfoData: mockCsvData,
                totalCount: mockCount,
            });
        }));
        it("should handle errors and return 500 status", () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error("Error fetching CSV data");
            CsvDataMapperRepository_1.default.getInfoData.mockRejectedValue(error);
            req.query = { page: "1", limit: "10" };
            yield customerController_1.default.getCsvInfos(req, res);
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "Internal server error",
            });
        }));
    });
    describe("getAllErrors", () => {
        it("should fetch error data and return 200 status", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockErrorData = [{ id: 1, error: "Sample error" }];
            DataWithErrorRepository_1.default.getErrorsByCsvId.mockResolvedValue(mockErrorData);
            req.query = { id: "1" };
            yield customerController_1.default.getAllErrors(req, res);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "Data fetched successfully",
                errorData: mockErrorData,
                totalCount: mockErrorData.length,
            });
        }));
        it("should return 404 status if no error data found", () => __awaiter(void 0, void 0, void 0, function* () {
            DataWithErrorRepository_1.default.getErrorsByCsvId.mockResolvedValue(null);
            req.query = { id: "1" };
            yield customerController_1.default.getAllErrors(req, res);
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                error: "No data found with the provided CSV ID",
            });
        }));
        it("should handle errors and return 500 status", () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error("Error fetching error data");
            DataWithErrorRepository_1.default.getErrorsByCsvId.mockRejectedValue(error);
            req.query = { id: "1" };
            yield customerController_1.default.getAllErrors(req, res);
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ error: "Internal server error" });
        }));
    });
});
