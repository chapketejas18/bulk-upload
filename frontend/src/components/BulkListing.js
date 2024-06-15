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
  Box,
} from "@mui/material";

export const BulkListing = () => {
  const [csvInfoData, setCsvInfoData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    axios
      .get("http://localhost:9000/api/getcsvinfo")
      .then((response) => {
        if (
          response.data &&
          response.data.csvInfoData &&
          response.data.csvInfoData.length > 0
        ) {
          setCsvInfoData(response.data.csvInfoData);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
                  </TableRow>
                ))}
            {!csvInfoData && (
              <TableRow>
                <TableCell
                  colSpan={4}
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
    </div>
  );
};
