"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processRow = void 0;
const customerSchema_1 = require("../config/customerSchema");
const processRow = (data, currentRowNumber, csvInfoRecordId) => {
    try {
        const customer = {
            customerId: data["Customer Id"],
            firstName: data["First Name"],
            lastName: data["Last Name"],
            company: data.Company,
            city: data.City,
            country: data.Country,
            phone1: data["Phone 1"],
            phone2: data["Phone 2"],
            email: data.Email,
            website: data.Website,
        };
        const { error } = customerSchema_1.customerSchema.validate(customer);
        if (error) {
            return {
                rowNumber: currentRowNumber,
                validationerrors: error.message,
                csvid: csvInfoRecordId,
            };
        }
        return customer;
    }
    catch (error) {
        console.error("Error parsing row:", error, data);
        return null;
    }
};
exports.processRow = processRow;
