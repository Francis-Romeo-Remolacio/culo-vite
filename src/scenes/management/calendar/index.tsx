import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Box, Typography, useTheme } from "@mui/material";
import Header from "../../../components/Header";
import { Tokens } from "../../../Theme";
import api from "../../../api/axiosConfig"; // Ensure this path is correct
import { ManagementOrder } from "../../../utils/Schemas";
import { formatDate } from "@fullcalendar/core/index.js";

const Calendar = () => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode) || {}; // Default to empty object if tokens is undefined

  const [currentEvents, setCurrentEvents] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetch partial details
        const ordersRes = await api.get("orders/admin/partial-details");
        const orders = ordersRes.data;

        const events = orders.map((order: ManagementOrder) => ({
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

    fetchOrders();
  }, []);

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
    console.log("Event clicked:", selected.event.extendedProps.orderId);
  };

  const eventContent = (eventInfo: any) => {
    return (
      <>
        <div style={{ cursor: "pointer" }}>
          <Typography variant="body1">
            {eventInfo.event.extendedProps.designName}
          </Typography>{" "}
          {/* Display designName */}
        </div>
        <div>
          {formatDate(eventInfo.event.extendedProps.pickupDate, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      </>
    );
  };

  return (
    <Box
      sx={{
        backdropFilter: "blur(24px)",
      }}
    >
      <Header title="Calendar" subtitle="Full Calendar Interactive Page" />

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
          eventClick={handleEventClick}
          events={currentEvents}
          eventContent={eventContent}
        />
      </Box>
    </Box>
  );
};

export default Calendar;
