import { useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import api from "../../api/axiosConfig";

const ButtonEdit = ({ orderData }) => {
  const [open, setOpen] = useState(false);
  const [openSucc, setOpenSucc] = useState(false);
  const [openFail, setOpenFail] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const orderEntries = Object.entries(orderData);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSucc(false);
    setOpenFail(false);
  };

  const handleCancelOrder = async () => {
    try {
      const response = await api.post(
        `/api/AddingOrders/confirmation?orderIdHex=${orderData.id}&action=cancel`
      );

      if (response.status === 200) {
        setOpenSucc(true);
      } else {
        setErrorMessage(
          response.data.message || "Failed to perform the action."
        );
        setOpenFail(true);
      }
    } catch (error) {
      setErrorMessage(error.message || "Failed to perform the action.");
      setOpenFail(true);
    }
    setOpen(false);
  };

  const handlePlaceOrder = async () => {
    try {
      const response = await api.post(
        `/api/AddingOrders/confirmation?orderIdHex=${orderData.id}&action=confirm`
      );

      if (response.status === 200) {
        const pastryMaterialResponse = await api.post(
          `/BOM/pastry_materials/${orderData.pastryMaterialId}/subtract_recipe_ingredients_on_inventory/${orderData.variantId}`
        );

        if (pastryMaterialResponse.status === 200) {
          setOpenSucc(true);
        } else {
          setErrorMessage(
            pastryMaterialResponse.data.message ||
              "Failed to subtract ingredients."
          );
          setOpenFail(true);
        }
      } else {
        setErrorMessage(
          response.data.message || "Failed to perform the action."
        );
        setOpenFail(true);
      }
    } catch (error) {
      setErrorMessage(error.message || "Failed to perform the action.");
      setOpenFail(true);
    }
    setOpen(false);
  };

  return (
    <>
      <IconButton variant="contained" onClick={handleClickOpen}>
        <VisibilityIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <Typography variant="h3">Checkout</Typography>
        </DialogTitle>
        <DialogContent>
          {orderEntries.map(([key, value]) => (
            <Typography key={key}>
              <strong>{key}:</strong> {value}
            </Typography>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Close
          </Button>
          <Button onClick={handleCancelOrder} variant="contained" color="error">
            Cancel Order
          </Button>
          <Button onClick={handlePlaceOrder} variant="contained">
            Place Order
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSucc}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Successful checkout.
        </Alert>
      </Snackbar>
      <Snackbar
        open={openFail}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {errorMessage || "Failed to checkout!"}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ButtonEdit;
