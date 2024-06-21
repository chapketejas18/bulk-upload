import { Request, Response } from "express";
import customerController from "../../Controllers/customerController";
import CustomerRepository from "../../repository/CustomerData/CustomerRepository";
import CsvDataMapperRepository from "../../repository/CsvDataMapper/CsvDataMapperRepository";
import { CsvDataMapperModel } from "../../repository/CsvDataMapper/CsvDataMapperModel";
import DataWithErrorRepository from "../../repository/DataWithError/DataWithErrorRepository";
import { customerSchema } from "../../config/customerSchema";

jest.mock("../../repository/CustomerData/CustomerRepository");
jest.mock("../../repository/CsvDataMapper/CsvDataMapperRepository");
jest.mock("../../repository/DataWithError/DataWithErrorRepository");
jest.mock("../../repository/CsvDataMapper/CsvDataMapperModel");

describe("customerController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

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
    it("should fetch all customer data and return 200 status", async () => {
      const mockCustomerData = [{ id: 1, name: "John Doe" }];
      const mockCount = 1;
      (CustomerRepository.getAllCustomers as jest.Mock).mockResolvedValue(
        mockCustomerData
      );
      (CustomerRepository.getCustomerCount as jest.Mock).mockResolvedValue(
        mockCount
      );

      req.query = { page: "1", limit: "10" };
      req.body = { searchField: "", searchText: "" };

      await customerController.getAllCustomerData(
        req as Request,
        res as Response
      );

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Data fetched successfully",
        customerData: mockCustomerData,
        totalCount: mockCount,
      });
    });

    it("should handle errors and return 500 status", async () => {
      const error = new Error("Error fetching data");
      (CustomerRepository.getAllCustomers as jest.Mock).mockRejectedValue(
        error
      );

      req.query = { page: "1", limit: "10" };
      req.body = { searchField: "", searchText: "" };

      await customerController.getAllCustomerData(
        req as Request,
        res as Response
      );

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: error });
    });
  });

  describe("createData", () => {
    it("should create new customer data and return 200 status", async () => {
      const mockData = { id: 1, name: "John Doe" };
      (customerSchema.validate as jest.Mock).mockReturnValue({ error: null });
      (CustomerRepository.addCustomer as jest.Mock).mockResolvedValue(mockData);

      req.body = mockData;

      await customerController.createData(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        status: "Created Successfully",
        addedData: mockData,
      });
    });

    it("should return validation error and 404 status", async () => {
      const mockError = { details: [{ message: "Validation error" }] };
      (customerSchema.validate as jest.Mock).mockReturnValue({
        error: mockError,
      });

      req.body = {};

      await customerController.createData(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Data not inserted due validation error in data provided",
        validationErrors: mockError,
      });
    });

    it("should handle errors and return 500 status", async () => {
      const error = new Error("Error creating data");
      (customerSchema.validate as jest.Mock).mockReturnValue({ error: null });
      (CustomerRepository.addCustomer as jest.Mock).mockRejectedValue(error);

      req.body = { id: 1, name: "John Doe" };

      await customerController.createData(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: "Internal server error" });
    });
  });

  describe("getSingleCustomer", () => {
    it("should fetch a single customer and return 200 status", async () => {
      const mockCustomer = { id: 1, name: "John Doe" };
      (CustomerRepository.getCustomerById as jest.Mock).mockResolvedValue(
        mockCustomer
      );

      req.body = { customerId: 1 };

      await customerController.getSingleCustomer(
        req as Request,
        res as Response
      );

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Customer found",
        customer: mockCustomer,
      });
    });

    it("should return 404 status if customer not found", async () => {
      (CustomerRepository.getCustomerById as jest.Mock).mockResolvedValue(null);

      req.body = { customerId: 1 };

      await customerController.getSingleCustomer(
        req as Request,
        res as Response
      );

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: "Customer not found" });
    });

    it("should handle errors and return 500 status", async () => {
      const error = new Error("Error fetching customer");
      (CustomerRepository.getCustomerById as jest.Mock).mockRejectedValue(
        error
      );

      req.body = { customerId: 1 };

      await customerController.getSingleCustomer(
        req as Request,
        res as Response
      );

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: "Internal server error" });
    });
  });

  describe("editCustomer", () => {
    it("should update customer data and return 200 status", async () => {
      const mockUpdatedCustomer = { id: 1, name: "John Doe Updated" };
      (customerSchema.validate as jest.Mock).mockReturnValue({ error: null });
      (CustomerRepository.updateCustomer as jest.Mock).mockResolvedValue(
        mockUpdatedCustomer
      );

      req.body = { customerId: 1, newData: mockUpdatedCustomer };

      await customerController.editCustomer(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Customer updated",
        customer: mockUpdatedCustomer,
      });
    });

    it("should return validation error and 400 status", async () => {
      const mockError = { details: [{ message: "Validation error" }] };
      (customerSchema.validate as jest.Mock).mockReturnValue({
        error: mockError,
      });

      req.body = { customerId: 1, newData: {} };

      await customerController.editCustomer(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Validation error in edited data",
        validationErrors: mockError,
      });
    });

    it("should handle errors and return 500 status", async () => {
      const error = new Error("Error updating customer");
      (customerSchema.validate as jest.Mock).mockReturnValue({ error: null });
      (CustomerRepository.updateCustomer as jest.Mock).mockRejectedValue(error);

      req.body = { customerId: 1, newData: { name: "John Doe Updated" } };

      await customerController.editCustomer(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: "Internal server error" });
    });
  });

  describe("getCsvInfos", () => {
    it("should fetch CSV info data and return 200 status", async () => {
      const mockCsvData = [{ id: 1, name: "CSV Data" }];
      const mockCount = 1;
      (CsvDataMapperRepository.getInfoData as jest.Mock).mockResolvedValue(
        mockCsvData
      );
      (CsvDataMapperModel.countDocuments as jest.Mock).mockResolvedValue(
        mockCount
      );

      req.query = { page: "1", limit: "10" };

      await customerController.getCsvInfos(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Data fetched successfully",
        csvInfoData: mockCsvData,
        totalCount: mockCount,
      });
    });

    it("should handle errors and return 500 status", async () => {
      const error = new Error("Error fetching CSV data");
      (CsvDataMapperRepository.getInfoData as jest.Mock).mockRejectedValue(
        error
      );

      req.query = { page: "1", limit: "10" };

      await customerController.getCsvInfos(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });

  describe("getAllErrors", () => {
    it("should fetch error data and return 200 status", async () => {
      const mockErrorData = [{ id: 1, error: "Sample error" }];
      (DataWithErrorRepository.getErrorsByCsvId as jest.Mock).mockResolvedValue(
        mockErrorData
      );

      req.query = { id: "1" };

      await customerController.getAllErrors(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Data fetched successfully",
        errorData: mockErrorData,
        totalCount: mockErrorData.length,
      });
    });

    it("should return 404 status if no error data found", async () => {
      (DataWithErrorRepository.getErrorsByCsvId as jest.Mock).mockResolvedValue(
        null
      );

      req.query = { id: "1" };

      await customerController.getAllErrors(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "No data found with the provided CSV ID",
      });
    });

    it("should handle errors and return 500 status", async () => {
      const error = new Error("Error fetching error data");
      (DataWithErrorRepository.getErrorsByCsvId as jest.Mock).mockRejectedValue(
        error
      );

      req.query = { id: "1" };

      await customerController.getAllErrors(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: "Internal server error" });
    });
  });
});
