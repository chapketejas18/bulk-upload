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
  IconButton,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import { Visibility, Edit, Add, CloudUpload } from "@mui/icons-material";
import { Layout } from "./Layout";
import { useNavigate } from "react-router-dom";

export const CustomerInfo = () => {
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [totalCount, setTotalCount] = useState(0);
  const [searchActive, setSearchActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchActive) {
      fetchCustomerData();
    }
  }, [page, rowsPerPage, searchActive]);

  const fetchCustomerData = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchText) => {
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:9000/api/search`, {
        searchField: "firstName",
        searchText: searchText,
        page: page + 1,
        limit: rowsPerPage,
      });
      setCustomers(response.data.searchData);
      setTotalCount(response.data.searchData.length);
      setSearchActive(true);
    } catch (error) {
      console.error("Error searching customer information:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (customerId) => {
    try {
      const response = await axios.post(
        `http://localhost:9000/api/get-customer`,
        { customerId }
      );
      navigate("/v1/viewdata", {
        state: { customerData: response.data.customer },
      });
    } catch (error) {
      console.error("Error fetching customer information:", error);
    }
  };

  const handleEdit = async (customerId) => {
    navigate("/v1/editcustomer", {
      state: { customerId: customerId },
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    if (totalCount <= newRowsPerPage) {
      setRowsPerPage(newRowsPerPage);
      setPage(0);
    } else {
      setRowsPerPage(newRowsPerPage);
      setPage(0);
      if (!searchActive) {
        fetchCustomerData();
      }
    }
  };

  const handleAddCustomer = () => {
    navigate("/v1/addcustomer");
  };

  const handleBulkUpload = () => {
    navigate("/v1/bulkupload");
  };

  const style = () => {
    return { border: 1, borderColor: "grey.400", fontWeight: "bold" };
  };

  return (
    <div>
      <Layout onSearch={handleSearch} />
      <Box display="flex" justifyContent="flex-end" marginBottom={2}>
        <Button
          color="primary"
          variant="outlined"
          onClick={handleAddCustomer}
          startIcon={<Add />}
          sx={{ border: "1px solid", marginRight: 2 }}
        >
          Add Customer
        </Button>
        <Button
          color="primary"
          variant="outlined"
          onClick={handleBulkUpload}
          startIcon={<CloudUpload />}
          sx={{ border: "1px solid" }}
        >
          Bulk Upload
        </Button>
      </Box>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress />
        </Box>
      ) : (
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
                <TableCell sx={style}>Actions</TableCell>
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
                  <TableRow key={customer._id}>
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
                        ? new Date(
                            customer.subscriptionDate
                          ).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell sx={{ border: 1, borderColor: "grey.400" }}>
                      {customer.website || "N/A"}
                    </TableCell>
                    <TableCell sx={{ border: 1, borderColor: "grey.400" }}>
                      <Box display="flex">
                        <IconButton
                          onClick={() => handleView(customer.customerId)}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          onClick={() => handleEdit(customer.customerId)}
                        >
                          <Edit />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {customers.length !== 0 && (
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[100, 500, 1000, 5000, 10000]}
          nextIconButtonProps={{
            disabled: page >= Math.ceil(totalCount / rowsPerPage) - 1,
          }}
          backIconButtonProps={{
            disabled: page === 0,
          }}
        />
      )}
    </div>
  );
};
