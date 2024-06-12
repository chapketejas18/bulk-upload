import { Schema } from "mongoose";
import { ICsvDataMapper } from "./ICsvDataMapper";

export const CsvDataMapperSchema: Schema<ICsvDataMapper> = new Schema({
  startedat: { type: Date, required: true },
  endedat: { type: Date, required: true },
  filename: { type: String, required: true },
});
