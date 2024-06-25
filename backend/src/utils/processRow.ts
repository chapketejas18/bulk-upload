import { ObjectId } from "mongodb";
import { customerSchema } from "../config/customerSchema";
import { ICustomer } from "../repository/CustomerData/ICustomer";

interface ProcessRowResult {
  rowNumber: number;
  validationerrors: string;
  csvid: ObjectId;
}

export const processRow = (
  data: Record<string, any>,
  currentRowNumber: number,
  csvInfoRecordId: ObjectId
): Partial<ICustomer> | ProcessRowResult | null => {
  try {
    const customer: Partial<ICustomer> = {
      customerId: data["Customer Id"],
      firstName: data["First Name"],
      lastName: data["Last Name"],
      company: data.Company,
      city: data.City,
      country: data.Country,
      phone1: data["Phone 1"],
      phone2: data["Phone 2"],
      email: data.Email,
      website: data.Website,
    };

    const { error } = customerSchema.validate(customer);
    if (error) {
      return {
        rowNumber: currentRowNumber,
        validationerrors: error.message,
        csvid: csvInfoRecordId,
      };
    }

    return customer;
  } catch (error) {
    console.error("Error parsing row:", error, data);
    return null;
  }
};
