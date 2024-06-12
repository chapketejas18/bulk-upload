import mongoose from "mongoose";
import { ICsvDataMapper } from "./ICsvDataMapper";
import { CsvDataMapperSchema } from "./CsvDataMapperSchema";

export const CsvDataMapperModel = mongoose.model<ICsvDataMapper>(
  "csvinfo",
  CsvDataMapperSchema
);
