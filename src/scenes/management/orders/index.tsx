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
  TextField,
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
import {
  Handshake as ApproveIcon,
  Visibility as ViewIcon,
  ArrowDropDown,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
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
import { getImageType } from "../../../components/Base64Image.tsx";
import AddAlertIcon from "@mui/icons-material/AddAlert";

type SuborderItemProps = {
  suborder: Suborder;
  index: number;
  handleAssignClickOpen?: (item: Suborder | CustomOrder) => void;
  handleOpenUpdateModal?: (item: Suborder | CustomOrder) => void;
};


export const SuborderItem = ({
  suborder,
  index,
  handleAssignClickOpen,
  handleOpenUpdateModal,
}: SuborderItemProps) => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);

  // Dynamically get key-value pairs except 'id'
  const suborderDetails = Object.entries(suborder).filter(
    ([key, _]) => key !== "id" && key !== "designId" && key !== "designName"
  );

  // State to store the image
  const [image, setImage] = useState<string | null>(null);
  const [imageType, setImageType] = useState<string | null>(null);

  // Fetch the image asynchronously after render
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await api.get(
          `designs/${suborder.designId}/display-picture-data`
        );
        setImage(response.data.displayPictureData); // Assuming the response contains `displayPictureData`
        setImageType(getImageType(String(response.data.displayPictureData)));
      } catch (error) {
        console.error("Error fetching image", error);
      }
    };

    fetchImage();
  }, [suborder.designId]); // Only run when suborder.designId changes

  return (
    <Accordion key={index} sx={{ backgroundColor: colors.primary[100] }}>
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
          {handleAssignClickOpen ? (
            <Button
              size="small"
              onClick={(event) => {
                event.stopPropagation(); // Prevent the accordion from expanding/collapsing
                handleAssignClickOpen(suborder);
              }}
            >
              Assign
            </Button>
          ) : null}
          {handleOpenUpdateModal ? (
            <Button
              size="small"
              onClick={(event) => {
                event.stopPropagation(); // Prevent the accordion from expanding/collapsing
                handleOpenUpdateModal(suborder);
              }}
            >
              Update
            </Button>
          ) : null}
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        {image && imageType ? (
          <img
            src={`data:${imageType};base64,${image}`}
            style={{
              width: 400,
            }}
          />
        ) : null}
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
};

const Orders = () => {
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
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedSuborder, setSelectedSuborder] = useState<Suborder | CustomOrder | null>(null);
  const [designName, setDesignName] = useState("");
  const [price, setPrice] = useState(0);
  
  const handleOpenUpdateModal = (item: Suborder | CustomOrder) => {
    setSelectedSuborder(item); // Set the selected suborder
    setOpenUpdateModal(true);  // Open the modal
  };

  // Function to close the modal
  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
    setSelectedSuborder(null); // Reset the selected suborder
  };  

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

  // Function to handle form submission
const handleUpdateOrder = async () => {
  // Ensure required fields are present
  if (!selectedSuborder || !designName || !price) return;

  try {
    // Prepare the request body
    const requestBody = {
      designName,
      price,
    };

    // API call to update the order with the selected suborder ID
    const response = await api.patch(
      `orders/custom-orders/${selectedSuborder.id}/set-price`, // Ensure the API endpoint is correct
      requestBody
    );

    console.log("Order updated successfully:", response.data);

    // Close the update modal after a successful submission
    handleCloseUpdateModal();

    // Refresh the data after the update
    fetchData();
  } catch (error) {
    // Log errors properly
    console.error("Error updating order:", error);
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
      const response = await api.post(`orders/${id}/approve-order`);
      console.log("Order approved successfully:", response.data);
    } catch (error) {
      console.error("Error approving order:", error);
    }
  };

  const handleHalfPaidSimulation = async (id: string) => {
    try {
      const response = await api.post(
        `current-user/${id}/half-paid/simulation`
      );
      console.log("Half-paid simulation successful:", response.data);
      // Optionally, you can add logic to refresh the data or show a success message
    } catch (error) {
      console.error("Error during half-paid simulation:", error);
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
              <ApproveIcon />
            </IconButton>
          ) : null}
          {params.row.payment === "half" ? (
            <IconButton
              color="success"
              onClick={() => handleHalfPaidSimulation(params.row.id)}
            >
              <AddAlertIcon />
            </IconButton>
          ) : null}
          <IconButton
            color="info"
            onClick={() => handleViewOrderClickOpen(params.row)}
          >
            <ViewIcon />
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
      <Button
        variant="contained"
        startIcon={<RefreshIcon />}
        onClick={fetchData}
      >
        {"Refresh"}
      </Button>
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
              // filterModel: {
              //   items: [{ field: "isActive", operator: "is", value: true }],
              // },
            },
          }}
        />
      </DataGridStyler>

      <Dialog open={openUpdateModal} onClose={handleCloseUpdateModal}>
        <DialogTitle>Update Custom Order</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Design Name"
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              variant="outlined"
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              label="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              variant="outlined"
              inputProps={{
                min: 1
              }}
            />
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseUpdateModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateOrder} color="success">
            Submit
          </Button>
        </DialogActions>
      </Dialog>


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
              {orderDetails.listItems.suborders.map((suborder, index) => (
                <SuborderItem
                  suborder={suborder}
                  index={index}
                  handleAssignClickOpen={handleAssignClickOpen}
                  handleOpenUpdateModal={handleOpenUpdateModal} //can you make this only for customorders
                />
              ))}
              {orderDetails.listItems.customOrders.map((customOrder, index) => (
                <SuborderItem
                  suborder={customOrder}
                  index={index}
                  handleAssignClickOpen={handleAssignClickOpen}
                  //handleOpenUpdateModal={handleOpenUpdateModal}
                />
              ))}
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
