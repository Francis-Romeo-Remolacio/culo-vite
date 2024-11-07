import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Typography,
} from "@mui/material";
import React, { ChangeEvent } from "react";
import Header from "./Header";

type TermsDialogProps = {
  open: boolean;
  onClose: () => void;
  agree: boolean;
  handleChange: {
    (e: React.ChangeEvent<any>): void;
    <T_1 = string | ChangeEvent<any>>(
      field: T_1
    ): T_1 extends React.ChangeEvent<any>
      ? void
      : (e: string | React.ChangeEvent<any>) => void;
  };
};

const TermsDialog = ({
  open,
  onClose,
  agree,
  handleChange,
}: TermsDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{"Please Read"}</DialogTitle>
      <DialogContent>
        <Header title="Terms & Conditions" subtitle="Please READ!" />
        <Typography variant="h5">
          {"DEPOSITS, PAYMENTS, CANCELLATIONS"}
        </Typography>
        <Typography variant="body1">
          {
            "A deposit of 50% is required to consider this an order. The remaining balance is DUE five (5) business days prior to the pick-up date."
          }
        </Typography>
        <Typography variant="body1">
          {
            "*Any changes to this order must be made no later than five (5) business days prior to pick-up date. Any changes requested after confirmation of order cannot be guaranteed and may be subject to additional charges."
          }
        </Typography>
        <Typography variant="body1">
          {
            "All deposits are non-refundable. There will be no credit given for orders canceled inside of five (5) business days before the date of event."
          }
        </Typography>
        <Typography variant="body1">
          {
            "For cancellations with more than five (5) business days' notice, credit may be given for a future order, less the fair market value of items that cannot be re-used. This offer is subject to the date being available."
          }
        </Typography>
        <Typography variant="body1">
          {
            "If full payment is not received on the due date, the order may be canceled."
          }
        </Typography>
        <Typography variant="h5">{"DELIVERY TERMS"}</Typography>
        <Typography variant="body1">
          {"The pick-up time will be confirmed upon placing your order."}
        </Typography>
        <Typography variant="body1">
          {
            "The Client must disclose any adverse road hazards and/or obstacles that may hamper the delivery and quality of finished products. In the case of an unavoidable occurence, such as an act of God, a car accident, poor road conditions, or dropping of cake during delivery - out of Cake Studio cannot be held liable for more than the price of the cake described in this order."
          }
        </Typography>
        <Typography variant="body1">
          {
            "The Client should provide the screenshot of LALAMOVE CAR or GRAB CAR for pick up."
          }
        </Typography>
        <Typography variant="body1">
          {"The Client should be the one to book their own pick-up."}
        </Typography>
        <Typography variant="h5">{"OUR GUARANTEE"}</Typography>
        <Typography variant="body1">
          {
            "Cake Studio will provide a professionally decorated dessert in a timely manner as specified in the order form. We are honored that you have chosen us for your special celebration. We guarantee that the flavors, size and general design elements will be met as outlined. If you are not satisfied with our product(s) please let us know at the time you receive your order."
          }
        </Typography>
        <Typography variant="h5">{"DESIGN VARIATIONS"}</Typography>
        <Typography variant="body1">
          {
            "Although we make every attempt to provide an exact design and to match colors, custom cakes are a work of art and hand-made, it may not be possible to match an exact shade of a color, or design but we will come as close as possible. The final product may be subject to slight variations."
          }
        </Typography>
        <Typography variant="body1">
          {
            "We do not offer discounts or refunds if the exact shade of a color or design is not achieved or if variation occurs. In the event that a major variation needs to be made, Cake Studio
             will communicate this to the customer and seek re-design approval, 5 days before the event."
          }
        </Typography>
        <FormControlLabel
          control={
            <Checkbox name="agree" value={agree} onChange={handleChange} />
          }
          label="I have read and agreed to the Terms and Conditions"
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{"Cancel"}</Button>
        <Button disabled={!agree} onClick={onClose}>
          {"Accept"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TermsDialog;
