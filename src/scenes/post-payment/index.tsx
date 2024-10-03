import { Tokens } from "../../Theme";
import {
  Button,
  Grid2 as Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const PostPayment = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const transactionId = query.get("transaction") || undefined;

  const [transaction, setTransaction] = useState<any>({ result: "success" });
  const [message1, setMessage1] = useState("");
  const [message2, setMessage2] = useState("");

  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);

  // useEffect(() => {
  //   const response = api.get(`payments/${transactionId}`)
  //   setTransaction(response.data as any)
  // }, []);

  useEffect(() => {
    switch (transaction.result) {
      case "success":
        setMessage1("Payment Success!");
        setMessage2("Please await your notification for pickup.");
        break;
      case "failed":
        setMessage1("Payment Failed!");
        setMessage2("Something went wrong, please try again.");
        break;
    }
  }, [transaction]);

  return (
    <Stack spacing={2} alignItems="center">
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        sx={{
          backgroundColor:
            transaction.result === "success"
              ? colors.complementary[500] // Assuming you have a success color defined in your theme
              : colors.analogous2[500], // Assuming you have an error color defined in your theme
          borderRadius: 16,
          minWidth: "100%",
          minHeight: 512,
          boxShadow: "0px 8px 8px #00000030 inset",
        }}
      >
        <Grid>
          <Stack>
            <Typography
              variant="h1"
              alignItems="center"
              justifyContent="center"
            >
              {message1}
            </Typography>
            <Typography
              variant="h3"
              alignItems="center"
              justifyContent="center"
            >
              {message2}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
      <Stack spacing={1} direction="row">
        <Button href="/" variant="contained">
          Back to Store
        </Button>
        <Button variant="contained">View my Orders</Button>
      </Stack>
    </Stack>
  );
};

export default PostPayment;
