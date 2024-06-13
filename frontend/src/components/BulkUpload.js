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
  const [file, setFile] = useState(null); // State to store selected file
  const [uploading, setUploading] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [totalRowsInserted, setTotalRowsInserted] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [uploadingProgress, setUploadingProgress] = useState(false); // State for showing the backdrop

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
    setUploadingProgress(true); // Show backdrop with circular progress

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

      setSnackbarSeverity("success");
      setSnackbarMessage("File uploaded successfully!");
      setSnackbarOpen(true);

      // Clear selected file after successful upload
      setFile(null);
      // Reset the file input value to clear the displayed file name
      document.getElementById("file-input").value = "";
    } catch (error) {
      console.error("Upload failed:", error.message);

      setSnackbarSeverity("error");
      setSnackbarMessage(`Upload failed: ${error.message}`);
      setSnackbarOpen(true);
    } finally {
      setUploading(false);
      setUploadingProgress(false); // Hide backdrop after upload completes
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
          <h2>Select file to upload:</h2>
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
        <TableContainer component={Paper} style={{ marginTop: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Total Rows Inserted</TableCell>
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
