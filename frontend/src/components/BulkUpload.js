import React, { useState } from "react";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Layout } from "./Layout";

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
      const response = await fetch("http://localhost:9000/api/import-csv", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

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
          <h2>Select file to upload :</h2>
          <input
            id="file-input"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ position: "absolute", left: "-9999px" }}
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
                {errorData.map((error, index) => (
                  <TableRow key={index}>
                    <TableCell>{error.rowNumber}</TableCell>
                    <TableCell>{error.validationerrors}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
