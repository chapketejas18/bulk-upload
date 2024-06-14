import { Document } from "mongoose";
import { ObjectId } from "mongodb";

export interface IDataWithError extends Document {
  rowNumber: number;
  validationerrors: string;
  csvid: ObjectId;
}
