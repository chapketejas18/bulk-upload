/* eslint-disable testing-library/no-wait-for-side-effects */
/* eslint-disable jest/valid-expect */
/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { CustomerInfo } from "../components/CustomerInfo";

jest.mock("axios");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("CustomerInfo Component", () => {
  const mockCustomerData = {
    customerData: [
      {
        customerId: "1",
        firstName: "John",
        lastName: "Doe",
        company: "ABC Corp",
        city: "New York",
        country: "USA",
        phone1: "1234567890",
        phone2: "0987654321",
        email: "john.doe@example.com",
        website: "http://example.com",
      },
    ],
    totalCount: 1,
  };

  beforeEach(() => {
    axios.post.mockResolvedValue({ data: mockCustomerData });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders CustomerInfo component", async () => {
    render(
      <Router>
        <CustomerInfo />
      </Router>
    );

    expect(screen.getByText(/Add Customer/i)).toBeInTheDocument();
    expect(screen.getByText(/Bulk Upload/i)).toBeInTheDocument();
  });

  test("handles bulk upload button click", () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    render(
      <Router>
        <CustomerInfo />
      </Router>
    );

    fireEvent.click(screen.getByText(/Bulk Upload/i));
    expect(mockNavigate).toHaveBeenCalledWith("/v1/bulkupload");
  });

  test("displays loading indicator when fetching data", () => {
    render(
      <Router>
        <CustomerInfo />
      </Router>
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("renders virtualized rows", async () => {
    render(
      <Router>
        <CustomerInfo />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getAllByRole("row")).toHaveLength(3); // Including the header row
    });
  });

  test("displays appropriate message when no data is available", async () => {
    axios.post.mockResolvedValue({ data: { customerData: [], totalCount: 0 } });

    render(
      <Router>
        <CustomerInfo />
      </Router>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/No data available at the moment/i)
      ).toBeInTheDocument();
    });
  });

  // test("handles search functionality", async () => {
  //   render(
  //     <Router>
  //       <CustomerInfo />
  //     </Router>
  //   );

  //   fireEvent.change(screen.getByPlaceholderText(/Search/i), {
  //     target: { value: "John" },
  //   });
  //   fireEvent.click(screen.getByRole("button", { name: /Search/i }));

  //   await waitFor(() => {
  //     expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  //   });
  // });

  // test("handles view button click", async () => {
  //   const mockNavigate = jest.fn();
  //   useNavigate.mockReturnValue(mockNavigate);

  //   render(
  //     <Router>
  //       <CustomerInfo />
  //     </Router>
  //   );

  //   await waitFor(() => {
  //     expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  //   });

  //   fireEvent.click(screen.getAllByLabelText(/view/i)[0]);

  //   await waitFor(() => {
  //     expect(mockNavigate).toHaveBeenCalledWith("/v1/viewdata", {
  //       state: { customerData: mockCustomerData.customerData[0] },
  //     });
  //   });
  // });

  // test("handles edit button click", async () => {
  //   const mockNavigate = jest.fn();
  //   useNavigate.mockReturnValue(mockNavigate);

  //   render(
  //     <Router>
  //       <CustomerInfo />
  //     </Router>
  //   );

  //   await waitFor(() => {
  //     expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  //   });

  //   fireEvent.click(screen.getAllByLabelText(/edit/i)[0]);

  //   await waitFor(() => {
  //     expect(mockNavigate).toHaveBeenCalledWith("/v1/editcustomer", {
  //       state: { customerId: mockCustomerData.customerData[0].customerId },
  //     });
  //   });
  // });

  test("handles add customer button click", () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    render(
      <Router>
        <CustomerInfo />
      </Router>
    );

    fireEvent.click(screen.getByText(/Add Customer/i));
    expect(mockNavigate).toHaveBeenCalledWith("/v1/addcustomer");
  });
});
