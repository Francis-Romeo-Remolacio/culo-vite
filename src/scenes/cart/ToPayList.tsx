/*import React, { useEffect, useState } from "react";
import { Box, Typography, List, Divider, Stack } from "@mui/material";
import ToPayItem from "./ToPayItem.jsx";
import ButtonCheckout from "./ButtonCheckout.jsx";
import api from "./../../api/axiosConfig.js";

const ToPayList = () => {
  const [checked, setChecked] = useState([]);
  const [toPayData, setToPayData] = useState([]);

  const fetchToPay = async () => {
    try {
      const response = await api.get(
        `/api/AddingOrders/for_confirmation_orders_by_customer`
      );
      setToPayData(response.data);
    } catch (error) {
      console.error("Error fetching to pay data:", error);
    }
  };

  useEffect(() => {
    fetchToPay();
  }, []);

  const handleToggle = (orderId) => () => {
    const currentIndex = checked.indexOf(orderId);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(orderId);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <Stack spacing={2}>
      {toPayData.length > 0 ? (
        <List sx={{ width: "100%" }}>
          {toPayData.map((orderData) => (
            <>
              <ToPayItem
                orderData={orderData}
                checked={checked}
                handleToggle={handleToggle}
                fetchToPay={fetchToPay}
              />
              <Divider />
            </>
          ))}
        </List>
      ) : (
        <Box height="100%" display="flex" alignItems="center">
          <Typography variant="body1">No items pending payment.</Typography>
        </Box>
      )}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          width: "inherit",
          textAlign: "center",
        }}
      ></Box>
      {/*<ButtonCheckout checked={checked} fetchToPay={fetchToPay} />*/ /*}
    </Stack>
  );
};

export default ToPayList;*/
