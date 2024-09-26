import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  Divider,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CartItem from "./CartItem.jsx";
import ButtonCheckout from "./../../components/ButtonCheckout.jsx";
import api from "./../../api/axiosConfig.js";
import DeleteIcon from "@mui/icons-material/Delete";

const CartList = () => {
  const [checked, setChecked] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchCart = async () => {
    try {
      const response = await api.get(`current-user/cart`);
      setCartData(response.data);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleClickClear = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = (suborderId) => () => {
    const currentIndex = checked.indexOf(suborderId);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(suborderId);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleClear = async () => {
    try {
      await api.delete(`current-user/cart`);
      handleClose();
      fetchCart();
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };

  return (
    <Stack spacing={2}>
      <Button onClick={handleClickClear} endIcon={<DeleteIcon />}>
        Clear
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Clear cart?</DialogTitle>
        <DialogContent>Remove all items in your cart?</DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClear} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      {cartData.length > 0 ? (
        <List sx={{ width: "100%" }}>
          {cartData.map((itemData) => (
            <>
              <CartItem
                itemData={itemData}
                checked={checked}
                handleToggle={handleToggle}
                fetchCart={fetchCart}
              />
              <Divider />
            </>
          ))}
        </List>
      ) : (
        <Box height="100%" display="flex" alignItems="center">
          <Typography variant="body1">No items in the cart.</Typography>
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
      <ButtonCheckout suborders={checked} fetchCart={fetchCart} />
    </Stack>
  );
};

export default CartList;
