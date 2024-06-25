import { ObjectId } from "mongodb";
import { DataWithErrorModel } from "./DataWithErrorModel";

class DataWithErrorRepository {
  insertErrorInfo = async (customersWithError: any[]): Promise<void> => {
    const BATCH_SIZE = 10000;
    try {
      for (let i = 0; i < customersWithError.length; i += BATCH_SIZE) {
        const batch = customersWithError.slice(i, i + BATCH_SIZE);
        await DataWithErrorModel.insertMany(batch, { ordered: false });
      }
    } catch (error) {
      console.error("Error inserting error info:", error);
      throw new Error("Error inserting error info");
    }
  };

  getErrorsByCsvId = async (csvId: string) => {
    const objectId = new ObjectId(csvId);
    return await DataWithErrorModel.find({ csvid: objectId });
  };
}

export default new DataWithErrorRepository();
