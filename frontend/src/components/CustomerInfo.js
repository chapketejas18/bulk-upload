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
  TablePagination,
} from "@mui/material";
import { Layout } from "./Layout";

export const CustomerInfo = () => {
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchCustomerData();
  }, [page, rowsPerPage]);

  const fetchCustomerData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/customerinfo?page=${
          page + 1
        }&limit=${rowsPerPage}`
      );
      const { customerData, totalCount } = response.data;
      setCustomers(customerData);
      setTotalCount(totalCount);
    } catch (error) {
      console.error("Error fetching customer information:", error);
    }
  };

  const handleSearch = async (searchText) => {
    try {
      const response = await axios.post(`http://localhost:9000/api/search`, {
        searchField: "customerId",
        searchText: searchText,
      });
      setCustomers(response.data.searchData);
      setTotalCount(response.data.searchData.length);
    } catch (error) {
      console.error("Error searching customer information:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const style = () => {
    return { border: 1, borderColor: "grey.400", fontWeight: "bold" };
  };

  return (
    <div>
      <Layout onSearch={handleSearch} />
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
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[100, 500, 1000, 5000, 10000]}
        />
      )}
    </div>
  );
};
