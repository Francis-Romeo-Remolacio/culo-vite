import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  useTheme,
  CircularProgress,
  Typography,
  Button,
  Container,
  Stack,
  Avatar,
  Skeleton,
  Snackbar,
  Alert,
} from "@mui/material";
import { Tokens } from "../../../Theme";
import api from "../../../api/axiosConfig";
import Cookies from "js-cookie";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate } from "react-router-dom";
import { User } from "../../../utils/Schemas";
import Header from "../../../components/Header";
import { Helmet } from "react-helmet-async";
import { getImageType } from "../../../components/Base64Image";

const Profile = () => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);

  const [userData, setUserData] = useState<User>();
  const [userPicture, setUserPicture] = useState("");
  const [imageType, setImageType] = useState("png");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [error, setError] = useState("");
  const [isSubmittingVerify, setIsSubmittingVerify] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          setError("No token found. Please log in.");
          setLoading(false);
          return;
        }

        await api.get("current-user").then((response) => {
          const parsedUser: User = {
            id: response.data.user_id,
            email: response.data.email,
            username: response.data.username,
            roles: response.data.roles,
            phoneNumber: response.data.phoneNumber,
            isEmailConfirmed: response.data.isEmailConfirmed,
            joinDate: response.data.joinDate,
          };
          setUserData(parsedUser);
        });

        await api.get("current-user/profile-picture").then((response) => {
          setUserPicture(response.data);
          setImageType(getImageType(userPicture));
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

  const handleVerify = async () => {
    try {
      setIsSubmittingVerify(true);
      await api.post("current-user/send-confirmation-email");
      makeAlert("success", "Successfully sent verification request.");
    } catch (error) {
      console.error(error);
      makeAlert(
        "error",
        "Failed to make verification request. Please try again"
      );
    } finally {
      setIsSubmittingVerify(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("currentUser");
  };
  const makeAlert = (severity: string, message: string) => {
    setSeverity(severity);
    setAlertMessage(message);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAlertMessage("");
    setSeverity("");
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

  return (
    <Container maxWidth="sm">
      <Helmet>
        <title>{"Profile - The Pink Butter Cake Studio"}</title>
      </Helmet>
      <Header title="Profile" />
      <Stack spacing={2}>
        <Box display="flex" justifyContent="center" height="100%">
          {userPicture ? (
            <Avatar
              src={`data:${imageType};base64,${userPicture}`}
              sx={{ width: 160, height: 160 }}
            />
          ) : (
            <>
              <Skeleton variant="circular" width={160} height={160}></Skeleton>
              <Button
                component="span"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                sx={{ position: "absolute", top: 180 }}
              >
                {"Upload File"}
              </Button>
            </>
          )}
        </Box>
        <Typography variant="body1">{`Email: ${userData?.email}`}</Typography>
        <Typography variant="body1">{`Username: ${userData?.username}`}</Typography>
        <Typography variant="body1">{`Roles: ${userData?.roles[0]}`}</Typography>
        <Typography variant="body1">
          {`Phone Number: ${
            userData?.phoneNumber ? userData.phoneNumber : "None"
          }`}
        </Typography>
        <Stack direction="row">
          <Typography variant="body1">{`Email Confirmed: `}</Typography>
          {userData?.isEmailConfirmed ? (
            "Yes"
          ) : (
            <>
              <Typography>{"No"}</Typography>
              <Button
                onClick={handleVerify}
                disabled={isSubmittingVerify}
                sx={{ height: "2rem" }}
              >
                {"Verify Email"}
              </Button>
            </>
          )}
        </Stack>
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
      </Stack>
      <Snackbar
        open={open}
        onClose={handleClose}
        autoHideDuration={2500}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={severity}>{alertMessage}</Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;
