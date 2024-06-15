import React, { useState } from "react";
import { Layout } from "./Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

const validationSchema = Yup.object({
  customerId: Yup.string().required("Customer ID is required"),
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  company: Yup.string().required("Company is required"),
  city: Yup.string().required("City is required"),
  country: Yup.string().required("Country is required"),
  phone1: Yup.string().required("Phone 1 is required"),
  phone2: Yup.string()
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

export const AddCustomer = () => {
  const [open, setOpen] = useState(false);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      customerId: "",
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
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.post(
          "http://localhost:9000/api/addcustomer",
          values
        );
        console.log(response.data);
        setOpen(true);
        resetForm();
      } catch (error) {
        console.error("There was an error submitting the form!", error);
      }
    },
  });

  return (
    <div>
      <Layout />
      <center>
        <Paper sx={{ margin: 3, padding: 3, width: 500 }}>
          <Typography variant="h6" gutterBottom>
            Add Customer
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              {[
                { id: "customerId", label: "Customer ID" },
                { id: "firstName", label: "First Name" },
                { id: "lastName", label: "Last Name" },
                { id: "company", label: "Company" },
                { id: "city", label: "City" },
                { id: "country", label: "Country" },
                { id: "phone1", label: "Phone 1" },
                { id: "phone2", label: "Phone 2" },
                { id: "email", label: "Email" },
                {
                  id: "subscriptionDate",
                  label: "",
                  type: "date",
                },
                { id: "website", label: "Website" },
              ].map((field) => (
                <Grid item xs={12} key={field.id}>
                  <TextField
                    fullWidth
                    id={field.id}
                    name={field.id}
                    label={field.label}
                    type={field.type || "text"}
                    value={formik.values[field.id]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched[field.id] &&
                      Boolean(formik.errors[field.id])
                    }
                    helperText={
                      formik.touched[field.id] && formik.errors[field.id]
                    }
                    InputLabelProps={{
                      shrink: Boolean(formik.values[field.id]),
                    }}
                  />
                </Grid>
              ))}
            </Grid>
            <Box mt={2}>
              <Button color="primary" variant="contained" type="submit">
                Submit
              </Button>
            </Box>
          </form>
        </Paper>
      </center>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Customer added successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};
