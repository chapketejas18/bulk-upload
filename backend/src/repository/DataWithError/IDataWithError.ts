import { Document } from "mongoose";

export interface IDataWithError extends Document {
  rowNumber: number;
  validationerrors: string;
}
