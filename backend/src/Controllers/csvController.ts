import { Request, Response } from "express";
import fs from "fs";
import csv from "csv-parser";
import { ICustomer } from "../repository/CustomerData/ICustomer";
import CustomerRepository from "../repository/CustomerData/CustomerRepository";
import DataWithErrorRepository from "../repository/DataWithError/DataWithErrorRepository";
import CsvDataMapperRepository from "../repository/CsvDataMapper/CsvDataMapperRepository";
import { ICsvDataMapper } from "../repository/CsvDataMapper/ICsvDataMapper";
import { ObjectId } from "mongodb";
import { Worker } from "worker_threads";
import path from "path";
import os from "os";
interface CustomRequest extends Request {
  filePath?: string;
}

const NUM_WORKERS = os.cpus().length;

export const importCSV = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const filePath = req.filePath;

  if (!filePath) {
    res.status(400).send("File path not found.");
    return;
  }

  const startedAt = new Date();
  let csvInfoRecordId: ObjectId;
  const dataRows: any[] = [];
  let currentRowNumber = 0;

  const readStream = fs.createReadStream(filePath);
  const parser = csv();

  readStream.pipe(parser);

  parser.on("data", (data) => {
    dataRows.push(data);
    currentRowNumber++;
  });

  parser.on("end", async () => {
    try {
      const endedAt = new Date();
      fs.unlinkSync(filePath);
      const csvInfo: ICsvDataMapper = {
        filename: path.basename(filePath),
        startedat: startedAt,
        endedat: endedAt,
        noofuploadeddata: 0,
      };

      const csvInfoRecord = await CsvDataMapperRepository.insertCsvInfo(
        csvInfo
      );
      csvInfoRecordId = csvInfoRecord._id;

      const chunkSize = Math.ceil(dataRows.length / NUM_WORKERS);
      const chunks = Array.from({ length: NUM_WORKERS }, (_, i) =>
        dataRows.slice(i * chunkSize, (i + 1) * chunkSize)
      );

      const workerPromises = chunks.map(
        (chunk) =>
          new Promise<any[]>((resolve, reject) => {
            const worker = new Worker(path.join(__dirname, "workerScript.js"), {
              workerData: { data: chunk, csvInfoRecordId },
            });

            worker.on("message", resolve);
            worker.on("error", reject);
            worker.on("exit", (code) => {
              if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
              }
            });
          })
      );

      const results = await Promise.all(workerPromises);
      const customers: Partial<ICustomer>[] = [];
      const customersWithError: {
        rowNumber: number;
        validationerrors: string;
        csvid: ObjectId;
      }[] = [];

      results.forEach((resultArray) => {
        resultArray.forEach((result) => {
          if (result.validationerrors) {
            customersWithError.push(result);
          } else {
            customers.push(result);
          }
        });
      });

      const customersWithCsvId = customers.map((customer) => ({
        ...customer,
        csvid: csvInfoRecordId,
      }));

      customersWithError.forEach((errorRecord) => {
        errorRecord.csvid = csvInfoRecordId;
      });

      await CustomerRepository.insertCustomers(customersWithCsvId);
      await DataWithErrorRepository.insertErrorInfo(customersWithError);
      await CsvDataMapperRepository.updateCsvInfo(csvInfoRecordId.toString(), {
        endedat: new Date(),
        noofuploadeddata: customers.length,
      });

      res.status(200).json({
        message: "CSV file imported successfully.",
        totalRowsInserted: customers.length,
        errorData: customersWithError,
        errorDataLength: customersWithError.length,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Error importing CSV file");
    }
  });

  parser.on("error", (error) => {
    console.error("Error reading CSV file:", error);
    res.status(500).send("Error reading CSV file: " + error.message);
  });
};
