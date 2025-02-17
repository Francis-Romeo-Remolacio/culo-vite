import React, { useState } from "react";
import {
  Button,
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
  useTheme,
  SelectChangeEvent,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { orderSchema } from "../utils/Validation.js";
import { OrderAddOn, Suborder } from "../utils/Schemas.js";
import { renderTimeViewClock } from "@mui/x-date-pickers";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import api from "../api/axiosConfig.js";
import {
  ContentPasteGo as CheckoutIcon,
  PointOfSale,
} from "@mui/icons-material";
import { Tokens } from "../Theme.js";

type SuborderAccordionProps = {
  suborder: Partial<Suborder>;
  designName?: string;
};

type ButtonCheckoutProps = {
  suborders: Partial<Suborder>[];
  fetchCart?: Function;
  setChecked?: React.Dispatch<React.SetStateAction<Suborder[]>>;
  buyNow?: boolean;
  buyNowAddOns?: OrderAddOn[];
  buyNowDesignName?: string;
};

const SuborderAccordion = ({
  suborder,
  designName,
}: SuborderAccordionProps) => {
  const descriptionText = suborder.description || "";

  // Regular expression to capture "Dedication" and "Requests" sections
  const dedicationMatch = descriptionText.match(
    /Dedication:\s*(.*?)(?=Requests:|$)/s
  );
  const requestsMatch = descriptionText.match(/Requests:\s*(.*)/s);

  // Extract text if it matches, otherwise default to empty string
  const dedicationText = dedicationMatch
    ? dedicationMatch[1].trim()
    : "Not provided";
  const requestsText = requestsMatch ? requestsMatch[1].trim() : "Not provided";

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel2-content"
        id="panel2-header"
      >
        {designName ? designName : "Your Order"}
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          <span style={{ fontWeight: "bold" }}>{"Size: "}</span>
          {suborder.size}
        </Typography>
        <Typography>
          <span style={{ fontWeight: "bold" }}>{"Color: "}</span>
          {suborder.color}
        </Typography>
        <Typography>
          <span style={{ fontWeight: "bold" }}>{"Flavor: "}</span>
          {suborder.flavor}
        </Typography>

        <Typography>
          <span style={{ fontWeight: "bold" }}>{"Dedication: "}</span>
          {dedicationText.replace("Dedication: ", "")}
        </Typography>

        <Typography>
          <span style={{ fontWeight: "bold" }}>{"Requests: "}</span>
          {requestsText.replace("Requests: ", "")}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

const ButtonCheckout = ({
  suborders,
  fetchCart,
  setChecked,
  buyNow,
  buyNowAddOns,
  buyNowDesignName,
}: ButtonCheckoutProps) => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    if (suborders.length > 0) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const onSubmit = () => {
    return;
  };

  const handleCheckout = async () => {
    const formattedDate = dayjs(values.pickupDateTime).format("YYYY-MM-DD");
    const formattedTime = dayjs(values.pickupDateTime).format("hh:mm A");

    try {
      if (buyNow) {
        await api.post(`current-user/buy-now/`, {
          type: values.type,
          pickupDate: formattedDate,
          pickupTime: formattedTime,
          payment: values.payment,
          quantity: suborders[0].quantity,
          designId: suborders[0].designId,
          description: suborders[0].description,
          flavor: suborders[0].flavor,
          size: suborders[0].size,
          color: suborders[0].color,
          addonItem: buyNowAddOns,
        });
      } else {
        await api.post(`current-user/cart/checkout/`, {
          type: values.type,
          pickupDate: formattedDate,
          pickupTime: formattedTime,
          payment: values.payment,
          suborderIds: suborders.map((suborder) => suborder.id),
        });
      }
      handleClose();
      if (fetchCart) {
        fetchCart();
      }
      if (setChecked) {
        setChecked([]);
      }
    } catch (error) {
      console.error("Error checkout:", error);
    }
  };

  const {
    values,
    isSubmitting,
    isValid,
    handleChange,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues: {
      type: "normal",
      pickupDateTime: dayjs().add(7, "day").set("hour", 9).set("minute", 0),
      payment: "full",
    },
    validationSchema: orderSchema,
    onSubmit,
  });

  const normalMinDate = dayjs().add(7, "day").set("hour", 9).set("minute", 0);
  const rushMinDate = dayjs().add(1, "day").set("hour", 9).set("minute", 0);

  const isRushOrder = values.type === "rush";

  // Function to handle date adjustment when switching between rush and normal
  const handleTypeChange = (e: SelectChangeEvent) => {
    const selectedType = e.target.value as string;
    handleChange(e);

    if (selectedType === "rush") {
      // Set minimum date to 1 day for rush orders
      setFieldValue("pickupDateTime", rushMinDate);
      setFieldValue("payment", "full");
    } else if (selectedType === "normal") {
      // When switching back to normal, check if current date is less than the normal min date
      if (dayjs(values.pickupDateTime).isBefore(normalMinDate)) {
        setFieldValue("pickupDateTime", normalMinDate);
      }
    }
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        disabled={suborders.length < 1}
        startIcon={!isSubmitting ? <PointOfSale /> : ""}
        fullWidth
        sx={{ color: colors.background }}
      >
        {!isSubmitting ? (
          buyNow ? (
            "Buy Now"
          ) : (
            "Checkout"
          )
        ) : (
          <CircularProgress size={21} />
        )}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Order</DialogTitle>
        <form>
          <DialogContent>
            <Stack spacing={2} sx={{ minWidth: 512 }}>
              {suborders.map((suborder) => (
                <SuborderAccordion
                  key={suborder.id}
                  suborder={suborder}
                  designName={buyNowDesignName ?? suborder.designName}
                />
              ))}
              <FormControl fullWidth variant="filled">
                <InputLabel id="select-type-label">Type</InputLabel>
                <Select
                  labelId="select-type-label"
                  id="select-type"
                  name="type"
                  value={values.type}
                  label="Type"
                  onChange={handleTypeChange}
                >
                  <MenuItem value="normal">Normal</MenuItem>
                  <MenuItem value="rush">Rush</MenuItem>
                </Select>
              </FormControl>
              <DateTimePicker
                label="Pickup Date & Time"
                name="pickupDateTime"
                value={values.pickupDateTime}
                minDate={isRushOrder ? rushMinDate : normalMinDate}
                minTime={dayjs("2018-01-01T09:00")}
                maxTime={dayjs("2018-01-01T16:00")}
                onChange={(date) => setFieldValue("pickupDateTime", date)}
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
                ampm={false}
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
                  disabled={isRushOrder} // Disable payment change for rush orders
                >
                  <MenuItem value="full">Full</MenuItem>
                  <MenuItem value="half" disabled={isRushOrder}>
                    Half
                  </MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              variant="contained"
              endIcon={!isSubmitting ? <CheckoutIcon /> : ""}
              disabled={isSubmitting || !isValid}
              onClick={handleCheckout}
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
