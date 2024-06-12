import Customer, { customerErrorModel } from "./CustomerModel";
import { ICustomer } from "./ICustomer";

class CustomerRepository {
  insertCustomers = async (customers: Partial<ICustomer>[]): Promise<void> => {
    try {
      await Customer.insertMany(customers);
    } catch (error) {
      console.log(error);
      throw new Error("Error inserting customers");
    }
  };

  getAllCustomers = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    return Customer.find().skip(skip).limit(limit);
  };

  getCustomerCount = async () => {
    return Customer.countDocuments();
  };

  addCustomer = async (body: ICustomer) => {
    return Customer.create(body);
  };

  addToErrorTable = async (body: Partial<ICustomer>) => {
    return customerErrorModel.create(body);
  };
}

export default new CustomerRepository();
