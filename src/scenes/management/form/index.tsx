import {
  Button,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  Stack,
  InputAdornment,
  FormControl,
  InputLabel,
  Container,
} from "@mui/material";
import api from "../../../api/axiosConfig";
import { registerAdminSchema } from "../../../utils/Validation.js";
import { useFormik } from "formik";
import { useAlert } from "../../../components/CuloAlert.js";
import Header from "../../../components/Header.js";

const Form = () => {
  const { makeAlert } = useAlert();

  const onSubmit = async () => {
    try {
      await api.post(`users/register-${values.type}`, values);
      makeAlert("success", "User was successfully registered");
      resetForm();
    } catch (error) {
      console.error(error);
      makeAlert("error", `Unknown error: ${error}`);
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
    resetForm,
  } = useFormik({
    initialValues: {
      username: "",
      email: "",
      contactNumber: "",
      password: "",
      confirmPassword: "",
      type: "",
      secretKey: null,
    },
    validationSchema: registerAdminSchema,
    onSubmit,
    validateOnMount: true,
  });

  return (
    <Container maxWidth={"sm"}>
      <Header title="REGISTER USER" />
      <form onSubmit={handleSubmit}>
        <Stack spacing={2} sx={{ mt: 2 }}>
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
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">(+63)</InputAdornment>
                ),
              },
              htmlInput: {
                maxlength: 11,
              },
            }}
            error={touched.contactNumber && Boolean(errors.contactNumber)}
            helperText={touched.contactNumber && errors.contactNumber}
          />
          <TextField
            label="Password"
            id="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            type="password"
            variant="filled"
            fullWidth
            required
            error={touched.password && Boolean(errors.password)}
            helperText={touched.password && errors.password}
          />
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
            error={touched.confirmPassword && Boolean(errors.confirmPassword)}
            helperText={touched.confirmPassword && errors.confirmPassword}
          />
          <FormControl variant="filled" fullWidth>
            <InputLabel id="select-type-label">Type</InputLabel>
            <Select
              labelId="select-type-label"
              label="Type"
              id="select-type"
              name="type"
              value={values.type}
              onChange={handleChange}
            >
              <MenuItem value="customer">Customer</MenuItem>
              <MenuItem value="artist">Artist</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          {values.type === "admin" && (
            <TextField
              label="Secret Key"
              id="secret_key"
              name="secret_key"
              value={values.secretKey}
              onChange={handleChange}
              variant="filled"
              fullWidth
              required
            />
          )}
          <Button
            type="submit"
            variant="contained"
            onClick={(e) => e.preventDefault}
            disabled={isSubmitting || !isValid}
          >
            {!isSubmitting ? "Register" : <CircularProgress size={21} />}
          </Button>
        </Stack>
      </form>
    </Container>
  );
};

export default Form;
