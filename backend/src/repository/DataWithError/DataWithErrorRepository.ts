import { ObjectId } from "mongodb";
import { DataWithErrorModel } from "./DataWithErrorModel";

class DataWithErrorRepository {
  insertErrorInfo = async (customersWithError: any): Promise<void> => {
    try {
      await DataWithErrorModel.insertMany(customersWithError);
    } catch (error) {
      throw new Error("Error inserting customers");
    }
  };

  getErrorsByCsvId = async (csvId: string) => {
    const objectId = new ObjectId(csvId);
    return await DataWithErrorModel.find({ csvid: objectId });
  };
}

export default new DataWithErrorRepository();
