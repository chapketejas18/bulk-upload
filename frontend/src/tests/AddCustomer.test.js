/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { AddCustomer } from "../components/AddCustomer";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

const mockAxios = new MockAdapter(axios);

describe("AddCustomer Component", () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  test("renders the form correctly", () => {
    render(
      <Router>
        <AddCustomer />
      </Router>
    );

    expect(screen.getByLabelText(/Customer ID/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone 1/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone 2/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Website/i)).toBeInTheDocument();
  });

  test("displays validation errors on submit with empty fields", async () => {
    render(
      <Router>
        <AddCustomer />
      </Router>
    );

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/Customer ID is required/i)).toBeInTheDocument();
      expect(screen.getByText(/First Name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Last Name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Company is required/i)).toBeInTheDocument();
      expect(screen.getByText(/City is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Country is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Phone 1 is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Phone 2 is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Website is required/i)).toBeInTheDocument();
    });
  });

  test("displays error message when phone numbers are the same", async () => {
    render(
      <Router>
        <AddCustomer />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Phone 1/i), {
      target: { value: "12345" },
    });
    fireEvent.change(screen.getByLabelText(/Phone 2/i), {
      target: { value: "12345" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Phone 1 and Phone 2 should not be the same/i)
      ).toBeInTheDocument();
    });
  });

  test("submits form and displays success message", async () => {
    mockAxios.onPost("http://localhost:9000/api/addcustomer").reply(200);

    render(
      <Router>
        <AddCustomer />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Customer ID/i), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Company/i), {
      target: { value: "Company" },
    });
    fireEvent.change(screen.getByLabelText(/City/i), {
      target: { value: "City" },
    });
    fireEvent.change(screen.getByLabelText(/Country/i), {
      target: { value: "Country" },
    });
    fireEvent.change(screen.getByLabelText(/Phone 1/i), {
      target: { value: "12345" },
    });
    fireEvent.change(screen.getByLabelText(/Phone 2/i), {
      target: { value: "67890" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Website/i), {
      target: { value: "http://example.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Customer added successfully/i)
      ).toBeInTheDocument();
    });
  });

  test("displays error message on API error", async () => {
    mockAxios.onPost("http://localhost:9000/api/addcustomer").reply(400, {
      validationErrors: {
        details: [{ message: "Some error occurred" }],
      },
    });

    render(
      <Router>
        <AddCustomer />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Customer ID/i), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Company/i), {
      target: { value: "Company" },
    });
    fireEvent.change(screen.getByLabelText(/City/i), {
      target: { value: "City" },
    });
    fireEvent.change(screen.getByLabelText(/Country/i), {
      target: { value: "Country" },
    });
    fireEvent.change(screen.getByLabelText(/Phone 1/i), {
      target: { value: "12345" },
    });
    fireEvent.change(screen.getByLabelText(/Phone 2/i), {
      target: { value: "67890" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Website/i), {
      target: { value: "http://example.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/Some error occurred/i)).toBeInTheDocument();
    });
  });
});
