import { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
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
import { User } from "../../utils/Schemas";
import Header from "../../components/Header";
import { Helmet } from "react-helmet-async";
import { getImageType } from "../../components/Base64Image";
import { useAlert } from "../../components/CuloAlert";

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

  const [userData, setUserData] = useState<User>();
  const [userPicture, setUserPicture] = useState("");
  const [imageType, setImageType] = useState("png");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmittingVerify, setIsSubmittingVerify] = useState(false);

  const fetchUserPicture = async () => {
    await api.get("current-user/profile-picture").then((response) => {
      setUserPicture(response.data);
      setImageType(getImageType(userPicture));
    });
  };

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
          fetchUserPicture();
        });
      } catch (err) {
        setError("Failed to fetch user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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
        setError("File size exceeds the limit of 1MB.");
        return;
      }

      try {
        // Convert the file to base64 string (without header)
        const base64String = await convertImageToBase64(file);

        // Get the auth token from cookies
        const token = Cookies.get("token");
        if (!token) {
          setError("No token found. Please log in.");
          return;
        }

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
        <Button variant="contained" onClick={handleLogout} href="/">
          Log out
        </Button>
      </Stack>
    </Container>
  );
};

export default Profile;
