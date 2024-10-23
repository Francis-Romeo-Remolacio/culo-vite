import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  Divider,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import OrderListItem from "./ToPayItem";
import api from "../../api/axiosConfig.js";
import { Order } from "../../utils/Schemas.js";
import { toCurrency } from "../../utils/Formatter.js";
import { SuborderItem } from "../management/orders/index.js";

const ToPay = () => {
  const [orderData, setOrderData] = useState<Order[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order>();

  const fetchOrders = async () => {
    try {
      const response = await api.get(`current-user/to-pay`);
      const orders = response.data;

      const parsedOrders: Order[] = await Promise.all(
        orders.map(async (order: any) => {
          const parsedOrder = {
            id: order.orderId,
            type: order.type,
            pickupDateTime: order.pickup ? new Date(order.pickup) : null,
            payment: order.payment,
            price: order.price,
            listItems: {
              suborders: order.orderItems.map((suborder: any) => ({
                id: suborder.id,
                designId: suborder.designId,
                designName: suborder.designName,
                pastryMaterialId: suborder.pastryId,
                description: suborder.description,
                size: suborder.size,
                color: suborder.color,
                flavor: suborder.flavor,
                quantity: suborder.quantity,
                price: suborder.price,
                addOns: suborder.orderAddons,
              })),
              customOrders: order.customItems,
            },
          };
          return parsedOrder;
        })
      );

      setOrderData(parsedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpen = (order: Order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  return (
    <>
      <Stack spacing={2}>
        {orderData.length > 0 ? (
          <List sx={{ width: "100%" }}>
            {orderData.map((order) => (
              <React.Fragment key={order.id}>
                <OrderListItem
                  order={order}
                  fetchOrders={fetchOrders}
                  handleOpen={handleOpen}
                  status="to-pay"
                />
                <Divider />
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="body1">No orders to pay.</Typography>
          </Box>
        )}
      </Stack>
      {selectedOrder ? (
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>{`Order Details: ${selectedOrder?.id}`}</DialogTitle>
          <DialogContent>
            {selectedOrder &&
              Object.entries(selectedOrder)
                .filter(([key]) => key !== "id" && key !== "listItems") // Exclude "listItems"
                .map(([key, value]) => (
                  <Box key={key} sx={{ marginBottom: 1 }}>
                    <Typography variant="body1">
                      <strong>{key}:</strong>{" "}
                      {key === "price" &&
                      typeof value === "object" &&
                      value.full
                        ? toCurrency(value.full) // Format the price as currency
                        : key === "PickupDate" && value // Check for PickupDate
                        ? new Intl.DateTimeFormat("en-PH", {
                            timeZone: "Asia/Manila",
                            dateStyle: "long",
                            timeStyle: "short",
                          }).format(new Date(value)) // Convert and format the date
                        : String(value)}
                    </Typography>
                  </Box>
                ))}
            {selectedOrder.listItems.suborders.map((suborder, index) => (
              <SuborderItem suborder={suborder} index={index} />
            ))}
            {selectedOrder.listItems.customOrders.map((customOrder, index) => (
              <SuborderItem suborder={customOrder} index={index} />
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      ) : null}
    </>
  );
};

export default ToPay;
