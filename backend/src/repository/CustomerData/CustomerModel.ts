import mongoose from "mongoose";
import { ICustomer } from "./ICustomer";
import { CustomerSchema } from "./CustomerSchema";

export default mongoose.model<ICustomer>("customerlog", CustomerSchema);
