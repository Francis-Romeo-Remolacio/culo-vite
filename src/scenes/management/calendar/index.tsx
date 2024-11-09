import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Header from "../../../components/Header";
import { Tokens } from "../../../Theme";
import api from "../../../api/axiosConfig"; // Ensure this path is correct
import {
  Breakdown,
  CustomOrder,
  ManagementCustomOrder,
  ManagementOrder,
  ManagementSuborder,
  Suborder,
} from "../../../utils/Schemas";
import { formatDate } from "@fullcalendar/core/index.js";
import { Helmet } from "react-helmet-async";
import { toCurrency } from "../../../utils/Formatter";
import { useAlert } from "../../../components/CuloAlert";
import { getImageType } from "../../../components/Base64Image";
import { ArrowDropDown } from "@mui/icons-material";
import CostBreakdownTable from "../orders/CostBreakdownTable";

type SuborderItemProps = {
  suborder: ManagementSuborder | ManagementCustomOrder;
  index: number;
  handleAssignClickOpen?: (
    item: ManagementSuborder | ManagementCustomOrder
  ) => void;
  handleOpenUpdateModal?: (
    item: ManagementSuborder | ManagementCustomOrder
  ) => void;
  custom?: boolean;
};

const SuborderItem = ({
  suborder,
  index,
  handleAssignClickOpen,
  handleOpenUpdateModal,
}: SuborderItemProps) => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);

  const isCustom = (
    item: ManagementSuborder | ManagementCustomOrder
  ): item is ManagementCustomOrder => {
    return !!item;
  };

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
          <Typography>
            {isCustom(suborder)
              ? `Custom Order ID: ${suborder.id}`
              : `Suborder ID: ${suborder.id}`}
          </Typography>
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
              <strong>{key}:</strong>{" "}
              {key === "price" ? String(value.full) : String(value)}
            </Typography>
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

const Calendar = () => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);

  const { makeAlert } = useAlert();

  const [open, setOpen] = useState(false);

  const [orderRows, setOrderRows] = useState<Partial<ManagementOrder>[]>([]);

  const [currentEvents, setCurrentEvents] = useState<any[]>([]);

  const [orderDetails, setOrderDetails] = useState<Omit<
    ManagementOrder,
    "customerId" | "customerName" | "isActive"
  > | null>(null);
  const [rows, setRows] = useState<Partial<ManagementOrder>[]>([]);
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedOrder, setSelectedOrder] =
    useState<Partial<ManagementOrder> | null>(null);
  const [viewOrderOpen, setViewOrderOpen] = useState(false);
  const [selectedOrderItem, setSelectedOrderItem] = useState<
    Suborder | CustomOrder | null
  >(null);

  const [bomDialogOpen, setBomDialogOpen] = useState(false);
  const [breakdownData, setBreakdownData] = useState<Breakdown[]>([]);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedSuborder, setSelectedSuborder] = useState<
    Suborder | CustomOrder | null
  >(null);
  const [designName, setDesignName] = useState("");
  const [price, setPrice] = useState(0);

  interface Employee {
    userId: string;
    name: string;
  }

  const handleOpenUpdateModal = (item: Suborder | CustomOrder) => {
    setSelectedSuborder(item); // Set the selected suborder
    setOpenUpdateModal(true); // Open the modal
  };

  // Function to close the modal
  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
    setSelectedSuborder(null); // Reset the selected suborder
  };

  const handleViewOrderClickOpen = (order: ManagementOrder) => {
    setSelectedOrder(order);
    setViewOrderOpen(true);
  };

  const handleAssignClickOpen = (item: Suborder | CustomOrder) => {
    setSelectedOrderItem(item);
    setAssignOpen(true);
  };

  const handleClose = () => {
    setOrderDetails(null);
    setViewOrderOpen(false);
    setSelectedOrder(null);
  };

  const handleCloseAssign = () => {
    setAssignOpen(false);
    setSelectedEmployee("");
  };

  const AssignClose = () => {
    setAssignOpen(false);
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
    if (!selectedOrderItem || !selectedEmployee || !orderDetails) return;

    try {
      const requestBody = {
        employeeId: selectedEmployee,
      };

      await api.post(
        `orders/suborders/${selectedOrderItem.id}/assign`,
        requestBody
      );

      makeAlert("success", "Task assigned successfully.");
      handleCloseAssign();
      fetchData();
    } catch (error) {
      console.error("Error assigning employee:", error);
      makeAlert("error", "Task assignment failed.");
    }
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
        setOrderRows(parsedOrders);
      });

      const events = orderRows.map((order: any) => ({
        id: order.id,
        title: `${order.customerName}'s Order`,
        start: order.pickupDateTime,
        extendedProps: {
          pickupDate: order.pickupDateTime,
          orderId: order.id, // Add orderId to extendedProps
        },
      }));

      setCurrentEvents(events);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
              price: { full: response.data.orderTotal },
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

  const handleDateClick = (selected: any) => {
    const title = prompt("Please enter a new title for your event");
    const calendarApi = selected.view.calendar;
    calendarApi.unselect();

    if (title) {
      calendarApi.addEvent({
        id: `${selected.dateStr}-${title}`,
        title,
        start: selected.startStr,
        end: selected.endStr,
        allDay: selected.allDay,
      });
    }
  };

  const handleEventClick = (selected: any) => {
    // Handle event click if necessary
    // For now, it does nothing as we removed the `handleCustomerNameClick`
    //console.log("Event clicked:", selected.event.extendedProps.orderId);

    const clickedOrder: Partial<ManagementOrder> | undefined = orderRows.find(
      (value) => value.id === selected.event.id
    );
    setSelectedOrder(clickedOrder === undefined ? null : clickedOrder);
    setViewOrderOpen(true);
  };

  const eventContent = (eventInfo: any) => {
    return (
      <div style={{ backgroundColor: colors.primary[100], width: "100%" }}>
        <div style={{ cursor: "pointer" }}>
          <Typography variant="body1">{eventInfo.event.title}</Typography>
        </div>
        <div>
          {formatDate(eventInfo.event.extendedProps.pickupDate, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>
    );
  };

  return (
    <Box
      sx={{
        backdropFilter: "blur(24px)",
      }}
    >
      <Helmet>
        <title>{"Calendar - Cake Studio"}</title>
      </Helmet>
      <Header title="CALENDAR" subtitle="Full Calendar Interactive Page" />

      <Box flex="1 1 100%" ml="15px">
        <FullCalendar
          height="75vh"
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            listPlugin,
          ]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
          }}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          select={handleDateClick}
          eventClick={(clickedEvent) => handleEventClick(clickedEvent)}
          events={currentEvents}
          eventContent={eventContent}
        />
      </Box>

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
                Price: {toCurrency(orderDetails.price.full)}
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
                    <CostBreakdownTable
                      data={breakdownData}
                      orderData={selectedOrder as ManagementOrder}
                    />
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

      <Dialog open={assignOpen} onClose={handleCloseAssign}>
        <DialogTitle>Assign Employee</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <FormControl fullWidth variant="standard" margin="dense">
              <InputLabel>Employee</InputLabel>
              <Select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                label="Employee"
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
          <Button onClick={handleAssignEmployee} disabled={!selectedEmployee}>
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Calendar;
