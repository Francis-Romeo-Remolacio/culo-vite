import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import api from "../../../api/axiosConfig";
import Header from "../../../components/Header";
import DataGridStyler from "./../../../components/DataGridStyler.tsx";
import { User } from "../../../utils/Schemas.js";
import { Helmet } from "react-helmet-async";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);

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
        console.error("Failed to fetch users:", error);
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
    { field: "email", headerName: "Email", width: 240 },
    {
      field: "roles",
      headerName: "Role",
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      width: 120,
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
      width: 160,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{"Users - The Pink Butter Cake Studio"}</title>
      </Helmet>
      <Header title="USERS" subtitle="Managers, Employees, and Customers" />
      <DataGridStyler>
        <DataGrid
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
          autosizeOptions={{
            columns: ["username", "email", "phoneNumber"],
            includeHeaders: false,
          }}
        />
      </DataGridStyler>
    </>
  );
};

export default Users;
