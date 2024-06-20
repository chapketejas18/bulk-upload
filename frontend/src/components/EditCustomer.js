import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  Alert,
  IconButton,
} from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { Layout } from "./Layout";
import { useFormik } from "formik";
import * as Yup from "yup";

export const EditCustomer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { customerId } = location.state;
  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    city: "",
    country: "",
    phone1: "",
    phone2: "",
    email: "",
    subscriptionDate: "",
    website: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = async () => {
    try {
      const response = await axios.post(
        `http://localhost:9000/api/get-customer`,
        { customerId }
      );
      const {
        firstName,
        lastName,
        company,
        city,
        country,
        phone1,
        phone2,
        email,
        subscriptionDate,
        website,
      } = response.data.customer;
      setCustomerData({
        firstName,
        lastName,
        company,
        city,
        country,
        phone1,
        phone2,
        email,
        subscriptionDate,
        website,
      });
      formik.setValues({
        firstName,
        lastName,
        company,
        city,
        country,
        phone1,
        phone2,
        email,
        subscriptionDate,
        website,
      });
    } catch (error) {
      console.error("Error fetching customer information:", error);
    }
  };

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .matches(
        /^[a-zA-Z\s]*$/,
        "First Name must contain only letters and spaces"
      )
      .required("First Name is required"),
    lastName: Yup.string()
      .matches(
        /^[a-zA-Z\s]*$/,
        "Last Name must contain only letters and spaces"
      )
      .required("Last Name is required"),
    company: Yup.string().required("Company is required"),
    city: Yup.string()
      .matches(/^[a-zA-Z\s]*$/, "City must contain only letters and spaces")
      .required("City is required"),
    country: Yup.string()
      .matches(/^[a-zA-Z\s]*$/, "Country must contain only letters and spaces")
      .required("Country is required"),
    phone1: Yup.string()
      .matches(/^[0-9+()\-]{1,15}$/, "Phone 1 must be a valid phone number")
      .required("Phone 1 is required"),
    phone2: Yup.string()
      .matches(/^[0-9+()\-]{1,15}$/, "Phone 2 must be a valid phone number")
      .required("Phone 2 is required")
      .test(
        "phone-not-same",
        "Phone 1 and Phone 2 should not be the same",
        function (value) {
          return value !== this.parent.phone1;
        }
      ),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    subscriptionDate: Yup.date().required("Subscription Date is required"),
    website: Yup.string().url("Invalid URL").required("Website is required"),
  });

  const formik = useFormik({
    initialValues: customerData,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setErrorMessage("");
        const formattedValues = {
          ...values,
          subscriptionDate: format(
            new Date(values.subscriptionDate),
            "yyyy-MM-dd"
          ),
        };
        await axios.put(`http://localhost:9000/api/edit-customer`, {
          customerId,
          newData: formattedValues,
        });
        navigate("/v1/customerlogs");
      } catch (error) {
        setErrorMessage(
          error.response?.data?.validationErrors.details[0].message ||
            error.validationErrors.details[0].message
        );
      }
    },
    enableReinitialize: true,
  });

  const fields = [
    { name: "firstName", label: "First Name", type: "text", required: true },
    { name: "lastName", label: "Last Name", type: "text", required: true },
    { name: "company", label: "Company", type: "text", required: true },
    { name: "city", label: "City", type: "text", required: true },
    { name: "country", label: "Country", type: "text", required: true },
    { name: "phone1", label: "Phone 1", type: "text", required: true },
    { name: "phone2", label: "Phone 2", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    {
      name: "subscriptionDate",
      label: "Subscription Date",
      type: "date",
      required: true,
    },
    { name: "website", label: "Website", type: "url", required: true },
  ];

  return (
    <div>
      <Layout />
      <center>
        <Paper sx={{ margin: 3, padding: 3, width: 500, position: "relative" }}>
          <IconButton
            onClick={() => navigate("/v1/customerlogs")}
            sx={{ position: "absolute", left: 10, top: 10 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Edit Customer
          </Typography>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          <br />
          <form onSubmit={formik.handleSubmit}>
            <Box display="grid" gap={2}>
              {fields.map((field) => (
                <TextField
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  type={field.type}
                  value={formik.values[field.name]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched[field.name] &&
                    Boolean(formik.errors[field.name])
                  }
                  helperText={
                    formik.touched[field.name] && formik.errors[field.name]
                  }
                  InputLabelProps={
                    field.type === "date" ? { shrink: true } : undefined
                  }
                  required={field.required}
                />
              ))}
            </Box>
            <Box mt={2}>
              <Button type="submit" variant="contained" color="primary">
                Update
              </Button>
            </Box>
          </form>
        </Paper>
      </center>
    </div>
  );
};
