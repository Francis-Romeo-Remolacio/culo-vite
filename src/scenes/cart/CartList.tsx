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
import { Suborder } from "../../utils/Schemas.js";

const CartList = () => {
  const [checked, setChecked] = useState<Suborder[]>([]);
  const [cartData, setCartData] = useState<Suborder[]>([]);
  const [open, setOpen] = useState(false);

  const fetchCart = async () => {
    try {
      const response = await api.get(`current-user/cart`);
      const parsedCart: Suborder[] = response.data.map((item: any) => ({
        id: item.suborderId,
        designId: item.designId,
        designName: item.designName,
        pastryId: item.pastryId,
        description: item.description,
        size: item.size,
        color: item.color,
        flavor: item.flavor,
        quantity: item.quantity,
        price: item.price,
      }));
      setCartData(parsedCart);
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

  const handleToggle = (suborder: Suborder) => () => {
    const currentIndex = checked.findIndex((item) => item.id === suborder.id);
    let newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(suborder);
    } else {
      newChecked = newChecked.filter((item) => item.id !== suborder.id);
    }

    setChecked(newChecked);
  };

  const handleClear = async () => {
    try {
      await api.delete(`current-user/cart`);
      handleClose();
      fetchCart();
      setChecked([]); // Clear checked items when the cart is cleared
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };

  return (
    <Stack spacing={2}>
      <Button color="error" onClick={handleClickClear} endIcon={<DeleteIcon />}>
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
            <React.Fragment key={itemData.id}>
              <CartItem
                itemData={itemData}
                checked={checked}
                handleToggle={handleToggle}
                fetchCart={fetchCart}
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
          <Typography variant="body1">No items in the cart.</Typography>
        </Box>
      )}
      <ButtonCheckout
        suborders={checked}
        fetchCart={fetchCart}
        setChecked={setChecked}
      />
    </Stack>
  );
};

export default CartList;
