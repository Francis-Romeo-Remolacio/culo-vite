import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  useTheme,
} from "@mui/material";
import Header from "../../../components/Header";
import { Tokens } from "../../../Theme";
import api from "../../../api/axiosConfig"; // Ensure this path is correct
import { ManagementOrder } from "../../../utils/Schemas";
import { formatDate } from "@fullcalendar/core/index.js";
import { Helmet } from "react-helmet-async";

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

const Calendar = () => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode) || {}; // Default to empty object if tokens is undefined

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [open, setOpen] = useState(false);
  const [viewOrderOpen, setViewOrderOpen] = useState(false);

  const [orderRows, setOrderRows] = useState<Order[]>([]);

  const [currentEvents, setCurrentEvents] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetch partial details
        const ordersRes = await api.get("orders/partial-details");
        const orders = ordersRes.data;

        const orderData = ordersRes.data.map((order: any) => ({
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
        setOrderRows(orderData);

        const events = orders.map((order: any) => ({
          id: order.orderId,
          title: `${order.customerName}'s Order`,
          start: order.pickup,
          extendedProps: {
            pickupDate: order.pickup,
            orderId: order.orderId, // Add orderId to extendedProps
          },
        }));

        setCurrentEvents(events);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);
  useEffect(() => {
    const parseOrderDetails = async () => {
      if (selectedOrder !== undefined && selectedOrder !== null) {
        try {
          const response = await api.get(`orders/${selectedOrder.id}/full`);

          const parsedOrderDetails: OrderDetails | null = response.data;
          setOrderDetails(parsedOrderDetails);
        } catch {
          console.error("Error fetching order details:", Error);
        }
      }
    };

    parseOrderDetails();
  }, [selectedOrder]);

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

    const clickedOrder: Order | undefined = orderRows.find(
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

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
    setOrderDetails(null);
    setViewOrderOpen(false);
  };

  return (
    <Box
      sx={{
        backdropFilter: "blur(24px)",
      }}
    >
      <Helmet>
        <title>{"Calendar - The Pink Butter Cake Studio"}</title>
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
    </Box>
  );
};

export default Calendar;
