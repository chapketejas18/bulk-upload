import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { Layout } from "./Layout";

export const CustomerInfo = () => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(30);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchCustomerData();
  }, [currentPage]);

  const fetchCustomerData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/customerinfo?page=${currentPage}&limit=${customersPerPage}`
      );
      const { customerData, totalCount } = response.data;
      setCustomers(customerData);
      setTotalCount(totalCount);
    } catch (error) {
      console.error("Error fetching customer information:", error);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const style = () => {
    return { border: 1, borderColor: "grey.400", fontWeight: "bold" };
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = Math.ceil(totalCount / customersPerPage) === currentPage;

  return (
    <div>
      <Layout />
      <TableContainer component={Paper}>
        <Table sx={style}>
          <TableHead>
            <TableRow>
              <TableCell sx={style}>Customer ID</TableCell>
              <TableCell sx={style}>First Name</TableCell>
              <TableCell sx={style}>Last Name</TableCell>
              <TableCell sx={style}>Company</TableCell>
              <TableCell sx={style}>City</TableCell>
              <TableCell sx={style}>Country</TableCell>
              <TableCell sx={style}>Phone 1</TableCell>
              <TableCell sx={style}>Phone 2</TableCell>
              <TableCell sx={style}>Email</TableCell>
              <TableCell sx={style}>Subscription Date</TableCell>
              <TableCell sx={style}>Website</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={12}
                  align="center"
                  sx={{ border: 1, borderColor: "grey.400" }}
                >
                  No data available at the moment. Please try again later.
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.customerId}>
                  <TableCell sx={{ border: 1, borderColor: "grey.400" }}>
                    {customer.customerId}
                  </TableCell>
                  <TableCell sx={{ border: 1, borderColor: "grey.400" }}>
                    {customer.firstName}
                  </TableCell>
                  <TableCell sx={{ border: 1, borderColor: "grey.400" }}>
                    {customer.lastName}
                  </TableCell>
                  <TableCell sx={{ border: 1, borderColor: "grey.400" }}>
                    {customer.company || "N/A"}
                  </TableCell>
                  <TableCell sx={{ border: 1, borderColor: "grey.400" }}>
                    {customer.city || "N/A"}
                  </TableCell>
                  <TableCell sx={{ border: 1, borderColor: "grey.400" }}>
                    {customer.country || "N/A"}
                  </TableCell>
                  <TableCell sx={{ border: 1, borderColor: "grey.400" }}>
                    {customer.phone1}
                  </TableCell>
                  <TableCell sx={{ border: 1, borderColor: "grey.400" }}>
                    {customer.phone2 || "N/A"}
                  </TableCell>
                  <TableCell sx={{ border: 1, borderColor: "grey.400" }}>
                    {customer.email}
                  </TableCell>
                  <TableCell sx={{ border: 1, borderColor: "grey.400" }}>
                    {customer.subscriptionDate
                      ? new Date(customer.subscriptionDate).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell sx={{ border: 1, borderColor: "grey.400" }}>
                    {customer.website || "N/A"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {customers.length !== 0 && (
        <div style={{ marginTop: "20px", textAlign: "right" }}>
          <Button
            disabled={isFirstPage}
            onClick={() => paginate(currentPage - 1)}
          >
            Prev
          </Button>
          <span style={{ margin: "0 10px" }}>Page {currentPage}</span>
          <Button
            disabled={isLastPage}
            onClick={() => paginate(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
