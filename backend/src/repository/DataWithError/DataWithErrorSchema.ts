import { Schema } from "mongoose";
import { IDataWithError } from "./IDataWithError";

export const DataWithErrorSchema: Schema<IDataWithError> = new Schema({
  customerId: { type: String, required: true },
  validationerrors: { type: String, required: true },
});
