import { ChangeEvent, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Stack,
  Avatar,
  Skeleton,
  styled,
} from "@mui/material";
import api from "../../api/axiosConfig";
import Cookies from "js-cookie";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Header from "../../components/Header";
import { Helmet } from "react-helmet-async";
import { useAlert } from "../../components/CuloAlert";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const Profile = () => {
  const { makeAlert } = useAlert();
  const { currentUser, userPicture, imageType } = useAuth();
  const navigate = useNavigate();

  const [isSubmittingVerify, setIsSubmittingVerify] = useState(false);

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove the "data:image/*;base64," part
        const base64Image = base64String.replace(
          /^data:image\/\w+;base64,/,
          ""
        );
        resolve(base64Image);
      };

      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];

      // Check file size limit (1MB)
      if (file.size > 1024 * 1024) {
        makeAlert("error", "File size exceeds the limit of 1MB.");
        return;
      }

      try {
        // Convert the file to base64 string (without header)
        const base64String = await convertImageToBase64(file);

        // Submit the base64 string to the API endpoint
        if (userPicture) {
          await api.patch("/current-user/profile-picture", base64String, {
            headers: {
              "Content-Type": "application/json",
            },
          });
        } else {
          await api.post("/current-user/upload-profile-picture", base64String, {
            headers: {
              "Content-Type": "application/json",
            },
          });
        }

        makeAlert("success", "File uploaded successfully.");
      } catch (err) {
        console.error("File upload error:", err);
        makeAlert("error", "Failed to upload file. Please try again.");
      }
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

  return (
    <Container maxWidth="sm">
      <Helmet>
        <title>{"Profile - Cake Studio"}</title>
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
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                sx={{ position: "absolute", top: 180 }}
              >
                {"Upload File"}
                <VisuallyHiddenInput type="file" onChange={handleFileUpload} />
              </Button>
            </>
          )}
        </Box>
        <Typography variant="body1">{`Email: ${currentUser?.email}`}</Typography>
        <Typography variant="body1">{`Username: ${currentUser?.username}`}</Typography>
        <Typography variant="body1">{`Roles: ${currentUser?.roles[0]}`}</Typography>
        <Typography variant="body1">
          {`Phone Number: ${
            currentUser?.phoneNumber ? currentUser.phoneNumber : "None"
          }`}
        </Typography>
        <Stack direction="row">
          <Typography variant="body1">{`Email Confirmed: `}</Typography>
          {currentUser?.isEmailConfirmed ? (
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
          {`Join Date: ${String(currentUser?.joinDate)}`}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/transaction-history")}
        >
          Transaction History
        </Button>
        <Button variant="contained" onClick={handleLogout} href="/">
          Log out
        </Button>
      </Stack>
    </Container>
  );
};

export default Profile;
