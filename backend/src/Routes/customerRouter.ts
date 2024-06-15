import { Router } from "express";
import { importCSV } from "../Controllers/csvController";
import { uploadCSV } from "../Middleware/upload";
import customerController from "../Controllers/customerController";

const router = Router();

router.get("/customerinfo", customerController.getAllCustomerData);
router.post("/addcustomer", customerController.createData);
router.post("/import-csv", uploadCSV, importCSV);
router.post("/search", customerController.searchCustomer);
router.post("/get-customer", customerController.getSingleCustomer);
router.put("/edit-customer", customerController.editCustomer);
router.get("/getcsvinfo", customerController.getCsvInfos);

export default router;
