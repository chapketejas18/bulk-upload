import { Request, Response } from "express";
import dotenv = require("dotenv");
import CustomerRepository from "../repository/CustomerData/CustomerRepository";
import { customerSchema } from "../config/customerSchema";
import CsvDataMapperRepository from "../repository/CsvDataMapper/CsvDataMapperRepository";
import { CsvDataMapperModel } from "../repository/CsvDataMapper/CsvDataMapperModel";
import DataWithErrorRepository from "../repository/DataWithError/DataWithErrorRepository";
dotenv.config();

class customerController {
  getAllCustomerData = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const searchField = req.body.searchField as string;
      const searchText = req.body.searchText as string;
      const customerData = await CustomerRepository.getAllCustomers(
        page,
        limit,
        searchField,
        searchText
      );

      let totalCount;
      if (searchField && searchText) {
        totalCount = await CustomerRepository.getCustomerCount(
          searchField,
          searchText
        );
      } else {
        totalCount = await CustomerRepository.getCustomerCount();
      }

      res.status(200).json({
        message: "Data fetched successfully",
        customerData,
        totalCount,
      });
    } catch (err) {
      const typedError = err;
      res.status(500).json({ error: typedError });
    }
  };

  createData = async (req: Request, res: Response): Promise<void> => {
    try {
      const body = req.body;
      const { error } = customerSchema.validate(body);
      if (error) {
        res.status(404).json({
          message: "Data not inserted due validation error in data provided",
          validationErrors: error,
        });
        return;
      }
      const addedData = await CustomerRepository.addCustomer(body);
      res.status(200).json({ status: "Created Successfully", addedData });
    } catch (error) {
      console.log("Error creating data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  getSingleCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
      const { customerId } = req.body;
      const customer = await CustomerRepository.getCustomerById(customerId);
      if (!customer) {
        res.status(404).json({ error: "Customer not found" });
        return;
      }
      res.status(200).json({ message: "Customer found", customer });
    } catch (error) {
      console.log("Error fetching customer:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  editCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
      const { customerId, newData } = req.body;
      const { error } = customerSchema.validate(newData);
      if (error) {
        res.status(400).json({
          message: "Validation error in edited data",
          validationErrors: error,
        });
        return;
      }
      const updatedCustomer = await CustomerRepository.updateCustomer(
        customerId,
        newData
      );
      res
        .status(200)
        .json({ message: "Customer updated", customer: updatedCustomer });
    } catch (error) {
      console.log("Error updating customer:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  getCsvInfos = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const csvInfoData = await CsvDataMapperRepository.getInfoData(
        page,
        limit
      );
      const totalCount = await CsvDataMapperModel.countDocuments();
      res.status(200).json({
        message: "Data fetched successfully",
        csvInfoData,
        totalCount,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  };

  getAllErrors = async (req: Request, res: Response): Promise<void> => {
    try {
      const csvId = req.query.id as string;
      const errorData = await DataWithErrorRepository.getErrorsByCsvId(csvId);
      if (!errorData) {
        res
          .status(404)
          .json({ error: "No data found with the provided CSV ID" });
        return;
      }
      res.status(200).json({
        message: "Data fetched successfully",
        errorData,
        totalCount: errorData.length,
      });
    } catch (error) {
      console.log("Error fetching errors:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}

export default new customerController();
