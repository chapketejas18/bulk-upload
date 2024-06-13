import { Schema } from "mongoose";
import { IDataWithError } from "./IDataWithError";

export const DataWithErrorSchema: Schema<IDataWithError> = new Schema({
  rowNumber: { type: Number, required: true },
  validationerrors: { type: String, required: true },
});
