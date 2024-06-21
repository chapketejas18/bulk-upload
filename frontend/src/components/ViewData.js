import React from "react";
import {
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { Layout } from "./Layout";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";

export const ViewData = () => {
  const location = useLocation();
  const { customerData } = location.state;
  const navigate = useNavigate();

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
        <Card sx={{ margin: 3, padding: 3, width: 900, position: "relative" }}>
          <IconButton
            onClick={() => navigate("/v1/customerlogs")}
            sx={{ position: "absolute", left: 10, top: 10 }}
          >
            <ArrowBack />
          </IconButton>
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
