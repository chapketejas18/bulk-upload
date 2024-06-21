import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TableContainer,
  TablePagination,
  Paper,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import { Visibility, Edit, Add, CloudUpload } from "@mui/icons-material";
import { Layout } from "./Layout";
import { useNavigate } from "react-router-dom";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

export const CustomerInfo = () => {
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomerData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  const fetchCustomerData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:9000/api/customerinfo?page=${
          page + 1
        }&limit=${rowsPerPage}`,
        searchActive ? { searchField: "firstName", searchText } : {}
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
      setSearchText(searchText);
      setSearchActive(true);
      setPage(0);
      const response = await axios.post(
        `http://localhost:9000/api/customerinfo?page=1&limit=${rowsPerPage}`,
        {
          searchField: "firstName",
          searchText: searchText,
        }
      );
      const { customerData, totalCount } = response.data;
      setCustomers(customerData);
      setTotalCount(totalCount);
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
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddCustomer = () => {
    navigate("/v1/addcustomer");
  };

  const handleBulkUpload = () => {
    navigate("/v1/bulkupload");
  };

  const columns = [
    {
      id: "index",
      header: "Index",
      cell: (info) => info.row.index + 1 + page * rowsPerPage,
    },
    { accessorKey: "customerId", header: "Customer ID" },
    { accessorKey: "firstName", header: "First Name" },
    { accessorKey: "lastName", header: "Last Name" },
    {
      accessorKey: "company",
      header: "Company",
    },
    {
      accessorKey: "city",
      header: "City",
    },
    {
      accessorKey: "country",
      header: "Country",
    },
    { accessorKey: "phone1", header: "Phone 1" },
    {
      accessorKey: "phone2",
      header: "Phone 2",
    },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "website",
      header: "Website",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: (info) => (
        <Box display="flex">
          <IconButton onClick={() => handleView(info.row.original.customerId)}>
            <Visibility />
          </IconButton>
          <IconButton onClick={() => handleEdit(info.row.original.customerId)}>
            <Edit />
          </IconButton>
        </Box>
      ),
    },
  ];

  const table = useReactTable({
    data: customers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => document.getElementById("table-container"),
    estimateSize: () => 35,
    overscan: 10,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - virtualRows[virtualRows.length - 1].end
      : 0;

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
          height="75vh"
        >
          <CircularProgress />
        </Box>
      ) : customers.length === 0 ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="75vh"
        >
          <Typography>
            No data available at the moment, please try again later!
          </Typography>
        </Box>
      ) : (
        <TableContainer
          id="table-container"
          component={Paper}
          sx={{ height: "75vh", overflowY: "auto" }}
        >
          <table
            style={{
              width: "100%",
              tableLayout: "fixed",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      style={{
                        border: "1px solid grey",
                        fontWeight: "bold",
                        padding: "8px",
                        width: header.column.getSize(),
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              <tr style={{ height: `${paddingTop}px` }} />
              {virtualRows.map((virtualRow) => {
                const row = table.getRowModel().rows[virtualRow.index];
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        style={{
                          border: "1px solid grey",
                          padding: "8px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
              <tr style={{ height: `${paddingBottom}px` }} />
            </tbody>
          </table>
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
