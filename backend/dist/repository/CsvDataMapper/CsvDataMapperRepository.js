"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const CsvDataMapperModel_1 = require("./CsvDataMapperModel");
class CsvDataMapperRepository {
    constructor() {
        this.insertCsvInfo = (csvinfo) => __awaiter(this, void 0, void 0, function* () {
            return yield CsvDataMapperModel_1.CsvDataMapperModel.create(csvinfo);
        });
        this.updateCsvInfo = (id, updateData) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield CsvDataMapperModel_1.CsvDataMapperModel.updateOne({ _id: id }, { $set: updateData });
            }
            catch (error) {
                console.log(error);
                throw new Error("Error updating CSV info");
            }
        });
        this.getInfoData = (page, limit) => __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            return yield CsvDataMapperModel_1.CsvDataMapperModel.find().skip(skip).limit(limit);
        });
    }
}
exports.default = new CsvDataMapperRepository();
