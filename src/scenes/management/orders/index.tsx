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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  colors,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Handshake, Visibility, ArrowDropDown } from "@mui/icons-material";
import api from "../../../api/axiosConfig";
import DataGridStyler from "./../../../components/DataGridStyler.tsx";
import Header from "../../../components/Header";
import {
  ManagementOrder,
  Suborder,
  CustomOrder,
  OrderAddOn,
  Breakdown,
} from "../../../utils/Schemas.ts";
import { toCurrency } from "../../../utils/Formatter.ts";
import { Tokens } from "../../../Theme.ts";
import CostBreakdownTable from "./CostBreakdownTable.tsx";

const Orders = () => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);

  const [orderDetails, setOrderDetails] = useState<Omit<
    ManagementOrder,
    "customerId" | "customerName" | "isActive"
  > | null>(null);
  const [rows, setRows] = useState<Partial<ManagementOrder>[]>([]);
  const [open, setOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [employeeUsername, setEmployeeUsername] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<ManagementOrder | null>(
    null
  );
  const [viewOrderOpen, setViewOrderOpen] = useState(false);
  const [selectedOrderItem, setSelectedOrderItem] = useState<
    Suborder | CustomOrder | null
  >(null);

  const [bomDialogOpen, setBomDialogOpen] = useState(false);
  const [breakdownData, setBreakdownData] = useState<Breakdown[]>([]);

  interface Employee {
    userId: string;
    name: string;
  }

  const handleViewOrderClickOpen = (order: ManagementOrder) => {
    setSelectedOrder(order);
    setViewOrderOpen(true);
  };

  const handleAssignClickOpen = (item: Suborder | CustomOrder) => {
    setSelectedOrderItem(item);
    setAssignOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOrderDetails(null);
    setViewOrderOpen(false);
    setSelectedOrder(null);
    setAssignOpen(false);
  };

  const handleReport = async () => {
    try {
      const response = await fetchBreakdownData(); // Fetch breakdown data from API or state
      if (response) {
        setBreakdownData(response.data); // Assuming the response is in the format of Breakdown[]
        setBomDialogOpen(true); // Open the BOM dialog}
      }
    } catch (error) {
      console.error("Failed to generate BOM report", error);
    }
  };

  const handleBomDialogClose = () => {
    setBomDialogOpen(false); // Close the BOM dialog
  };

  const fetchData = async () => {
    try {
      await api.get("orders/partial-details").then((response) => {
        const parsedOrders: Partial<ManagementOrder>[] = response.data.map(
          (order: any) => ({
            id: order.orderId,
            type: order.type,
            customerId: order.customerId,
            customerName: order.customerName,
            status: order.status,
            payment: order.payment,
            pickupDateTime: new Date(order.pickup),
            isActive: order.isActive,
          })
        );
        setRows(parsedOrders);
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchBreakdownData = async () => {
    if (orderDetails) {
      try {
        return await api.get(
          `data-analysis/ingredient-cost-breakdown/by-order-id${orderDetails.id}`
        );
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }
  };

  useEffect(() => {
    if (viewOrderOpen && selectedOrder) {
      const fetchOrderDetails = async () => {
        try {
          await api.get(`orders/${selectedOrder.id}/full`).then((response) => {
            const parsedOrder: Omit<
              ManagementOrder,
              "customerId" | "customerName" | "isActive"
            > = {
              id: response.data.orderId,
              type: response.data.orderType,
              pickupDateTime: new Date(response.data.pickupDateTime),
              payment: response.data.paymentMethod,
              price: response.data.orderTotal,
              listItems: {
                suborders: response.data.orderItems.map((suborder: any) => ({
                  id: suborder.suborderId,
                  designId: suborder.designId,
                  designName: suborder.designName,
                  pastryId: suborder.pastryId,
                  description: suborder.description,
                  size: suborder.size,
                  color: suborder.color,
                  flavor: suborder.flavor,
                  quantity: suborder.quantity,
                  price: suborder.price,
                })),
                customOrders: response.data.customItems,
              },
              status: response.data.status,
            };
            setOrderDetails(parsedOrder);
          });
        } catch (error) {
          console.error("Error fetching order details:", error);
        }
      };
      fetchOrderDetails();
    }
  }, [viewOrderOpen, selectedOrder]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get<Employee[]>("orders/employees-name");
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const handleAssignEmployee = async () => {
    if (!selectedOrderItem || !employeeUsername || !orderDetails) return;

    try {
      const requestBody = {
        employeeId: employeeUsername,
      };

      const response = await api.post(
        `orders/suborders/${selectedOrderItem.id}/assign`,
        requestBody
      );

      console.log("Employee assigned successfully:", response.data);
      handleClose();
      fetchData();
    } catch (error) {
      console.error("Error assigning employee:", error);
    }
  };

  const handleApproveOrder = async (id: string) => {
    try {
      const response = await api.post(`${id}/approve-order`);
      console.log("Order approved successfully:", response.data);
    } catch (error) {
      console.error("Error approving order:", error);
    }
  };

  const columns: readonly GridColDef[] = [
    {
      field: "action",
      type: "actions",
      minWidth: 100,
      renderCell: (params) => (
        <>
          {params.row.status === "for approval" ? (
            <IconButton
              color="success"
              onClick={() => handleApproveOrder(params.row.id)}
            >
              <Handshake />
            </IconButton>
          ) : null}
          <IconButton
            color="info"
            onClick={() => handleViewOrderClickOpen(params.row)}
          >
            <Visibility />
          </IconButton>
        </>
      ),
    },
    { field: "id", headerName: "ID" },
    { field: "type", headerName: "Order Type" },
    { field: "customerName", headerName: "Ordered by" },
    { field: "payment", headerName: "Payment" },
    { field: "status", headerName: "Status", width: 120 },
    { field: "pickupDateTime", headerName: "Pick Up", type: "date" },
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
            columns: {
              columnVisibilityModel: {
                id: false,
                isActive: false,
              },
            },
            filter: {
              filterModel: {
                items: [{ field: "isActive", operator: "is", value: true }],
              },
            },
          }}
        />
      </DataGridStyler>

      <Dialog open={viewOrderOpen} onClose={handleClose} maxWidth="md">
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {orderDetails ? (
            <Box>
              <Typography variant="h6">Order ID: {orderDetails.id}</Typography>
              <Typography variant="h6">
                Status: {orderDetails.status}
              </Typography>
              <Typography variant="h6">
                Payment: {orderDetails.payment}
              </Typography>
              <Typography variant="h6">
                Pickup: {String(orderDetails.pickupDateTime)}
              </Typography>
              <Typography variant="h6">
                Price: {toCurrency(orderDetails.price)}
              </Typography>

              <Typography variant="h6">Order Items:</Typography>
              {orderDetails.listItems.suborders.map((suborder, index) => {
                // Dynamically get key-value pairs except 'id'
                const suborderDetails = Object.entries(suborder).filter(
                  ([key, _]) => key !== "id"
                );

                return (
                  <Accordion
                    key={index}
                    sx={{ backgroundColor: colors.primary[100] }}
                  >
                    <AccordionSummary
                      expandIcon={<ArrowDropDown />}
                      aria-controls={`panel${index}-content`}
                      id={`panel${index}-header`}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography>{`Suborder ID: ${suborder.id}`}</Typography>
                        <Button
                          size="small"
                          onClick={(event) => {
                            event.stopPropagation(); // Prevent the accordion from expanding/collapsing
                            handleAssignClickOpen(suborder);
                          }}
                        >
                          Assign
                        </Button>
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                      {suborderDetails.map(([key, value]) => (
                        <Box key={key} sx={{ marginBottom: 1 }}>
                          <Typography variant="body1">
                            <strong>{key}:</strong> {String(value)}
                          </Typography>
                        </Box>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                );
              })}
              {orderDetails.listItems.customOrders.map((customOrder, index) => {
                // Dynamically get key-value pairs except 'id'
                const customOrderDetails = Object.entries(customOrder).filter(
                  ([key, _]) => key !== "id"
                );

                return (
                  <Accordion key={index}>
                    <AccordionSummary
                      expandIcon={<ArrowDropDown />}
                      aria-controls={`custom-panel${index}-content`}
                      id={`custom-panel${index}-header`}
                    >
                      <Stack direction="row" justifyContent="space-between">
                        <Typography>
                          {`Custom Order ID: ${customOrder.id}`}
                        </Typography>
                        <Button
                          size="small"
                          onClick={(event) => {
                            event.stopPropagation(); // Prevent the accordion from expanding/collapsing
                            handleAssignClickOpen(customOrder);
                          }}
                        >
                          Assign
                        </Button>
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                      {customOrderDetails.map(([key, value]) => (
                        <Box key={key} sx={{ marginBottom: 1 }}>
                          <Typography variant="body1">
                            <strong>{key}:</strong> {String(value)}
                          </Typography>
                        </Box>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                );
              })}
              <Dialog
                open={bomDialogOpen}
                onClose={handleBomDialogClose}
                maxWidth="md"
                fullWidth
              >
                <DialogTitle>BOM Report</DialogTitle>
                <DialogContent>
                  {breakdownData.length > 0 ? (
                    <CostBreakdownTable data={breakdownData} />
                  ) : (
                    <Typography>No breakdown data available</Typography>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleBomDialogClose}>Close</Button>
                </DialogActions>
              </Dialog>
            </Box>
          ) : (
            <CircularProgress />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReport}>Generate BOM Report</Button>
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
                value={employeeUsername}
                onChange={(e) => setEmployeeUsername(e.target.value)}
                label="Employee Username"
              >
                {employees.map((employee) => (
                  <MenuItem key={employee.userId} value={employee.userId}>
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
    </>
  );
};

export default Orders;
