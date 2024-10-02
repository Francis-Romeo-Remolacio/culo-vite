import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridToolbar,
} from "@mui/x-data-grid";
import api from "../../../api/axiosConfig";
import Header from "../../../components/Header";
import DataGridStyler from "./../../../components/DataGridStyler.jsx";
import { User } from "../../../utils/Schemas.js";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await api.get("users/all-users").then((response) => {
          const parsedUsers: User[] = response.data.map((user: any) => ({
            id: user.user_id,
            email: user.email,
            username: user.username,
            roles: user.roles,
            phoneNumber: user.phoneNumber,
            isEmailConfirmed: user.isEmailConfirmed,
            joinDate: new Date(user.joinDate),
          }));
          setUsers(parsedUsers);
        });
      } catch (error) {
        setError("Failed to fetch users");
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "username",
      headerName: "Username",
      cellClassName: "name-column--cell",
    },
    { field: "email", headerName: "Email", flex: 0.5 },
    {
      field: "roles",
      headerName: "Role",
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      valueFormatter: (value: number) => {
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
    { field: "isEmailConfirmed", headerName: "Verified", type: "boolean" },
    {
      field: "joinDate",
      headerName: "Join Date",
      type: "dateTime",
      flex: 0.5,
    },
  ];

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
          slots={{ toolbar: GridToolbar }}
          initialState={{
            columns: {
              columnVisibilityModel: {
                id: false,
              },
            },
          }}
        />
      </DataGridStyler>
    </Box>
  );
};

export default Users;
