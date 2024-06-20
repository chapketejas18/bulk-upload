import React, { useState, useEffect } from "react";
import { Layout } from "./Layout";
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
  Button,
} from "@mui/material";

export const BulkListing = () => {
  const [csvInfoData, setCsvInfoData] = useState(null);
  const [errorData, setErrorData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [pageError, setPageError] = useState(0);
  const [rowsPerPageError, setRowsPerPageError] = useState(5);

  useEffect(() => {
    const fetchCsvInfoData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9000/api/getcsvinfo"
        );
        if (
          response.data &&
          response.data.csvInfoData &&
          response.data.csvInfoData.length > 0
        ) {
          setCsvInfoData(response.data.csvInfoData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCsvInfoData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePageError = (event, newPage) => {
    setPageError(newPage);
  };

  const handleChangeRowsPerPageError = (event) => {
    setRowsPerPageError(parseInt(event.target.value, 10));
    setPageError(0);
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const style = () => {
    return { border: 1, borderColor: "grey.400", fontWeight: "bold" };
  };

  const handleViewClick = async (id) => {
    try {
      // Clear existing error data
      setErrorData(null);

      // Fetch new error data
      const response = await axios.get(
        `http://localhost:9000/api/getallerrorsofcsv?id=${id}`
      );
      if (response.data && response.data.errorData) {
        setErrorData(response.data.errorData);
      }
    } catch (error) {
      console.error("Error fetching error data:", error);
    }
  };

  const clearErrorData = () => {
    setErrorData(null);
  };

  return (
    <div>
      <Layout />
      <TableContainer component={Paper}>
        <Table sx={style}>
          <TableHead>
            <TableRow>
              <TableCell sx={style}>Started At</TableCell>
              <TableCell sx={style}>Ended At</TableCell>
              <TableCell sx={style}>Filename</TableCell>
              <TableCell sx={style}>No of Uploaded Data</TableCell>
              <TableCell sx={style}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {csvInfoData &&
              csvInfoData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item) => (
                  <TableRow key={item._id}>
                    <TableCell sx={{ border: 1, borderColor: "grey.400" }}>
                      {formatDateTime(item.startedat)}
                    </TableCell>
                    <TableCell sx={{ border: 1, borderColor: "grey.400" }}>
                      {formatDateTime(item.endedat)}
                    </TableCell>
                    <TableCell sx={{ border: 1, borderColor: "grey.400" }}>
                      {item.filename}
                    </TableCell>
                    <TableCell sx={{ border: 1, borderColor: "grey.400" }}>
                      {item.noofuploadeddata}
                    </TableCell>
                    <TableCell sx={{ border: 1, borderColor: "grey.400" }}>
                      <Button
                        color="primary"
                        onClick={() => handleViewClick(item._id)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            {!csvInfoData && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  sx={{ border: 1, borderColor: "grey.400" }}
                >
                  No data available at the moment. Please try again later.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={csvInfoData ? csvInfoData.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {errorData && (
        <div>
          <h2>Error Data</h2>
          <TableContainer component={Paper}>
            <Table sx={style}>
              <TableHead>
                <TableRow>
                  <TableCell sx={style}>Row Number</TableCell>
                  <TableCell sx={style}>Errors</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {errorData
                  .slice(
                    pageError * rowsPerPageError,
                    pageError * rowsPerPageError + rowsPerPageError
                  )
                  .map((error) => (
                    <TableRow key={error.csvid}>
                      <TableCell sx={{ border: 1, borderColor: "grey.400" }}>
                        {error.rowNumber}
                      </TableCell>
                      <TableCell sx={{ border: 1, borderColor: "grey.400" }}>
                        {error.validationerrors}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={errorData ? errorData.length : 0}
            rowsPerPage={rowsPerPageError}
            page={pageError}
            onPageChange={handleChangePageError}
            onRowsPerPageChange={handleChangeRowsPerPageError}
          />
          <Button onClick={clearErrorData}>Hide Error Data</Button>
        </div>
      )}
    </div>
  );
};
