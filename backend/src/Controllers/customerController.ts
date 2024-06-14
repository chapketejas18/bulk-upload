import { Request, Response } from "express";
import dotenv = require("dotenv");
import CustomerRepository from "../repository/CustomerData/CustomerRepository";
import { customerSchema } from "../config/customerSchema";
dotenv.config();

class customerController {
  getAllCustomerData = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const customerData = await CustomerRepository.getAllCustomers(
        page,
        limit
      );
      const totalCount = await CustomerRepository.getCustomerCount();
      res.json({
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
        res.json({
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

  searchCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
      const { searchField, searchText } = req.body;
      const searchData = await CustomerRepository.searchCustomers(
        searchField,
        searchText
      );
      res.json({ message: "Search results fetched successfully", searchData });
    } catch (error) {
      console.log("Error searching data:", error);
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
      res.json({ message: "Customer found", customer });
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
          message: "Validation error in new data",
          validationErrors: error,
        });
        return;
      }
      const updatedCustomer = await CustomerRepository.updateCustomer(
        customerId,
        newData
      );
      res.json({ message: "Customer updated", customer: updatedCustomer });
    } catch (error) {
      console.log("Error updating customer:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}

export default new customerController();
