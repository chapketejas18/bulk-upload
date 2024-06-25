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
const mongodb_1 = require("mongodb");
const DataWithErrorModel_1 = require("./DataWithErrorModel");
class DataWithErrorRepository {
    constructor() {
        this.insertErrorInfo = (customersWithError) => __awaiter(this, void 0, void 0, function* () {
            const BATCH_SIZE = 10000;
            try {
                for (let i = 0; i < customersWithError.length; i += BATCH_SIZE) {
                    const batch = customersWithError.slice(i, i + BATCH_SIZE);
                    yield DataWithErrorModel_1.DataWithErrorModel.insertMany(batch, { ordered: false });
                }
            }
            catch (error) {
                console.error("Error inserting error info:", error);
                throw new Error("Error inserting error info");
            }
        });
        this.getErrorsByCsvId = (csvId) => __awaiter(this, void 0, void 0, function* () {
            const objectId = new mongodb_1.ObjectId(csvId);
            return yield DataWithErrorModel_1.DataWithErrorModel.find({ csvid: objectId });
        });
    }
}
exports.default = new DataWithErrorRepository();
