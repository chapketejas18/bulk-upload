import { Request, Response } from "express";
import fs from "fs";
import csv from "csv-parser";
import { ICustomer } from "../repository/ICustomer";
import CustomerRepository from "../repository/CustomerRepository";

interface CustomRequest extends Request {
  filePath?: string;
}

export const importCSV = (req: CustomRequest, res: Response): void => {
  const filePath = req.filePath;

  if (!filePath) {
    res.status(400).send("File path not found.");
    return;
  }

  const customers: Partial<ICustomer>[] = [];
  const readStream = fs.createReadStream(filePath);
  const parser = csv();

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
      } catch (error) {
        console.error("Error parsing row:", error, data);
      }
    })
    .on("end", async () => {
      try {
        fs.unlinkSync(filePath);
        await CustomerRepository.insertCustomers(customers);
        res.status(200).send("CSV file imported successfully.");
      } catch (error) {
        console.log(error);
        res.status(500).send("Error importing CSV file: ");
      }
    })
    .on("error", (error) => {
      console.error("Error reading CSV file:", error);
      res.status(500).send("Error reading CSV file: " + error.message);
    });
};
