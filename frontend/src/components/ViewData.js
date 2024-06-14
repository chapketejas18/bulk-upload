import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import { Layout } from "./Layout";
import { useLocation } from "react-router-dom";

export const ViewData = () => {
  const location = useLocation();
  const { customerData } = location.state;

  return (
    <>
      <Layout />
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Card sx={{ width: 900, height: "550px" }}>
          <CardContent>
            <center>
              <Typography
                variant="h6"
                gutterBottom
                style={{ fontWeight: "bold" }}
              >
                {customerData.firstName} {customerData.lastName}
              </Typography>
            </center>
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell align="center">
                      <strong>Email:</strong>
                    </TableCell>
                    <TableCell align="center">{customerData.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center">
                      <strong>Customer ID:</strong>
                    </TableCell>
                    <TableCell align="center">
                      {customerData.customerId}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center">
                      <strong>Company:</strong>
                    </TableCell>
                    <TableCell align="center">
                      {customerData.company || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center">
                      <strong>City:</strong>
                    </TableCell>
                    <TableCell align="center">
                      {customerData.city || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center">
                      <strong>Country:</strong>
                    </TableCell>
                    <TableCell align="center">
                      {customerData.country || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center">
                      <strong>Phone 1:</strong>
                    </TableCell>
                    <TableCell align="center">{customerData.phone1}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center">
                      <strong>Phone 2:</strong>
                    </TableCell>
                    <TableCell align="center">
                      {customerData.phone2 || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center">
                      <strong>Subscription Date:</strong>
                    </TableCell>
                    <TableCell align="center">
                      {customerData.subscriptionDate
                        ? new Date(
                            customerData.subscriptionDate
                          ).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center">
                      <strong>Website:</strong>
                    </TableCell>
                    <TableCell align="center">
                      {customerData.website || "N/A"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
