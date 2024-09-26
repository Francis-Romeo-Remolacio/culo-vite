import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../../../components/Header";
import api from "../../../api/axiosConfig";
import DataGridStyler from "./../../../components/DataGridStyler.jsx";

const Orders = () => {
  // State declarations
  const [open, setOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [viewOrderOpen, setViewOrderOpen] = useState(false); // For Order Details Dialog
  const [viewCustomOrderOpen, setCustomViewOrderOpen] = useState(false); // For Order Details Dialog
  const [openAddOrderDialog, setOpenAddOrderDialog] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [employeeUsername, setEmployeeUsername] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const [columns, setColumns] = useState([]);
  const [createOrderData, setCreateOrderData] = useState({
    orderName: "",
    price: "",
    quantity: 1,
    designName: "",
    pickupTime: "",
    description: "",
    flavor: "",
    size: "",
    type: "",
  });
  const [orderDetails, setOrderDetails] = useState(null);
  const [corderDetails, setCorderDetails] = useState(null);

  // Fetch orders data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const ordersRes = await api.get("orders/partial-details");
      setTableData(ordersRes.data);
      setColumns(getColumns(ordersRes.data)); // Set columns based on fetched data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch employee usernames for the dropdown
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get("orders/employees-name");
        setEmployees(response.data); // Assuming response.data is an array of employee usernames
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    const fetchCorderDetails = async () => {
      if (selectedOrder && selectedOrder.customId) {
        console.log('Fetching custom order details for:', selectedOrder.customId); // Debugging
        try {
          const response = await api.get(`orders/custom-orders/${selectedOrder.customId}/full`);
          setCorderDetails(response.data);
          console.log('Custom order details fetched:', response.data); // Debugging
        } catch (error) {
          console.error("Error fetching custom order details:", error);
        }
      }
    };
  
    if (viewCustomOrderOpen) {
      fetchCorderDetails();
    }
  }, [viewCustomOrderOpen, selectedOrder]);
  
  

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (selectedOrder && selectedOrder.id) {
        try {
          const response = await api.get(`orders/${selectedOrder.id}/full`);
          setOrderDetails(response.data);
        } catch (error) {
          console.error("Error fetching order details:", error);
        }
      }
    };

    if (viewOrderOpen) {
      fetchOrderDetails();
    }
  }, [viewOrderOpen, selectedOrder]);

  const handleAssignClickOpen = (item) => {
    setSelectedOrder(item);
    setAssignOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAssignOpen(false);
    setViewOrderOpen(false);
    setEmployeeUsername("");
    setSelectedOrder(null);
    setCustomViewOrderOpen(false);
  };

  const handleViewOrderClickOpen = (order) => {
    setSelectedOrder(order);
    setViewOrderOpen(true);
  };

  const handleViewCustomOrderClickOpen = (order) => {
    console.log('Selected order:', order); // Debugging
    setSelectedOrder(order);
    setCustomViewOrderOpen(true);
  };  

  const handleAssignEmployee = async () => {
    if (!selectedOrder || !employeeUsername || !orderDetails) return;

    try {
      const requestBody = {
        employeeId: employeeUsername // employeeUsername contains employee.userId
      };

      const response = await api.post(
        `orders/suborders/${selectedOrder.suborderId}/assign`, // Updated endpoint
        requestBody
      );

      console.log("Employee assigned successfully:", response.data);
      handleClose();
    } catch (error) {
      console.error("Error assigning employee:", error);
    }
  };

  const handleCreateOrderInputChange = (event) => {
    const { name, value } = event.target;
    setCreateOrderData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddOrderDialogOpen = () => {
    setOpenAddOrderDialog(true);
  };

  const handleAddOrderDialogClose = () => {
    setOpenAddOrderDialog(false);
  };

  const handleAddNewOrder = async () => {
    try {
      if (!loggedIn || !token) {
        console.error("User not logged in or token not found.");
        return;
      }

      await api.post(
        `/api/AddingOrders/manual_ordering?designName=${createOrderData.designName}&pickupTime=${createOrderData.pickupTime}&description=${createOrderData.description}&flavor=${createOrderData.flavor}&size=${createOrderData.size}&type=${createOrderData.type}`,
        {
          OrderName: createOrderData.orderName,
          Price: createOrderData.price,
          Quantity: createOrderData.quantity,
        }
      );
      console.log("Order created successfully.");
      handleAddOrderDialogClose();
      fetchData();
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const formatDate = (date, options) => {
    const d = new Date(date);
    return d.toLocaleDateString(undefined, options);
  };


  const getColumns = () => {
    return [
      { field: "customId", headerName: "CustomOrderId", hide: true },
      { field: "id", headerName: "OrderId", hide: true },
      { field: "designName", headerName: "Design" },
      { field: "customerId", headerName: "Customer", flex: 1, hide: true },
      { field: "designId", headerName: "Design", flex: 1, hide: true },
      { field: "customerName", headerName: "Customer" },
      { field: "payment", headerName: "Payment" },
      { field: "status", headerName: "Status" },
      { field: "pickup", headerName: "Pick Up", type: "date"},
      { field: "createdAt", headerName: "Date Created", type: "date" },
      { field: "lastUpdatedBy", headerName: "Modified By" },
      { field: "lastUpdatedAt", headerName: "Time Modified", flex: 1, type: "date" },
      { field: "isActive", headerName: "Active", type: "boolean" },
      {
        field: "action",
        headerName: "Action",
        sortable: false,
        width: 500,
        renderCell: (params) => (
          <Box>
            {params.row.customId ? (
              <Button variant="outlined" onClick={() => handleViewCustomOrderClickOpen(params.row)}>CView</Button>
            ) : (
              <Button variant="outlined" onClick={() => handleViewOrderClickOpen(params.row)}>View</Button>
            )}
          </Box>
        ),
      },
    ];
  };


  return (
    <>
      <Header title="Orders" subtitle="List of Orders" />
      <Button sx={{ mb: 2 }} variant="contained" color="primary" onClick={handleAddOrderDialogOpen}>
        Add New Order
      </Button>
      <DataGridStyler>
        <DataGrid
          rows={tableData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          pageSize={10}
          rowsPerPageOptions={[10]}
        />
      </DataGridStyler>

      // Assign Employee Dialog
      <Dialog open={assignOpen} onClose={handleClose}>
        <DialogTitle>Assign Employee</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <FormControl fullWidth variant="standard" margin="dense">
              <InputLabel>Employee Username</InputLabel>
              <Select
                value={employeeUsername} // employeeUsername will store selected employee's userId
                onChange={(e) => setEmployeeUsername(e.target.value)} // Set the selected employee's userId
                label="Employee Username"
              >
                {employees.map((employee) => (
                  <MenuItem key={employee.userId} value={employee.userId}> {/* employee.userId is sent as value */}
                    {employee.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAssignEmployee} disabled={!employeeUsername}>
            Assign
          </Button>
        </DialogActions>
      </Dialog>;

      {/* View Order Details Dialog */}
      <Dialog open={viewOrderOpen} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {orderDetails ? (
            <Box>
              <Typography variant="h6">Order ID: {orderDetails.orderId}</Typography>
              <Typography variant="h6">Status: {orderDetails.status}</Typography>
              <Typography variant="h6">Payment Method: {orderDetails.paymentMethod}</Typography>
              <Typography variant="h6">Order Type: {orderDetails.orderType}</Typography>
              <Typography variant="h6">Pickup Date and Time: {formatDate(orderDetails.pickupDateTime, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Typography>
              <Typography variant="h6">Order Total: {orderDetails.orderTotal}</Typography>
              <Typography variant="h6">Order Items:</Typography>
              {orderDetails.orderItems.length > 0 ? (
                <Box>
                  {orderDetails.orderItems.map((item, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="h6">Suborder ID: {item.suborderId}</Typography>
                      <Typography variant="h6">Customer Name: {item.customerName}</Typography>
                      <Typography variant="h6">Employee Name: {item.employeeName || "Not assigned"}</Typography>
                      <Typography variant="h6">Design Name: {item.designName}</Typography>
                      <Typography variant="h6">Price: {item.price}</Typography>
                      <Typography variant="h6">Quantity: {item.quantity}</Typography>
                      <Typography variant="h6">Created At: {formatDate(item.createdAt, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Typography>
                      <Typography variant="h6">Last Updated By: {item.lastUpdatedBy || "Not updated"}</Typography>
                      <Typography variant="h6">Last Updated At: {formatDate(item.lastUpdatedAt, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Typography>
                      <Typography variant="h6">Description: {item.description}</Typography>
                      <Typography variant="h6">Flavor: {item.flavor}</Typography>
                      <Typography variant="h6">Size: {item.size}</Typography>
                      <Typography variant="h6">Color: {item.color}</Typography>
                      <Typography variant="h6">Shape: {item.shape}</Typography>
                      <Typography variant="h6">Is Active: {item.isActive ? "Yes" : "No"}</Typography>
                      <Typography variant="h6">Suborder Total: {item.subOrderTotal}</Typography>
                      <Typography variant="h6">Order Addons: {item.orderAddons.length > 0 ? item.orderAddons.join(', ') : "None"}</Typography>
                      <Button variant="outlined" onClick={() => handleAssignClickOpen(item)}>Assign Employee</Button> {/* Moved button here */}
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography>No items available</Typography>
              )}
            </Box>
          ) : (
            <Typography>No details available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* View Custom Order Details Dialog */}
<Dialog open={viewCustomOrderOpen} onClose={handleClose} fullWidth maxWidth="md">
  <DialogTitle>Custom Order Details</DialogTitle>
  <DialogContent>
    {corderDetails ? (
      <Box>
        <Typography variant="h6">Custom Order ID: {corderDetails.customId}</Typography>
        <Typography variant="h6">Order ID: {corderDetails.orderId}</Typography>
        <Typography variant="h6">Design ID: {corderDetails.designId}</Typography>
        <Typography variant="h6">Customer Name: {corderDetails.customerName}</Typography>
        <Typography variant="h6">Created At: {formatDate(corderDetails.createdAt, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Typography>
        <Typography variant="h6">Color: {corderDetails.color}</Typography>
        <Typography variant="h6">Shape: {corderDetails.shape}</Typography>
        <Typography variant="h6">Tier: {corderDetails.tier}</Typography>
        <Typography variant="h6">Cover: {corderDetails.cover}</Typography>
        <Typography variant="h6">Description: {corderDetails.description}</Typography>
        <Typography variant="h6">Size: {corderDetails.size}</Typography>
        <Typography variant="h6">Flavor: {corderDetails.flavor}</Typography>
        <Typography variant="h6">Picture: {corderDetails.picture}</Typography>
        <Typography variant="h6">Message: {corderDetails.message}</Typography>
        <Typography variant="h6">Employee Assigned: {corderDetails.employeeName || "Not assigned"}</Typography>
        <Typography variant="h6">Pickup Date and Time: {formatDate(corderDetails.pickupDateTime, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Typography>
      </Box>
    ) : (
      <Typography variant="h6">Loading custom order details...</Typography>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Close</Button>
  </DialogActions>
</Dialog>



      {/* Add Order Dialog */}
      <Dialog open={openAddOrderDialog} onClose={handleAddOrderDialogClose}>
        <DialogTitle>Add New Order</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Order Name"
            fullWidth
            variant="standard"
            name="orderName"
            value={createOrderData.orderName}
            onChange={handleCreateOrderInputChange}
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            variant="standard"
            name="price"
            value={createOrderData.price}
            onChange={handleCreateOrderInputChange}
          />
          <TextField
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            variant="standard"
            name="quantity"
            value={createOrderData.quantity}
            onChange={handleCreateOrderInputChange}
          />
          <TextField
            margin="dense"
            label="Design Name"
            fullWidth
            variant="standard"
            name="designName"
            value={createOrderData.designName}
            onChange={handleCreateOrderInputChange}
          />
          <TextField
            margin="dense"
            label="Pickup Time"
            fullWidth
            variant="standard"
            name="pickupTime"
            value={createOrderData.pickupTime}
            onChange={handleCreateOrderInputChange}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            variant="standard"
            name="description"
            value={createOrderData.description}
            onChange={handleCreateOrderInputChange}
          />
          <TextField
            margin="dense"
            label="Flavor"
            fullWidth
            variant="standard"
            name="flavor"
            value={createOrderData.flavor}
            onChange={handleCreateOrderInputChange}
          />
          <TextField
            margin="dense"
            label="Size"
            fullWidth
            variant="standard"
            name="size"
            value={createOrderData.size}
            onChange={handleCreateOrderInputChange}
          />
          <TextField
            margin="dense"
            label="Type"
            fullWidth
            variant="standard"
            name="type"
            value={createOrderData.type}
            onChange={handleCreateOrderInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddOrderDialogClose}>Cancel</Button>
          <Button onClick={handleAddNewOrder}>Add Order</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Orders;
