"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const UserModel_1 = __importStar(require("./UserModel"));
const customerSchema_1 = require("../config/customerSchema");
class UserRepository {
    constructor() {
        this.insertUsers = (users) => __awaiter(this, void 0, void 0, function* () {
            try {
                for (const user of users) {
                    const { error } = customerSchema_1.customerSchema.validate(user);
                    if (error) {
                        const existingUser = yield UserModel_1.userErrorModel.findOne({
                            customerId: user.customerId,
                        });
                        if (existingUser) {
                            console.log(`Customer with ID ${user.customerId} already exists in the User table.`);
                            continue;
                        }
                        yield this.addToErrorTable(user);
                    }
                    else {
                        const existingUser = yield UserModel_1.default.findOne({
                            customerId: user.customerId,
                        });
                        if (existingUser) {
                            console.log(`Customer with ID ${user.customerId} already exists in the User table.`);
                            continue;
                        }
                        yield UserModel_1.default.create(user);
                    }
                }
            }
            catch (error) {
                console.log(error);
                throw new Error("Error inserting users");
            }
        });
        this.getAllCustomers = (page, limit) => __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            return UserModel_1.default.find().skip(skip).limit(limit);
        });
        this.getCustomerCount = () => __awaiter(this, void 0, void 0, function* () {
            return UserModel_1.default.countDocuments();
        });
        this.addCustomer = (body) => __awaiter(this, void 0, void 0, function* () {
            return UserModel_1.default.create(body);
        });
        this.addToErrorTable = (body) => __awaiter(this, void 0, void 0, function* () {
            return UserModel_1.userErrorModel.create(body);
        });
    }
}
exports.default = new UserRepository();
