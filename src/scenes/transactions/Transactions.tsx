import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import api from "../../api/axiosConfig";
import { Transaction } from "../../utils/Schemas";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Fetch the transaction history
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get("/current-user/transaction/history");
        setTransactions(response.data); // Assuming the response is an array
      } catch (error) {
        console.error("Error fetching transactions", error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <Paper sx={{ p: 2, width: "100%" }}>
      <Typography variant="h5" gutterBottom>
        Transaction History
      </Typography>
      <List>
        {transactions.map((transaction) => (
          <React.Fragment key={transaction.id}>
            <ListItem>
              <ListItemText
                primary={`Order ID: ${transaction.orderId}`}
                secondary={
                  <Box>
                    <Typography variant="body2">
                      Status: {transaction.status}
                    </Typography>
                    <Typography variant="body2">
                      Total Price: ₱{transaction.totalPrice.toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      Total Paid: ₱{transaction.totalPaid.toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      Date: {new Date(transaction.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default TransactionHistory;
