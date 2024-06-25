/* eslint-disable no-undef */
/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import { EditCustomer } from "../components/EditCustomer";
import "@testing-library/jest-dom/extend-expect";
jest.mock("axios");

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe("EditCustomer Component", () => {
  const mockCustomerData = {
    firstName: "John",
    lastName: "Doe",
    company: "ABC Corp",
    city: "New York",
    country: "USA",
    phone1: "1234567890",
    phone2: "0987654321",
    email: "john.doe@example.com",
    website: "http://example.com",
  };

  beforeEach(() => {
    axios.post.mockResolvedValue({ data: { customer: mockCustomerData } });
    axios.put.mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders EditCustomer and fetches data", async () => {
    const mockLocation = {
      state: { customerId: "1" },
    };
    useLocation.mockReturnValue(mockLocation);

    render(
      <MemoryRouter>
        <EditCustomer />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    });
  });

  test("submits edited customer data", async () => {
    const mockLocation = {
      state: { customerId: "1" },
    };
    useLocation.mockReturnValue(mockLocation);
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <EditCustomer />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: "Jane" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Company/i), {
      target: { value: "XYZ Corp" },
    });
    fireEvent.change(screen.getByLabelText(/City/i), {
      target: { value: "Los Angeles" },
    });
    fireEvent.change(screen.getByLabelText(/Country/i), {
      target: { value: "USA" },
    });
    fireEvent.change(screen.getByLabelText(/Phone 1/i), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByLabelText(/Phone 2/i), {
      target: { value: "0987654321" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "jane.doe@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Website/i), {
      target: { value: "http://example.com" },
    });

    fireEvent.click(screen.getByText("Update"));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        `http://localhost:9000/api/edit-customer`,
        {
          customerId: "1",
          newData: {
            firstName: "Jane",
            lastName: "Doe",
            company: "XYZ Corp",
            city: "Los Angeles",
            country: "USA",
            phone1: "1234567890",
            phone2: "0987654321",
            email: "jane.doe@example.com",
            website: "http://example.com",
          },
        }
      );
      expect(mockNavigate).toHaveBeenCalledWith("/v1/customerlogs");
    });
  });

  test("navigates back to customer logs when back button is clicked", async () => {
    const mockLocation = {
      state: { customerId: "1" },
    };
    useLocation.mockReturnValue(mockLocation);

    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <EditCustomer />
      </MemoryRouter>
    );

    const backButton = screen.getByRole("button", { name: /back/i });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/v1/customerlogs");
  });
});
