import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CustomerInfo } from "./components/CustomerInfo";
import { AddCustomer } from "./components/AddCustomer";
import { BulkUpload } from "./components/BulkUpload";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/v1">
          <Route path="customerlogs" element={<CustomerInfo />} />
          <Route path="addcustomer" element={<AddCustomer />} />
          <Route path="bulkupload" element={<BulkUpload />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
