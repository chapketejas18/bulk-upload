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
}

export default new CsvDataMapperRepository();
