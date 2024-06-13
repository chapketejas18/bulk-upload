import { Request, Response } from "express";
import fs from "fs";
import csv from "csv-parser";
import { ICustomer } from "../repository/CustomerData/ICustomer";
import CustomerRepository from "../repository/CustomerData/CustomerRepository";
import { customerSchema } from "../config/customerSchema";
import DataWithErrorRepository from "../repository/DataWithError/DataWithErrorRepository";
import CsvDataMapperRepository from "../repository/CsvDataMapper/CsvDataMapperRepository";
import { ICsvDataMapper } from "../repository/CsvDataMapper/ICsvDataMapper";

interface CustomRequest extends Request {
  filePath?: string;
}

export const importCSV = (req: CustomRequest, res: Response): void => {
  const filePath = req.filePath;

  if (!filePath) {
    res.status(400).send("File path not found.");
    return;
  }

  const startedAt = new Date();
  const customers: Partial<ICustomer>[] = [];
  const customersWithError: {
    rowNumber: number;
    validationerrors: string;
  }[] = [];
  let currentRowNumber = 0;

  const readStream = fs.createReadStream(filePath);
  const parser = csv();

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

        const { error } = customerSchema.validate(customer);
        if (error) {
          customersWithError.push({
            rowNumber: currentRowNumber,
            validationerrors: error.message,
          });
          return;
        }

        customers.push(customer);
      } catch (error) {
        console.error("Error parsing row:", error, data);
      }
    })
    .on("end", async () => {
      try {
        const endedAt = new Date();
        fs.unlinkSync(filePath);
        const csvInfo: ICsvDataMapper = {
          filename: filePath.split("/")[3],
          startedat: startedAt,
          endedat: endedAt,
        };
        const csvInfoRecord = await CsvDataMapperRepository.insertCsvInfo(
          csvInfo
        );
        const customersWithCsvId = customers.map((customer) => ({
          ...customer,
          csvid: csvInfoRecord._id,
        }));

        await CustomerRepository.insertCustomers(customersWithCsvId);
        await DataWithErrorRepository.insertErrorInfo(customersWithError);
        await CsvDataMapperRepository.updateCsvInfo(
          csvInfoRecord._id.toString(),
          { endedat: new Date() }
        );

        res.status(200).json({
          message: "CSV file imported successfully.",
          totalRowsInserted : customers.length,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send("Error importing CSV file");
      }
    })
    .on("error", (error) => {
      console.error("Error reading CSV file:", error);
      res.status(500).send("Error reading CSV file: " + error.message);
    });
};
