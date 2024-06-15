import { CsvDataMapperModel } from "./CsvDataMapperModel";
import { ICsvDataMapper } from "./ICsvDataMapper";

class CsvDataMapperRepository {
  insertCsvInfo = async (csvinfo: ICsvDataMapper) => {
    return CsvDataMapperModel.create(csvinfo);
  };

  updateCsvInfo = async (
    id: string,
    updateData: Partial<ICsvDataMapper>
  ): Promise<void> => {
    try {
      await CsvDataMapperModel.updateOne({ _id: id }, { $set: updateData });
    } catch (error) {
      console.log(error);
      throw new Error("Error updating CSV info");
    }
  };

  getInfoData = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    return await CsvDataMapperModel.find().skip(skip).limit(limit);
  };
}

export default new CsvDataMapperRepository();
