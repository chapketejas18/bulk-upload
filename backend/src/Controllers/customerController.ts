import { Request, Response } from "express";
import dotenv = require("dotenv");
import CustomerRepository from "../repository/CustomerRepository";
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
        const addDataInErrorTable = await CustomerRepository.addToErrorTable(
          body
        );
        res.json({
          message: "Data inserted in Error table",
          addDataInErrorTable,
        });
        return;
      }
      const addedData = await CustomerRepository.addCustomer(body);
      res.json({ status: "Created Successfully", addedData });
    } catch (error) {
      console.log("Error creating data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}

export default new customerController();
