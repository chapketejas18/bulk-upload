import { Schema } from "mongoose";
import { ICustomer } from "./ICustomer";

export const CustomerSchema: Schema<ICustomer> = new Schema(
  {
    customerId: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    company: { type: String },
    city: { type: String },
    country: { type: String },
    phone1: { type: String, required: true },
    phone2: { type: String },
    email: { type: String, required: true },
    website: { type: String },
    csvid: {
      type: Schema.Types.ObjectId,
      ref: "csvinfo",
    },
  },
  { timestamps: true }
);
