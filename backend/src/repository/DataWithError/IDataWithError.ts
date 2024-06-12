import { Document } from "mongoose";

export interface IDataWithError extends Document {
  customerId: string;
  validationerrors: string;
}
