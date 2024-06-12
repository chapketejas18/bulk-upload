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
    return Customer.find().skip(skip).limit(limit);
  };

  getCustomerCount = async () => {
    return Customer.countDocuments();
  };

  addCustomer = async (body: ICustomer) => {
    return Customer.create(body);
  };
}

export default new CustomerRepository();
