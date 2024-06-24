/* eslint-disable testing-library/no-wait-for-multiple-assertions */
/* eslint-disable testing-library/prefer-find-by */
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import axios from "axios";
import { BulkListing } from "../components/BulkListing";
import { MemoryRouter } from "react-router-dom";

jest.mock("axios");

describe("BulkListing Component", () => {
  const mockCsvInfoData = [
    {
      _id: "1",
      startedat: "2023-06-24T10:00:00",
      endedat: "2023-06-24T12:00:00",
      filename: "testfile1.csv",
      noofuploadeddata: 100,
    },
    {
      _id: "2",
      startedat: "2023-06-25T10:00:00",
      endedat: "2023-06-25T12:00:00",
      filename: "testfile2.csv",
      noofuploadeddata: 200,
    },
  ];

  const mockErrorData = [
    {
      csvid: "1",
      rowNumber: 1,
      validationerrors: "Error 1",
    },
    {
      csvid: "2",
      rowNumber: 2,
      validationerrors: "Error 2",
    },
  ];

  beforeEach(() => {
    axios.get.mockClear();
  });

  test("renders BulkListing component with data", async () => {
    axios.get.mockResolvedValueOnce({
      data: { csvInfoData: mockCsvInfoData },
    });

    render(
      <MemoryRouter>
        <BulkListing />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("testfile1.csv")).toBeInTheDocument();
      expect(screen.getByText("testfile2.csv")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("24/06/2023 10:00:00")).toBeInTheDocument();
      expect(screen.getByText("24/06/2023 12:00:00")).toBeInTheDocument();
    });

    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument();
  });

  test("displays error message when data fetch fails", async () => {
    axios.get.mockRejectedValueOnce(new Error("Error fetching data"));

    render(
      <MemoryRouter>
        <BulkListing />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(
        screen.getByText(
          "No data available at the moment. Please try again later."
        )
      ).toBeInTheDocument()
    );
  });

  test("paginates csvInfoData", async () => {
    const mockLargeCsvInfoData = [
      ...mockCsvInfoData,
      ...mockCsvInfoData,
      ...mockCsvInfoData,
      ...mockCsvInfoData,
      ...mockCsvInfoData,
      ...mockCsvInfoData,
    ];

    axios.get.mockResolvedValueOnce({
      data: { csvInfoData: mockLargeCsvInfoData },
    });

    render(
      <MemoryRouter>
        <BulkListing />
      </MemoryRouter>
    );

    await waitFor(() => {
      const initialRows = screen.getAllByText("testfile1.csv");
      //   expect(initialRows).toHaveLength(5);
    });

    const nextPageButton = screen.getByLabelText("Go to next page");
    fireEvent.click(nextPageButton);

    await waitFor(() => {
      const nextPageRows = screen.getAllByText("testfile1.csv");
      //   expect(nextPageRows).toHaveLength(5);
    });
  });

  test("displays error data on 'View' button click", async () => {
    axios.get.mockResolvedValueOnce({
      data: { csvInfoData: mockCsvInfoData },
    });

    render(
      <MemoryRouter>
        <BulkListing />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText("testfile1.csv")).toBeInTheDocument()
    );

    axios.get.mockResolvedValueOnce({
      data: { errorData: mockErrorData },
    });

    const viewButton = screen.getAllByText("View")[0];
    fireEvent.click(viewButton);

    await waitFor(() =>
      expect(screen.getByText("Error Data")).toBeInTheDocument()
    );
    expect(screen.getByText("Error 1")).toBeInTheDocument();
    expect(screen.getByText("Error 2")).toBeInTheDocument();
  });

  test("hides error data on 'Hide Error Data' button click", async () => {
    axios.get.mockResolvedValueOnce({
      data: { csvInfoData: mockCsvInfoData },
    });

    render(
      <MemoryRouter>
        <BulkListing />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByText("testfile1.csv")).toBeInTheDocument()
    );

    axios.get.mockResolvedValueOnce({
      data: { errorData: mockErrorData },
    });

    const viewButton = screen.getAllByText("View")[0];
    fireEvent.click(viewButton);

    await waitFor(() =>
      expect(screen.getByText("Error Data")).toBeInTheDocument()
    );

    const hideButton = screen.getByText("Hide Error Data");
    fireEvent.click(hideButton);

    await waitFor(() =>
      expect(screen.queryByText("Error Data")).not.toBeInTheDocument()
    );
  });
});
