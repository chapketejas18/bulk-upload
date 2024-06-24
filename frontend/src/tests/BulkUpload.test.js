/* eslint-disable testing-library/prefer-presence-queries */
/* eslint-disable no-undef */
/* eslint-disable testing-library/prefer-find-by */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import { BulkUpload } from "../components/BulkUpload";
import "@testing-library/jest-dom/extend-expect";

jest.mock("axios");

describe("BulkUpload component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <MemoryRouter>
        <BulkUpload />
      </MemoryRouter>
    );
  };

  test("file input changes when a file is selected", () => {
    renderComponent();
    const fileInput = screen.getByTestId("file-input");
    const file = new File(["file content"], "example.csv", {
      type: "text/csv",
    });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(screen.getByText("Selected file : example.csv")).toBeInTheDocument();
  });

  test("upload button is disabled when no file is selected or when uploading", () => {
    renderComponent();
    const uploadButton = screen.getByRole("button", { name: /upload/i });
    expect(uploadButton).toBeDisabled();

    const fileInput = screen.getByTestId("file-input");
    const file = new File(["file content"], "example.csv", {
      type: "text/csv",
    });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(uploadButton).not.toBeDisabled();
  });

  test("upload function is called when upload button is clicked", async () => {
    renderComponent();
    const uploadButton = screen.getByRole("button", { name: /upload/i });
    const fileInput = screen.getByTestId("file-input");
    const file = new File(["file content"], "example.csv", {
      type: "text/csv",
    });
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(uploadButton);

    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:9000/api/import-csv",
      expect.any(FormData),
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  });

  test("snackbar displays the correct message and severity", async () => {
    renderComponent();
    const uploadButton = screen.getByRole("button", { name: /upload/i });
    const fileInput = screen.getByTestId("file-input");
    const file = new File(["file content"], "example.csv", {
      type: "text/csv",
    });
    fireEvent.change(fileInput, { target: { files: [file] } });

    axios.post.mockResolvedValueOnce({
      statusText: "OK",
      data: { totalRowsInserted: 10, errorData: [] },
    });

    fireEvent.click(uploadButton);

    await waitFor(() =>
      expect(
        screen.getByText("File uploaded successfully!")
      ).toBeInTheDocument()
    );
    expect(screen.getByRole("alert")).toHaveClass("MuiAlert-filledSuccess");
  });

  test("snackbar displays error message on upload failure", async () => {
    renderComponent();
    const uploadButton = screen.getByRole("button", { name: /upload/i });
    const fileInput = screen.getByTestId("file-input");
    const file = new File(["file content"], "example.csv", {
      type: "text/csv",
    });
    fireEvent.change(fileInput, { target: { files: [file] } });

    axios.post.mockResolvedValueOnce({
      statusText: "Error",
    });

    fireEvent.click(uploadButton);

    await waitFor(() =>
      expect(
        screen.getByText("Upload failed: Upload failed")
      ).toBeInTheDocument()
    );
    expect(screen.getByRole("alert")).toHaveClass("MuiAlert-filledError");
  });

  test("snackbar closes when close button is clicked", async () => {
    renderComponent();
    const uploadButton = screen.getByRole("button", { name: /upload/i });
    const fileInput = screen.getByTestId("file-input");
    const file = new File(["file content"], "example.csv", {
      type: "text/csv",
    });
    fireEvent.change(fileInput, { target: { files: [file] } });

    axios.post.mockResolvedValueOnce({
      statusText: "OK",
      data: { totalRowsInserted: 10, errorData: [] },
    });

    fireEvent.click(uploadButton);

    await waitFor(() =>
      expect(
        screen.getByText("File uploaded successfully!")
      ).toBeInTheDocument()
    );
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);
    await waitFor(() =>
      expect(
        screen.queryByText("File uploaded successfully!")
      ).not.toBeInTheDocument()
    );
  });

  //   test("navigates to customer logs when icon button is clicked", () => {
  //     const iconButton = screen.getByTestId("navigate-button");
  //     fireEvent.click(iconButton);
  //     expect(window.location.pathname).toBe("/v1/customerlogs");
  //   });
});
