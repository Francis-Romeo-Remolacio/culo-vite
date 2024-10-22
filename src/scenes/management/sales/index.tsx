import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Tokens } from "../../../Theme";
import api from "../../../api/axiosConfig";
import Header from "../../../components/Header";
import DataGridStyler from "./../../../components/DataGridStyler.tsx";
const columns = [
  { field: "name", headerName: "Product", flex: 1 },
  { field: "number", headerName: "Contact", flex: 1 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "price", headerName: "Cost", flex: 0.5 },
  { field: "total", headerName: "Total", flex: 0.5 },
  { field: "date", headerName: "Date", flex: 1 },
];

const Sales = () => {
  const [salesList, setSalesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await api.get("/Sales"); // Adjust endpoint as per your backend API
        setSalesList(response.data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
        setError("Failed to fetch sales data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Header title="SALES" subtitle="Detailed Sales Information" />
      <DataGridStyler>
        <DataGrid
          rows={salesList}
          columns={columns}
          disableSelectionOnClick
          pageSize={10}
        />
      </DataGridStyler>
    </Box>
  );
};

export default Sales;
