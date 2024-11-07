import { MouseEvent, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link,
  CircularProgress,
  Skeleton,
  Paper,
  Stack,
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
import { loginSchema } from "../../utils/Validation.js";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../../components/AuthContext.js";
import { Link as RouterLink } from "react-router-dom";

const Login = () => {
  const { authError, login } = useAuth();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const fromLink = decodeURIComponent(query.get("from") || "");

  const [imageLoaded, setImageLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const onSubmit = async () => {
    try {
      await login(values.email, values.password, fromLink);
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
      password: "",
    },
    validationSchema: loginSchema,
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
        <title>{"Login - Cake Studio"}</title>
      </Helmet>
      <Paper sx={{ p: 2 }}>
        <Box position="absolute">
          <ButtonBack />
        </Box>
        <Stack>
          <Header title="Login" subtitle="Welcome to Cake Studio" />

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
              src="logo.png"
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
                autoComplete="email"
                required
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
              <FormControl variant="filled">
                <InputLabel htmlFor="password">{"Password"}</InputLabel>
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
                {!isSubmitting ? "Login" : <CircularProgress size={21} />}
              </Button>
            </Stack>
          </form>

          <Stack mt={2}>
            <Typography variant="body2">
              {"Don't have an account? "}
              <Link
                to="/register"
                component={RouterLink}
                sx={{ textDecoration: "none" }}
                color="primary"
              >
                {"Click here"}
              </Link>
              {" to register."}
            </Typography>
            <Typography variant="body2">
              <Link
                to="/forgot-password"
                component={RouterLink}
                sx={{ textDecoration: "none" }}
                color="primary"
              >
                {"Forgot Password?"}
              </Link>
            </Typography>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Login;
