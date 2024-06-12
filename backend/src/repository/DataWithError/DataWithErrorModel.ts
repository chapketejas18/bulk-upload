import mongoose from "mongoose";
import { DataWithErrorSchema } from "./DataWithErrorSchema";
import { IDataWithError } from "./IDataWithError";

export const DataWithErrorModel = mongoose.model<IDataWithError>(
  "customerlogswitherror",
  DataWithErrorSchema
);
