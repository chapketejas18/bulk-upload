import { Schema } from "mongoose";
import { ICsvDataMapper } from "./ICsvDataMapper";
import { required } from "joi";

export const CsvDataMapperSchema: Schema<ICsvDataMapper> = new Schema({
  startedat: { type: Date, required: true },
  endedat: { type: Date, required: true },
  filename: { type: String, required: true },
  noofuploadeddata: { type: Number, required: true },
});
