import { DataWithErrorModel } from "./DataWithErrorModel";

class DataWithErrorRepository {
  insertErrorInfo = async (customersWithError: any): Promise<void> => {
    try {
      await DataWithErrorModel.insertMany(customersWithError);
    } catch (error) {
      console.log(error);
      throw new Error("Error inserting customers");
    }
  };
}

export default new DataWithErrorRepository();
