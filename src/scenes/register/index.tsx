import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  Container,
  Link,
  CircularProgress,
  Stack,
  Skeleton,
  Paper,
  FormControl,
  InputLabel,
  IconButton,
  FilledInput,
} from "@mui/material";
import api from "../../api/axiosConfig";
import Cookies from "js-cookie";
import Header from "../../components/Header";
import { Helmet } from "react-helmet-async";
import ButtonBack from "./../../components/ButtonBack.jsx";
import { useFormik } from "formik";
import { registerSchema } from "../../utils/Validation.js";
import { MouseEvent, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Register = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const onSubmit = async () => {
    // Trim leading zeroes from contactNumber
    const trimmedContactNumber = values.contactNumber.replace(/^0+/, "");

    try {
      const response = await api.post("users/register-customer", {
        username: values.username,
        email: values.email,
        contactNumber: trimmedContactNumber,
        password: values.password,
      });

      if (response.status === 200) {
        // Registration successful, now login
        const loginResponse = await api.post("login", {
          email: values.email,
          password: values.password,
        });

        if (loginResponse.status === 200) {
          // Login successful, save token and redirect
          const { token, expiration } = loginResponse.data;
          Cookies.set("token", token, { expires: new Date(expiration) });
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Registration error: ", error);
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
        username: "",
        email: "",
        contactNumber: "",
        password: "",
        confirmPassword: "",
      },
      validationSchema: registerSchema,
      onSubmit,
    });

  return (
    <Container>
      <Helmet>
        <title>Register - The Pink Butter Cake Studio</title>
      </Helmet>
      <Box position="absolute" left={0}>
        <ButtonBack />
      </Box>
      <Paper sx={{ p: 2 }}>
        <Box>
          <Header
            title="Register"
            subtitle="Create an account at The Pink Butter Cake Studio"
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
              src="logo192.png"
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
                label="Username"
                id="username"
                name="username"
                value={values.username}
                onChange={handleChange}
                variant="filled"
                fullWidth
                required
                error={touched.username && Boolean(errors.username)}
                helperText={touched.username && errors.username}
              />
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
                label="Contact Number"
                id="contactNumber"
                name="contactNumber"
                value={values.contactNumber}
                onChange={handleChange}
                variant="filled"
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">(+63)</InputAdornment>
                  ),
                }}
                inputProps={{
                  maxlength: 12,
                }}
                error={touched.contactNumber && Boolean(errors.contactNumber)}
                helperText={touched.contactNumber && errors.contactNumber}
              />
              <FormControl variant="filled">
                <InputLabel htmlFor="password">Password</InputLabel>
                <FilledInput
                  id="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={touched.password && Boolean(errors.password)}
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <TextField
                label="Confirm Password"
                id="confirmPassword"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                type="password"
                variant="filled"
                fullWidth
                required
                error={
                  touched.confirmPassword && Boolean(errors.confirmPassword)
                }
                helperText={touched.confirmPassword && errors.confirmPassword}
              />
              <FormControl variant="filled">
                <InputLabel htmlFor="password">Password</InputLabel>
                <FilledInput
                  id="confirmPassword"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={
                    touched.confirmPassword && Boolean(errors.confirmPassword)
                  }
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {!isSubmitting ? "Register" : <CircularProgress size={21} />}
              </Button>
            </Stack>
          </form>

          <Box mt={2}>
            <Typography variant="body2">
              Already have an account?{" "}
              <Link href="/login" color="primary">
                Click here
              </Link>{" "}
              to login.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
