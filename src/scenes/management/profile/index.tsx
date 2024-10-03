import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  useTheme,
  CircularProgress,
  Typography,
  Button,
} from "@mui/material";
import { Tokens } from "../../../Theme";
import api from "../../../api/axiosConfig";
import Cookies from "js-cookie";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate } from "react-router-dom";
import { User } from "../../../utils/Schemas";

const Profile = () => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);
  const [userData, setUserData] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          setError("No token found. Please log in.");
          setLoading(false);
          return;
        }

        await api
          .get("current-user", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            const parsedUser: User = {
              id: response.data.user_id,
              email: response.data.email,
              username: response.data.username,
              roles: response.data.roles,
              phoneNumber: response.data.phoneNumber,
              isEmailConfirmed: response.data.email,
              joinDate: response.data.joinDate,
            };
          });
      } catch (err) {
        setError("Failed to fetch user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file.size > 1024 * 1024) {
        setError("File size exceeds the limit of 1MB.");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        const base64String = reader.result;

        try {
          const token = Cookies.get("token");
          if (!token) {
            setError("No token found. Please log in.");
            return;
          }

          await api.post("/current-user/upload-profile-picture", base64String, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          alert("File uploaded successfully.");
        } catch (err) {
          console.error("File upload error:", err);
          alert("Failed to upload file. Please try again.");
        }
      };
    }
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
    <Box>
      <Typography variant="h4">Profile</Typography>
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
      <Typography variant="body1">{`Email: ${userData?.email}`}</Typography>
      <Typography variant="body1">{`Username: ${userData?.username}`}</Typography>
      <Typography variant="body1">{`Roles: ${userData?.roles[0]}`}</Typography>
      <Typography variant="body1">
        {`Phone Number: ${
          userData?.phoneNumber ? userData.phoneNumber : "None"
        }`}
      </Typography>
      <Typography variant="body1">
        {`Email Confirmed: ${userData?.isEmailConfirmed ? "Yes" : "No"}`}
      </Typography>
      <Typography variant="body1">
        {`Join Date: ${String(userData?.joinDate)}`}
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
