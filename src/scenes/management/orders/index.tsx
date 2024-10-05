import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Edit, Delete, Handshake, Visibility } from "@mui/icons-material";
import api from "../../../api/axiosConfig";
import DataGridStyler from "./../../../components/DataGridStyler.tsx";
import Header from "../../../components/Header";

const ManagementOrders = () => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [corderDetails, setCorderDetails] = useState(null);
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<Order[]>([]);
  const [assignOpen, setAssignOpen] = useState(false);
  const [employeeUsername, setEmployeeUsername] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewOrderOpen, setViewOrderOpen] = useState(false);
  const [viewCustomOrderOpen, setCustomViewOrderOpen] = useState(false);
  const [selectedOrderItem, setSelectedOrderItem] = useState<OrderItem | null>(
    null
  );

  interface Order {
    id: string;
    customId: string;
    designId: string;
    payment: string;
    customerId: string;
    customerName: string;
    status: string;
    designName: string;
    pickup: Date;
    isActive: boolean;
    created: Date;
    lastModified: Date;
    lastUpdatedBy: string;
  }
  interface OrderItem {
    suborderId: string;
    customerName: string;
    employeeName?: string;
    designName: string;
    price: number;
    quantity: number;
    createdAt: Date;
    lastUpdatedBy?: string;
    lastUpdatedAt: Date;
    description: string;
    flavor: string;
    size: string;
    color: string;
    shape: string;
    isActive: boolean;
    subOrderTotal: number;
    orderAddons: OrderAddons[];
  }

  interface OrderDetails {
    orderId: string;
    status: string;
    paymentMethod: string;
    orderType: string;
    pickupDateTime: Date;
    orderTotal: number;
    orderItems: OrderItem[];
  }

  interface OrderAddons {
    id: number;
    name: string;
    quantity: number;
    price: number;
    addOnTotal: number;
  }

  interface Employee {
    userId: string;
    name: string; // Adjust according to your actual response structure
  }

  const handleViewOrderClickOpen = (order: any) => {
    setSelectedOrder(order);
    setViewOrderOpen(true);
  };

  const handleViewCustomOrderClickOpen = (order: any) => {
    console.log("Selected order:", order); // Debugging
    setSelectedOrder(order);
    setCustomViewOrderOpen(true);
  };

  const handleAssignClickOpen = (item: OrderItem) => {
    setSelectedOrderItem(item);
    setAssignOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setViewOrderOpen(false);
    setSelectedOrder(null);
    setCustomViewOrderOpen(false);
    setAssignOpen(false);
  };

  const formatDate = (date: any, options: any) => {
    const d = new Date(date);
    return d.toLocaleDateString(undefined, options);
  };

  const fetchData = async () => {
    try {
      const response = await api.get("orders/partial-details");
      const orderData = response.data.map((order: any) => ({
        id: order.orderId,
        customId: order.customId,
        designId: order.designId,
        payment: order.payment,
        customerId: order.customerId,
        customerName: order.customerName,
        status: order.status,
        designName: order.designName,
        pickup: new Date(order.pickup),
        isActive: order.isActive,
        created: new Date(order.createdAt),
        lastModified: new Date(order.lastUpdatedAt),
        lastUpdatedBy: order.lastUpdatedBy,
      }));
      setRows(orderData);
    } catch (error) {
      console.error("Error fetching suborders:", error);
    }
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (selectedOrder?.id) {
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

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      console.log("Fetching employees..."); // Log fetching attempt
      try {
        const response = await api.get<Employee[]>("orders/employees-name");
        console.log("Fetched employees:", response.data); // Log the response
        setEmployees(response.data); // Assuming response.data is an array of Employee objects
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees(); // Call the function
  }, []); // Run once on component mount

  const handleAssignEmployee = async () => {
    if (!selectedOrderItem || !employeeUsername || !orderDetails) return;

    try {
      const requestBody = {
        employeeId: employeeUsername, // employeeUsername contains employee.userId
      };

      const response = await api.post(
        `orders/suborders/${selectedOrderItem.suborderId}/assign`, // Updated endpoint
        requestBody
      );

      console.log("Employee assigned successfully:", response.data);
      handleClose();
    } catch (error) {
      console.error("Error assigning employee:", error);
    }
  };

  const handleApproveOrder = async (orderId: string) => {
    try {
      const response = await api.post(`${orderId}/approve-order`);
      console.log("Order approved successfully:", response.data);
      // Optionally refresh the data grid or show a success message
    } catch (error) {
      console.error("Error approving order:", error);
      // Optionally show an error message to the user
    }
  };

  const columns: readonly GridColDef[] = [
    {
      field: "action",
      type: "actions",
      minWidth: 120,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={() => handleViewOrderClickOpen(params.row)}
          >
            <Edit />
          </IconButton>
          <IconButton
            color="success"
            onClick={() => handleApproveOrder(params.row)}
          >
            <Handshake />
          </IconButton>
          <IconButton
            color="info"
            onClick={() => handleViewOrderClickOpen(params.row)}
          >
            <Visibility />
          </IconButton>
        </>
      ),
    },
    { field: "id", headerName: "OrderId" },
    { field: "designName", headerName: "Design" },
    { field: "customerName", headerName: "Ordered by" },
    { field: "employeeName", headerName: "Assigned" },
    { field: "payment", headerName: "Payment" },
    { field: "status", headerName: "Status" },
    { field: "pickup", headerName: "Pick Up", type: "date" },
    { field: "createdAt", headerName: "Date Created", type: "date" },
    { field: "lastUpdatedBy", headerName: "Modified By" },
    {
      field: "lastUpdatedAt",
      headerName: "Last Modified",
      type: "date",
    },
    { field: "isActive", headerName: "Active", type: "boolean" },
  ];

  return (
    <>
      <Header title="ORDERS" subtitle="Order Management and Tracking" />
      <DataGridStyler>
        <DataGrid
          rows={rows}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          initialState={{
            columns: { columnVisibilityModel: { id: false } },
          }}
        />
      </DataGridStyler>
      {/* Dialogs for order details */}
      <Dialog
        open={viewOrderOpen}
        onClose={() => setViewOrderOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {/* Add content for order details here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOrderOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={viewCustomOrderOpen}
        onClose={() => setCustomViewOrderOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Custom Order Details</DialogTitle>
        <DialogContent>
          {/* Add content for custom order details here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCustomViewOrderOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* View Order Details Dialog */}
      <Dialog
        open={viewOrderOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {orderDetails ? (
            <Box>
              <Typography variant="h6">
                Order ID: {orderDetails.orderId}
              </Typography>
              <Typography variant="h6">
                Status: {orderDetails.status}
              </Typography>
              <Typography variant="h6">
                Payment Method: {orderDetails.paymentMethod}
              </Typography>
              <Typography variant="h6">
                Order Type: {orderDetails.orderType}
              </Typography>
              <Typography variant="h6">
                Pickup Date and Time:{" "}
                {formatDate(orderDetails.pickupDateTime, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
              <Typography variant="h6">
                Order Total: {orderDetails.orderTotal}
              </Typography>
              <Typography variant="h6">Order Items:</Typography>
              {orderDetails.orderItems.length > 0 ? (
                <Box>
                  {orderDetails.orderItems.map((item, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="h6">
                        Suborder ID: {item.suborderId}
                      </Typography>
                      <Typography variant="h6">
                        Customer Name: {item.customerName}
                      </Typography>
                      <Typography variant="h6">
                        Employee Name: {item.employeeName || "Not assigned"}
                      </Typography>
                      <Typography variant="h6">
                        Design Name: {item.designName}
                      </Typography>
                      <Typography variant="h6">Price: {item.price}</Typography>
                      <Typography variant="h6">
                        Quantity: {item.quantity}
                      </Typography>
                      <Typography variant="h6">
                        Created At:{" "}
                        {formatDate(item.createdAt, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                      <Typography variant="h6">
                        Last Updated By: {item.lastUpdatedBy || "Not updated"}
                      </Typography>
                      <Typography variant="h6">
                        Last Updated At:{" "}
                        {formatDate(item.lastUpdatedAt, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                      <Typography variant="h6">
                        Description: {item.description}
                      </Typography>
                      <Typography variant="h6">
                        Flavor: {item.flavor}
                      </Typography>
                      <Typography variant="h6">Size: {item.size}</Typography>
                      <Typography variant="h6">Color: {item.color}</Typography>
                      <Typography variant="h6">Shape: {item.shape}</Typography>
                      <Typography variant="h6">
                        Is Active: {item.isActive ? "Yes" : "No"}
                      </Typography>
                      <Typography variant="h6">
                        Suborder Total: {item.subOrderTotal}
                      </Typography>
                      Order Addons:
                      {item.orderAddons.length > 0
                        ? item.orderAddons
                            .map(
                              (addon) =>
                                `${addon.name} (Qty: ${
                                  addon.quantity
                                }, Total: ${addon.addOnTotal.toFixed(2)})`
                            )
                            .join(", ")
                        : "None"}
                      <Button
                        variant="outlined"
                        onClick={() => handleAssignClickOpen(item)}
                      >
                        Assign Employee
                      </Button>{" "}
                      {/* Moved button here */}
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
                  <MenuItem key={employee.userId} value={employee.userId}>
                    {" "}
                    {/* employee.userId is sent as value */}
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
      </Dialog>
      ;
    </>
  );
};

export default ManagementOrders;
