import React, { useState, useEffect } from "react";
import { Box, Button, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../../../components/Header";
import api from "../../../api/axiosConfig";
import Cookies from "js-cookie";
import { Tokens } from "../../../theme";
import DataGridStyler from "./../../../components/DataGridStyler.jsx";

const Notification = () => {
  const [orders, setOrders] = useState([]);
  const theme = useTheme(); // Fetch theme object
  const colors = Tokens(theme.palette.mode); // Fetch color tokens based on theme mode

  useEffect(() => {
    fetchOrdersByUsername();
  }, []);

  const fetchOrdersByUsername = async () => {
    try {
      const token = Cookies.get("token"); // Fetch token from cookies
      if (!token) {
        console.error("User token not found."); // Handle token not found error
        return;
      }

      const response = await api.get("orders/current-user/artist/to-do", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleSendClick = async (id) => {
    try {
      const token = Cookies.get("token"); // Fetch token from cookies
      if (!token) {
        console.error("User token not found."); // Handle token not found error
        return;
      }

      const response = await api.patch(
        `api/AddingOrders/orderstatus?orderId=${id}&action=send`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(`Order with ID ${id} sent successfully:`, response.data);
      fetchOrdersByUsername(); // Refresh orders after update
    } catch (error) {
      console.error(`Error sending order with ID ${id}:`, error);
    }
  };

  const handleDoneClick = async (id) => {
    try {
      const token = Cookies.get("token"); // Fetch token from cookies
      if (!token) {
        console.error("User token not found."); // Handle token not found error
        return;
      }

      const response = await api.patch(
        `api/AddingOrders/orderstatus?orderId=${id}&action=done`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        `Order with ID ${id} marked as done successfully:`,
        response.data
      );
      fetchOrdersByUsername(); // Refresh orders after update
    } catch (error) {
      console.error(`Error marking order with ID ${id} as done:`, error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "orderName", headerName: "Order Name", width: 200 },
    { field: "isActive", headerName: "Active", width: 120 },
    { field: "price", headerName: "Price", type: "number", width: 120 },
    { field: "type", headerName: "Type", width: 150 },
    { field: "quantity", headerName: "Quantity", type: "number", width: 120 },
    { field: "status", headerName: "Status", width: 150 },
    { field: "createdAt", headerName: "Created At", type: "date", width: 180 },
    { field: "description", headerName: "Description", width: 200 },
    { field: "flavor", headerName: "Flavor", width: 150 },
    { field: "size", headerName: "Size", width: 120 },
    { field: "customerName", headerName: "Customer Name", width: 200 },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      width: 200,
      renderCell: (params) => (
        <Box>
          <Button
            variant="outlined"
            onClick={() => handleSendClick(params.row.id)}
            style={{ marginRight: 8 }}
          >
            Send
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleDoneClick(params.row.id)}
          >
            Done
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box p={2}>
      <Header
        title="NOTIFICATIONS"
        subtitle="Incoming Orders, Approvals, and Ready for Pickup"
      />
      <DataGridStyler>
        <DataGrid
          rows={orders}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          components={{ Toolbar: GridToolbar }}
          checkboxSelection
        />
      </DataGridStyler>
    </Box>
  );
};

export default Notification;
