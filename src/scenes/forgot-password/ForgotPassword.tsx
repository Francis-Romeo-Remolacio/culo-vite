import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
  Paper,
  Stack,
  Tooltip,
  FormControl,
  InputLabel,
  FilledInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Header from "../../components/Header";
import { Helmet } from "react-helmet-async";
import ButtonBack from "../../components/ButtonBack.jsx";
import { useFormik } from "formik";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../../utils/Validation.js";
import { useAuth } from "../../components/AuthContext.js";
import { useLocation } from "react-router-dom";
import { MouseEvent, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const ForgotPassword = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const token = decodeURIComponent(query.get("q") || "");

  if (token) {
    const { authError, resetPassword } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };

    const onSubmit = async () => {
      try {
        await resetPassword(token, values.password);
      } catch (error) {
        console.error("Registration error: ", error);
      }
    };

    const {
      values,
      errors,
      touched,
      isSubmitting,
      isValid,
      handleChange,
      handleSubmit,
    } = useFormik({
      initialValues: {
        password: "",
        confirmPassword: "",
      },
      validationSchema: resetPasswordSchema,
      onSubmit,
      validateOnMount: true,
    });
    return (
      <Container
        maxWidth="sm"
        sx={{
          pt: 3,
        }}
      >
        <Helmet>
          <title>Reset Password - The Pink Butter Cake Studio</title>
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
              title="Reset Password"
              subtitle="Change to a new password"
            />

            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
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
                {authError ? (
                  <Typography variant="subtitle2" color="error">
                    {authError}
                  </Typography>
                ) : null}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting || !isValid}
                >
                  {!isSubmitting ? (
                    "Reset Password"
                  ) : (
                    <CircularProgress size={21} />
                  )}
                </Button>
              </Stack>
            </form>
          </Stack>
        </Paper>
      </Container>
    );
  } else {
    const { authError, forgotPassword } = useAuth();

    const onSubmit = async () => {
      try {
        await forgotPassword(values.email);
      } catch (error) {
        console.error("An unexpected error occurred. Please try again later.");
      }
    };

    const {
      values,
      errors,
      touched,
      isSubmitting,
      isValid,
      handleChange,
      handleSubmit,
    } = useFormik({
      initialValues: {
        email: "",
      },
      validationSchema: forgotPasswordSchema,
      onSubmit,
      validateOnMount: true,
    });

    return (
      <Container
        maxWidth="sm"
        sx={{
          pt: 3,
        }}
      >
        <Helmet>
          <title>{"Forgot Password - The Pink Butter Cake Studio"}</title>
        </Helmet>
        <Paper sx={{ p: 2 }}>
          <Box position="absolute">
            <ButtonBack />
          </Box>
          <Stack>
            <Header
              title="Forgot Password"
              subtitle="Send request for password reset"
            />

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
                  autoComplete="email"
                  required
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
                {authError ? (
                  <Typography variant="subtitle2" color="error">
                    {authError}
                  </Typography>
                ) : null}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting || !isValid}
                >
                  {!isSubmitting ? (
                    "Request Reset Password"
                  ) : (
                    <CircularProgress size={21} />
                  )}
                </Button>
              </Stack>
            </form>
          </Stack>
        </Paper>
      </Container>
    );
  }
};

export default ForgotPassword;
