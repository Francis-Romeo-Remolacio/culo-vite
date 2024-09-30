import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Link,
  CircularProgress,
  Skeleton,
  Paper,
  Stack,
} from "@mui/material";
import api from "../../api/axiosConfig";
import Cookies from "js-cookie";
import Header from "../../components/Header";
import { Helmet } from "react-helmet-async";
import ButtonBack from "../../components/ButtonBack.jsx";
import { useFormik } from "formik";
import { loginSchema } from "../../utils/Validation.js";

const Login = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const fromLink = decodeURIComponent(query.get("from") || "");

  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = Cookies.get("token");
      if (token) {
        try {
          const response = await api.get("current-user");
          if (response.status === 200) {
            navigate("/");
          }
        } catch (error) {
          console.error("Token validation error:", error);
          Cookies.remove("token");
        }
      }
    };
    checkToken();
  }, []);

  const onSubmit = async () => {
    try {
      const response = await api.post("users/login", values);

      if (response.status === 200) {
        const { token, expiration } = response.data;

        // Save token as a cookie
        Cookies.set("token", token, { expires: new Date(expiration) });

        // Fetch user data
        const userResponse = await api.get("current-user");

        if (userResponse.status === 200) {
          const userData = userResponse.data;

          // Save user data in local storage
          localStorage.setItem("currentUser", JSON.stringify(userData));

          if (fromLink) {
            navigate(fromLink);
          } else {
            navigate("/");
          }
        }
      }
    } catch (error) {
      console.error("Login error: ", error);
    }
  };

  function navigate(destination: string, subdomain = "") {
    const { protocol, hostname, port } = window.location;

    // Construct the base URL with protocol, subdomain (if provided), hostname, and port (if present)
    const baseURL = subdomain
      ? `${protocol}//${subdomain}.${hostname}`
      : `${protocol}//${hostname}`;

    // Include the port if it's not the default port (80 for HTTP, 443 for HTTPS)
    const fullURL =
      port && port !== "80" && port !== "443"
        ? `${baseURL}:${port}${destination}`
        : `${baseURL}${destination}`;

    window.location.href = fullURL;
  }

  const { values, errors, touched, isSubmitting, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: loginSchema,
      onSubmit,
    });

  return (
    <Container
      maxWidth="sm"
      sx={{
        pt: { xs: "16px", sm: "24px" },
      }}
    >
      <Helmet>
        <title>Login - The Pink Butter Cake Studio</title>
      </Helmet>
      <Box position="absolute" left={0}>
        <ButtonBack />
      </Box>
      <Paper sx={{ p: 2 }}>
        <Stack>
          <Header
            title="Login"
            subtitle="Welcome to The Pink Butter Cake Studio"
          />

          {/* Logo */}
          <Box display="flex" justifyContent="center" mb={2}>
            {!imageLoaded && (
              <Skeleton
                variant="circular"
                width={150}
                height={150}
                animation="wave"
              />
            )}
            <img
              src="src/assets/logo192.png"
              alt="Logo"
              style={{
                width: "150px",
                borderRadius: "100%",
                display: imageLoaded ? "block" : "none",
              }}
              onLoad={() => setImageLoaded(true)}
            />
          </Box>

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                id="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                variant="filled"
                fullWidth
                required
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
              <TextField
                label="Password"
                id="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                variant="filled"
                type="password"
                fullWidth
                required
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {!isSubmitting ? "Login" : <CircularProgress size={21} />}
              </Button>
            </Stack>
          </form>

          <Box mt={2}>
            <Typography variant="body2">
              Don't have an account?{" "}
              <Link href="/register" sx={{ color: "primary" }}>
                Click here
              </Link>{" "}
              to register.
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Login;
