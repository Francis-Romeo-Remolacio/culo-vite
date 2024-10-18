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
import dayjs from "dayjs";
import { Order } from "../../utils/Schemas.js";

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
            pickupDateTime: order.pickup ? dayjs(order.pickup) : null,
            payment: order.payment ? order.payment : "half",
            price: order.price,
            listItems: {
              suborders: order.orderItems,
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
            <Typography variant="body1">No orders to pay for.</Typography>
          </Box>
        )}
      </Stack>
      {selectedOrder ? (
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>{`Order Details: ${selectedOrder?.id}`}</DialogTitle>
          <DialogContent>
            {selectedOrder &&
              Object.entries(selectedOrder)
                .filter(([key]) => key !== "id")
                .map(([key, value]) => (
                  <Box key={key} sx={{ marginBottom: 1 }}>
                    <Typography variant="body1">
                      <strong>{key}:</strong>{" "}
                      {key === "price" &&
                      typeof value === "object" &&
                      value.full
                        ? String(value.full)
                        : String(value)}
                    </Typography>
                  </Box>
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
