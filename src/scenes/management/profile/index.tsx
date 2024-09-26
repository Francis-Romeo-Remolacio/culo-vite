import React, { useEffect, useState } from "react";
import {
  Box,
  useTheme,
  CircularProgress,
  Typography,
  Button,
} from "@mui/material";
import { Tokens } from "../../../theme";
import api from "../../../api/axiosConfig";
import Cookies from "js-cookie";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          setError("No token found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await api.get("current-user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData(response.data);
      } catch (err) {
        setError("Failed to fetch user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file.size > 1024 * 1024) {
      setError("File size exceeds the limit of 1MB.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64String = reader.result.split(",")[1];

      try {
        const token = Cookies.get("token");
        if (!token) {
          setError("No token found. Please log in.");
          return;
        }

        const response = await api.post(
          "/current-user/upload-profile-picture",
          base64String,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to upload file.");
        }

        alert("File uploaded successfully.");
      } catch (err) {
        console.error("File upload error:", err);
        alert("Failed to upload file. Please try again.");
      }
    };
  };

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("currentUser");
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      m="1rem"
      backgroundColor={colors.panel}
      p="1rem"
      borderRadius="1rem"
      sx={{ backdropFilter: "blur(24px)" }}
    >
      <Typography variant="h4">Profile</Typography>
      <Box
        backgroundColor={colors.panel}
        borderRadius="100%"
        display="inline-block"
        p="1rem"
        sx={{
          "aspect-ratio": "1",
        }}
      >
        <Box display="flex" alignItems="center" height="100%">
          <label htmlFor="file-upload">
            <Button
              component="span"
              variant="contained"
              startIcon={<CloudUploadIcon />}
            >
              Upload File
            </Button>
          </label>
        </Box>
      </Box>
      <Typography variant="body1">Email: {userData.email}</Typography>
      <Typography variant="body1">Username: {userData.username}</Typography>
      <Typography variant="body1">
        Roles: {userData.roles.join(", ")}
      </Typography>
      <Typography variant="body1">
        Phone Number: {userData.phone_number}
      </Typography>
      <Typography variant="body1">
        Email Confirmed: {userData.is_email_confirmed ? "Yes" : "No"}
      </Typography>
      <Typography variant="body1">
        Join Date: {new Date(userData.join_date).toLocaleDateString()}
      </Typography>
      <Box mt={2}>
        <input
          id="file-upload"
          type="file"
          accept=".png, .jpg"
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
      </Box>
      <Button variant="contained" onClick={handleLogout} href="/">
        Log out
      </Button>
    </Box>
  );
};

export default Profile;
