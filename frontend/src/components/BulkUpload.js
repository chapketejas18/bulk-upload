import React, { useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
  TablePagination,
  IconButton,
} from "@mui/material";
import { Layout } from "./Layout";
import axios from "axios";
import { ArrowCircleLeft } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export const BulkUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [totalRowsInserted, setTotalRowsInserted] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [uploadingProgress, setUploadingProgress] = useState(false);
  const [errorData, setErrorData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setStartTime(new Date());
    setUploadingProgress(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:9000/api/import-csv",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.statusText !== "OK") {
        throw new Error("Upload failed");
      }
      const data = response.data;
      setEndTime(new Date());
      setTotalRowsInserted(data.totalRowsInserted);
      setErrorData(data.errorData || []);

      setSnackbarSeverity("success");
      setSnackbarMessage("File uploaded successfully!");
      setSnackbarOpen(true);
      setFile(null);
      document.getElementById("file-input").value = "";
    } catch (error) {
      console.error("Upload failed:", error.message);

      setSnackbarSeverity("error");
      setSnackbarMessage(`Upload failed: ${error.message}`);
      setSnackbarOpen(true);
    } finally {
      setUploading(false);
      setUploadingProgress(false);
    }
  };

  const formatTime = (time) => {
    if (!time) return "-";
    return time.toLocaleTimeString();
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <Layout />
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={() => navigate("/v1/customerlogs")}
            sx={{ margin: 1 }}
            data-testid="navigate-button"
          >
            <ArrowCircleLeft />
          </IconButton>
          <h2>Select file to upload :</h2>
          <input
            id="file-input"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ position: "absolute", left: "-9999px" }}
            data-testid="file-input"
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={() => document.getElementById("file-input").click()}
            style={{ marginLeft: "10px" }}
          >
            Choose File
          </Button>
        </div>

        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          variant="contained"
          color="primary"
          style={{ marginTop: "10px" }}
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>
        {file && (
          <div style={{ marginTop: "10px" }}>Selected file : {file.name}</div>
        )}
      </div>
      {startTime && endTime && (
        <>
          <h2>Upload summary</h2>
          <TableContainer
            component={Paper}
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Start Time</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>End Time</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Total Rows Inserted
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{formatTime(startTime)}</TableCell>
                  <TableCell>{formatTime(endTime)}</TableCell>
                  <TableCell>{totalRowsInserted}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      {errorData.length > 0 && (
        <>
          <h2>Error Details</h2>
          <TableContainer
            component={Paper}
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Row Number</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Error Details
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {errorData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((error, index) => (
                    <TableRow key={index}>
                      <TableCell>{error.rowNumber}</TableCell>
                      <TableCell>{error.validationerrors}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={errorData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={uploadingProgress}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};
