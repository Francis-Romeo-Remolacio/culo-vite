import { Tokens } from "../../Theme";
import {
  Box,
  Button,
  Container,
  Grid2 as Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../api/axiosConfig";
import { Paymongo } from "../../utils/Schemas";
import { toCurrency } from "../../utils/Formatter";

const PostPayment = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const transactionId = query.get("transaction");

  const [transaction, setTransaction] = useState<Paymongo | null>(null);
  const [message1, setMessage1] = useState("Payment Pending...");
  const [message2, setMessage2] = useState(
    "We are waiting for your payment confirmation."
  );
  const [status, setStatus] = useState("pending");
  const [pollAttempts, setPollAttempts] = useState(0);

  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);

  const backgroundColor =
    status === "success"
      ? colors.complementary[500]
      : status === "failed"
      ? colors.analogous2[500]
      : colors.grey[500];

  const fetchTransaction = async () => {
    try {
      const response = await api.get(
        `transactions/${transactionId}/payment-status`
      );
      const paymongoData = response.data.data;
      const parsedTransaction: Paymongo = {
        id: paymongoData.id,
        type: paymongoData.type,
        attributes: {
          amount: paymongoData.attributes.amount,
          taxAmount: paymongoData.attributes.tax_amount,
          checkoutUrl: paymongoData.attributes.checkout_url,
          payments: paymongoData.attributes.payments,
          referenceNumber: paymongoData.attributes.reference_number,
          status: paymongoData.attributes.status,
        },
      };
      setTransaction(parsedTransaction);
      setStatus(
        parsedTransaction.attributes.status === "paid" ? "success" : "pending"
      );
    } catch (error) {
      console.error("Failed to fetch transaction:", error);
    }
  };

  useEffect(() => {
    // Poll every 10 seconds, but stop after 6 attempts or if the status is not "pending"
    const pollTransaction = () => {
      fetchTransaction();
      setPollAttempts((prev) => prev + 1);
    };

    if (pollAttempts < 6 && status === "pending") {
      const intervalId = setInterval(pollTransaction, 10000); // Poll every 10 seconds
      return () => clearInterval(intervalId);
    }

    // If still unpaid after 6 attempts, mark the status as failed
    if (pollAttempts >= 6 && status === "pending") {
      setStatus("failed");
    }
  }, [pollAttempts, status, transactionId]); // Properly manage dependencies

  useEffect(() => {
    if (transaction) {
      switch (status) {
        case "success":
          setMessage1("Payment Success!");
          setMessage2("Please await your notification for pickup.");
          break;
        case "failed":
          setMessage1("Payment Failed!");
          setMessage2("Something went wrong, please try again.");
          break;
        case "pending":
          setMessage1("Payment Pending...");
          setMessage2("We are waiting for your payment confirmation.");
          break;
        default:
          setMessage1("Unknown Status");
          setMessage2("Please contact support.");
      }
    }
  }, [transaction, status]);

  return (
    <Stack spacing={2} alignItems="center">
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        sx={{
          backgroundColor: backgroundColor,
          borderRadius: 24,
          minWidth: "100%",
          minHeight: 512,
          boxShadow: "0px 8px 8px #00000030 inset",
          p: 4,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            width: "100%",
            height: 448,
            borderRadius: 16,
            backgroundColor: colors.background,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Stack sx={{ maxWidth: "fit-content" }}>
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

            {/* Display transaction details if the payment is successful */}
            {status === "success" && transaction && (
              <Stack spacing={2} mt={4} alignItems="center">
                <Typography variant="h5">
                  <span style={{ fontWeight: "bold" }}>Amount: </span>
                  {toCurrency(transaction.attributes.amount)}
                </Typography>
                {transaction.attributes.taxAmount ? (
                  <Typography variant="h6">
                    <span style={{ fontWeight: "bold" }}>Tax: </span>
                    {toCurrency(transaction.attributes.taxAmount)}
                  </Typography>
                ) : null}
                <Typography variant="h6">
                  <span style={{ fontWeight: "bold" }}>Reference Number: </span>
                  {transaction.attributes.referenceNumber}
                </Typography>
              </Stack>
            )}
          </Stack>
        </Paper>
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
