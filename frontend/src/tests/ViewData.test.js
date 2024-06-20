import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ViewData } from "../components/ViewData";
import { Layout } from "../components/Layout";
import "@testing-library/jest-dom/extend-expect";
jest.mock("../components/Layout", () => ({
  Layout: () => <div>Mocked Layout</div>,
}));

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const customerData = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  customerId: "12345",
  company: "Example Inc.",
  city: "New York",
  country: "USA",
  phone1: "123-456-7890",
  phone2: "098-765-4321",
  subscriptionDate: "2023-06-15T00:00:00.000Z",
  website: "http://example.com",
};

const setup = (data) => {
  render(
    <MemoryRouter initialEntries={[{ state: { customerData: data } }]}>
      <Routes>
        <Route path="/" element={<ViewData />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("ViewData Component", () => {
  test("renders without crashing", () => {
    setup(customerData);
    expect(screen.getByText("Mocked Layout")).toBeInTheDocument();
  });

  test("displays all customer data correctly", () => {
    setup(customerData);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
    expect(screen.getByText("12345")).toBeInTheDocument();
    expect(screen.getByText("Example Inc.")).toBeInTheDocument();
    expect(screen.getByText("New York")).toBeInTheDocument();
    expect(screen.getByText("USA")).toBeInTheDocument();
    expect(screen.getByText("123-456-7890")).toBeInTheDocument();
    expect(screen.getByText("098-765-4321")).toBeInTheDocument();
    expect(screen.getByText("6/15/2023")).toBeInTheDocument();
    expect(screen.getByText("http://example.com")).toBeInTheDocument();
  });

  test("formats the subscription date correctly", () => {
    setup(customerData);
    expect(screen.getByText("6/15/2023")).toBeInTheDocument();
  });

  test("back button navigates to customer logs", () => {
    setup(customerData);
    const backButton = screen.getByRole("button");
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith("/v1/customerlogs");
  });
});
