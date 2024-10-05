import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ConfirmEmail = () => {
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(5); // Timer state
  const location = useLocation();
  const navigate = useNavigate();

  // Extract query parameter `q`
  const queryParams = new URLSearchParams(location.search);
  const confirmationCode = queryParams.get("q");

  useEffect(() => {
    if (confirmationCode) {
      // Call the API to confirm the email
      axios
        .post(
          `/current-user/confirm-email?confirmationCode=${confirmationCode}`
        )
        .then((response) => {
          setMessage(response.data.message || "Email confirmed successfully!");
        })
        .catch((error) => {
          setMessage(error.response?.data?.message || "Error confirming email");
        });
    } else {
      setMessage("Invalid confirmation code.");
    }
  }, [confirmationCode]);

  // Timer and redirection logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1); // Update countdown
    }, 1000);

    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => {
      clearInterval(interval); // Clear interval on unmount
      clearTimeout(timer); // Clear timeout on unmount
    };
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Typography variant="h1">{message}</Typography>
      <Typography variant="h3">
        Redirecting in {countdown} seconds...
      </Typography>
    </div>
  );
};

export default ConfirmEmail;
