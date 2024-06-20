import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CustomerInfo } from "./components/CustomerInfo";
import { AddCustomer } from "./components/AddCustomer";
import { BulkUpload } from "./components/BulkUpload";
import { ViewData } from "./components/ViewData";
import { EditCustomer } from "./components/EditCustomer";
import { BulkListing } from "./components/BulkListing";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/v1/customerlogs" />} />
        <Route path="/*" element={<Navigate to="/v1/customerlogs" />} />
        <Route path="/v1">
          <Route path="customerlogs" element={<CustomerInfo />} />
          <Route path="addcustomer" element={<AddCustomer />} />
          <Route path="bulkupload" element={<BulkUpload />} />
          <Route path="viewdata" element={<ViewData />} />
          <Route path="editcustomer" element={<EditCustomer />} />
          <Route path="bulklisting" element={<BulkListing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
