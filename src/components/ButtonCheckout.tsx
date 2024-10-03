import { FormEvent, FormEventHandler, useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  CircularProgress,
  AccordionSummary,
  Accordion,
  AccordionDetails,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { orderSchema } from "../utils/Validation.js";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import { Suborder } from "../utils/Schemas.js";
import { renderTimeViewClock } from "@mui/x-date-pickers";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import api from "../api/axiosConfig.js";
import { Send as SendIcon } from "@mui/icons-material";

type ButtonCheckoutProps = {
  suborders: Suborder[];
  fetchCart: Function;
};

const ButtonCheckout = ({ suborders, fetchCart }: ButtonCheckoutProps) => {
  const [open, setOpen] = useState(false);
  const minDate = dayjs().add(7, "day");
  const suborderIds: string[] = suborders.map((suborder) => suborder.id);

  const handleClickOpen = () => {
    if (suborders.length > 0) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    // resetForm();
    setOpen(false);
  };

  const onSubmit = async () => {
    console.log(suborderIds);

    const formattedDate = dayjs(values.pickupDateTime).format("YYYY-MM-DD");
    const formattedTime = dayjs(values.pickupDateTime).format("hh:mm A");

    try {
      await api.post(`current-user/cart/checkout/`, {
        type: values.type,
        pickupDate: formattedDate,
        pickupTime: formattedTime,
        payment: values.payment,
        suborderIds: suborderIds as string[],
      });
      handleClose();
      fetchCart();
    } catch (error) {
      console.error("Error checkout:", error);
    }
  };

  const { values, errors, isSubmitting, handleChange } = useFormik({
    initialValues: {
      type: "normal",
      pickupDateTime: minDate,
      payment: "full",
    },
    validationSchema: orderSchema,
    onSubmit,
  });

  return (
    <>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        disabled={suborders.length < 1}
      >
        Send Order
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Order</DialogTitle>
        <form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <DialogContent>
            <Stack spacing={2} sx={{ minWidth: 512 }}>
              {suborders.map((suborder) => (
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                  >
                    {suborder.id}
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{`Size: ${suborder.size}`}</Typography>
                    <Typography>{`Color: ${suborder.color}`}</Typography>
                    <Typography>{`Flavor: ${suborder.flavor}`}</Typography>
                    <Typography>{`Description: ${suborder.description}`}</Typography>
                    <Typography>{`Quantity: ${suborder.quantity}x`}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
              <FormControl fullWidth variant="filled">
                <InputLabel id="select-type-label">Type</InputLabel>
                <Select
                  labelId="select-type-label"
                  id="select-type"
                  name="type"
                  value={values.type}
                  label="Type"
                  onChange={handleChange}
                >
                  <MenuItem value="normal">Normal</MenuItem>
                  <MenuItem value="rush">Rush</MenuItem>
                </Select>
              </FormControl>
              <DateTimePicker
                label="Pickup Date & Time"
                name="pickupDateTime"
                value={values.pickupDateTime}
                minDate={minDate}
                minTime={dayjs("2018-01-01T09:00")}
                maxTime={dayjs("2018-01-01T16:00")}
                onChange={handleChange}
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
              />
              <FormControl fullWidth variant="filled">
                <InputLabel id="select-payment-label">Payment</InputLabel>
                <Select
                  labelId="select-payment-label"
                  id="select-payment"
                  name="payment"
                  value={values.payment}
                  label="Payment"
                  onChange={handleChange}
                >
                  <MenuItem value="full">Full</MenuItem>
                  <MenuItem value="half">Half</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              onClick={() => console.log(errors)}
              endIcon={!isSubmitting ? <SendIcon /> : ""}
              disabled={isSubmitting}
            >
              {!isSubmitting ? "Send Order" : <CircularProgress size={21} />}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default ButtonCheckout;
