"use strict";
// import Customer, { customerErrorModel } from "./CustomerModel";
// import { ICustomer } from "./ICustomer";
// class CustomerRepository {
//   insertCustomers = async (
//     customers: Partial<ICustomer>[],
//     customersWithError: Partial<ICustomer>[]
//   ): Promise<void> => {
//     try {
//       const batchSize = 1000;
//       let bulkOpCustomers = Customer.collection.initializeUnorderedBulkOp();
//       let bulkOpErrors =
//         customerErrorModel.collection.initializeUnorderedBulkOp();
//       for (let i = 0; i < customers.length; i += batchSize) {
//         const batchCustomers = customers.slice(i, i + batchSize);
//         batchCustomers.forEach((customer) => {
//           bulkOpCustomers.insert(customer);
//         });
//         await bulkOpCustomers.execute();
//         bulkOpCustomers = Customer.collection.initializeUnorderedBulkOp();
//       }
//       for (let i = 0; i < customersWithError.length; i += batchSize) {
//         const batchErrors = customersWithError.slice(i, i + batchSize);
//         batchErrors.forEach((errorCustomer) => {
//           bulkOpErrors.insert(errorCustomer);
//         });
//         await bulkOpErrors.execute();
//         bulkOpErrors =
//           customerErrorModel.collection.initializeUnorderedBulkOp();
//       }
//     } catch (error) {
//       console.log(error);
//       throw new Error("Error inserting customers");
//     }
//   };
//   getAllCustomers = async (page: number, limit: number) => {
//     const skip = (page - 1) * limit;
//     return Customer.find().skip(skip).limit(limit);
//   };
//   getCustomerCount = async () => {
//     return Customer.countDocuments();
//   };
//   addCustomer = async (body: ICustomer) => {
//     return Customer.create(body);
//   };
//   addToErrorTable = async (body: Partial<ICustomer>) => {
//     return customerErrorModel.create(body);
//   };
// }
// export default new CustomerRepository();
