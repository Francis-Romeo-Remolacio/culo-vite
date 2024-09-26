import {
  Button,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { customOrderSchema } from "../../utils/Validation.js";

const Custom = () => {
  const availableFlavors = [
    "Dark Chocolate",
    "Funfetti (vanilla with sprinkles)",
    "Vanilla Caramel",
    "Mocha",
    "Red Velvet",
    "Banana",
  ];
  const minDate = dayjs().add(7, "day");

  const onSubmit = () => {};

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    validateForm,
  } = useFormik({
    initialValues: {
      color: "",
      shape: "",
      tier: null,
      quantity: 1,
      cover: "",
      description: "",
      size: "",
      flavor: "",
      picture: "",
      message: "",
      type: "",
      pickupDateTime: minDate,
    },
    validationSchema: customOrderSchema,
    onSubmit,
  });

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Stack maxWidth="sm" spacing={2}>
          <DateTimePicker
            label="Pickup Date & Time"
            id="pickupDateTime"
            name="pickupDateTime"
            minDate={minDate}
            minTime={dayjs("2018-01-01T09:00")}
            maxTime={dayjs("2018-01-01T16:00")}
            value={values.pickupDateTime}
            onChange={handleChange}
            renderInput={(params) => <TextField {...params} />}
          />
          <TextField label="Tiers" id="tier" name="tier" value={values.tier} />
          <TextField
            inputProps={{ type: "number", min: 1, max: 6 }}
            label="Custom Size"
            id="customSize"
            name="customSize"
            value={values.customSize}
          />
          <FormControl>
            <TextField
              label="Tiers"
              id="tier"
              name="tier"
              value={values.tier}
            />
            <FormHelperText id="helper-customsize">
              Example: 2tier cake - 5"x7" and 7"x7" Round
            </FormHelperText>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="select-flavor-label">Flavor</InputLabel>
            <Select
              labelId="select-flavor-label"
              id="select-flavor"
              name="flavor"
              value={values.flavor}
              label="Flavor"
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.flavor && Boolean(errors.flavor)}
              helperText={touched.flavor && errors.flavor}
            >
              {availableFlavors.map((flavor) => (
                <MenuItem key={flavor} value={flavor}>
                  {flavor}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="select-cover-label">Cover</InputLabel>
            <Select
              labelId="select-cover-label"
              id="select-cover"
              name="cover"
              value={values.cover}
              label="Cover"
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.cover && Boolean(errors.cover)}
              helperText={touched.cover && errors.cover}
            >
              <MenuItem key="fondant" value="fondant">
                Fondant
              </MenuItem>
              <MenuItem key="buttercream" value="buttercream">
                Buttercream
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl>
            <TextField
              label="Event's theme/color palette/important notes/requests"
              id="field-description"
              name="description"
              value={values.description}
              onChange={handleChange}
              multiline
              rows={4}
            />
            <FormHelperText id="helper-description">
              Example - Theme: Disney Princess - Belle Color palette: Red,
              Pastel Yellow, Gold; Notes: #30 candle
            </FormHelperText>
          </FormControl>
          <TextField
            label="Cake Message"
            id="field-message"
            name="message"
            value={values.message}
            onChange={handleChange}
            multiline
            rows={4}
          />
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </Stack>
      </form>
    </Container>
  );
};

export default Custom;
