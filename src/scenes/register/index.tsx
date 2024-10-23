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
  Tooltip,
} from "@mui/material";
import api from "../../api/axiosConfig";
import Header from "../../components/Header";
import { Helmet } from "react-helmet-async";
import ButtonBack from "./../../components/ButtonBack.jsx";
import { useFormik } from "formik";
import { registerSchema } from "../../utils/Validation.js";
import { MouseEvent, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAlert } from "../../components/CuloAlert.js";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const { makeAlert } = useAlert();

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
      await api.post("users/register-customer", {
        username: values.username,
        email: values.email,
        contactNumber: trimmedContactNumber,
        password: values.password,
      });
      makeAlert(
        "success",
        "Registration successful! Please check your email for verification."
      );
      navigate("/login");
    } catch (error) {
      console.error("Registration error: ", error);
      makeAlert("error", "Registration failed! Please try again.");
    }
  };

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
    <Container
      maxWidth="sm"
      sx={{
        pt: 3,
      }}
    >
      <Helmet>
        <title>Register - The Pink Butter Cake Studio</title>
      </Helmet>
      <Box position="absolute" left={0}>
        <ButtonBack />
      </Box>
      <Paper sx={{ p: 2 }}>
        <Box position="absolute">
          <ButtonBack />
        </Box>
        <Stack spacing={2}>
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
              <Tooltip
                title="Must contain at least 8 characters, including a lowercase and uppercase letter, a number, and a symbol"
                followCursor
              >
                <FormControl variant="filled" required>
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <FilledInput
                    id="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    fullWidth
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
              </Tooltip>
              <FormControl variant="filled" required>
                <InputLabel htmlFor="password">Confirm Password</InputLabel>
                <FilledInput
                  id="confirmPassword"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  fullWidth
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
              <Typography variant="subtitle2">
                {
                  "Upon registering, you will receive an email for verification. Verification is required for ordering."
                }
              </Typography>
              <Typography variant="subtitle2"></Typography>
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
        </Stack>
      </Paper>
    </Container>
  );
};

export default Register;
