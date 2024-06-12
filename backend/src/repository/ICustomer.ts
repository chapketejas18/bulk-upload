import { Document } from "mongoose";

export interface ICustomer extends Document {
  index: number;
  customerId: string;
  firstName: string;
  lastName: string;
  company?: string;
  city?: string;
  country?: string;
  phone1: string;
  phone2?: string;
  email: string;
  subscriptionDate?: Date;
  website?: string;
}
