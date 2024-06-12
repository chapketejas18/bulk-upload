import { CsvDataMapperModel } from "./CsvDataMapperModel";
import { ICsvDataMapper } from "./ICsvDataMapper";

class CsvDataMapperRepository {
  insertCsvInfo = async (csvinfo: ICsvDataMapper) => {
    return CsvDataMapperModel.create(csvinfo);
  };
}

export default new CsvDataMapperRepository();
