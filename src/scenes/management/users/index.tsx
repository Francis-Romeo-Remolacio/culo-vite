import React, { useEffect, useState } from "react";
import { Box, useTheme, CircularProgress, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Tokens } from "../../../theme";
import api from "../../../api/axiosConfig";
import Header from "../../../components/Header";
import DataGridStyler from "./../../../components/DataGridStyler.jsx";

const Users = () => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = [
    {
      field: "username",
      headerName: "Username",
      cellClassName: "name-column--cell",
    },
    { field: "email", headerName: "Email", flex: 0.5 },
    {
      field: "roles",
      headerName: "Role",
      valueGetter: (params) => params.row.roles.join(", "),
    },
    {
      field: "phone_number",
      headerName: "Phone Number",
      valueFormatter: ({ value }) => {
        if (!value) return ""; // Handle empty values
        // Convert number to string and format as "###-###-####"
        const formatted = value
          .toString()
          .replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
        // Append '0' to the front
        const finalFormat = `0${formatted}`;
        return finalFormat;
      },
    },
    { field: "is_email_confirmed", headerName: "Verified", type: "boolean" },
    {
      field: "join_date",
      headerName: "Join Date",
      type: "dateTime",
      flex: 0.5,
      valueGetter: ({ value }) => value && new Date(value),
    },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("users/all-users");
        setUsers(response.data);
      } catch (error) {
        setError("Failed to fetch users");
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
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
      <Header title="USERS" subtitle="Managers, Employees, and Customers" />
      <DataGridStyler>
        <DataGrid
          checkboxSelection
          rows={users}
          columns={columns}
          getRowId={(row) => row.user_id}
        />
      </DataGridStyler>
    </Box>
  );
};

export default Users;
