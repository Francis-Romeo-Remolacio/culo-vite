import { useState } from "react";
import { Button, Paper, Slide, TextField } from "@mui/material";
import { useFormik } from "formik";
import { Suborder } from "../../utils/Schemas";
import { orderSchema } from "../../utils/Validation";
import { Dayjs } from "dayjs";

type CheckoutProps = {
  suborderIds: Suborder[];
  fetchCart: () => Promise<void>;
};

const Checkout = ({ suborderIds, fetchCart }: CheckoutProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const onSubmit = () => {
    fetchCart();
  };

  // const {
  //   values,
  //   errors,
  //   touched,
  //   isSubmitting,
  //   handleBlur,
  //   handleChange,
  //   handleSubmit,
  // } = useFormik({
  //   initialValues: {
  //     type: "",
  //     pickupDateTime: Dayjs,
  //     payment: "",
  //     suborderIds: [],
  //   },
  //   validationSchema: orderSchema,
  //   onSubmit,
  // });
  return (
    <>
      <Button></Button>
      <Slide direction="left">
        <Paper sx={{ p: 2 }}>
          <form onSubmit={onSubmit}>
            <TextField></TextField>
          </form>
        </Paper>
      </Slide>
    </>
  );
};

export default Checkout;
