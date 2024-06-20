import Customer from "./CustomerModel";
import { ICustomer } from "./ICustomer";

class CustomerRepository {
  insertCustomers = async (customers: Partial<ICustomer>[]): Promise<void> => {
    try {
      const batchSize = 1000;
      let bulkOpCustomers = Customer.collection.initializeUnorderedBulkOp();

      for (let i = 0; i < customers.length; i += batchSize) {
        const batchCustomers = customers.slice(i, i + batchSize);
        batchCustomers.forEach((customer) => {
          bulkOpCustomers.insert(customer);
        });
        await bulkOpCustomers.execute();
        bulkOpCustomers = Customer.collection.initializeUnorderedBulkOp();
      }
    } catch (error) {
      console.log(error);
      throw new Error("Error inserting customers");
    }
  };

  getAllCustomers = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    return await Customer.find().skip(skip).limit(limit);
  };

  getCustomerCount = async () => {
    return await Customer.countDocuments();
  };

  addCustomer = async (body: ICustomer) => {
    return await Customer.create(body);
  };

  searchCustomers = async (searchField: string, searchText: string) => {
    const query = { [searchField]: new RegExp(searchText, "i") };
    return await Customer.find(query);
  };

  getCustomerById = async (customerId: string) => {
    return await Customer.findOne({ customerId }, { _id: 0 });
  };

  updateCustomer = async (customerId: string, newData: Partial<ICustomer>) => {
    return await Customer.findOneAndUpdate({ customerId }, newData, {
      new: true,
    });
  };
}

export default new CustomerRepository();
