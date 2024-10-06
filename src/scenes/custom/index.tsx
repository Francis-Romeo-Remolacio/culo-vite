import {
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Slider,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import dayjs from "dayjs";
import { customOrderSchema } from "../../utils/Validation.js";
import {
  Add as AddIcon,
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { ChangeEvent, useState } from "react";
import Header from "../../components/Header.js";
import api from "../../api/axiosConfig.js";

const availableTiers = [
  '5"x4" (round)',
  '6"x4" (round)',
  '8"x4" (round)',
  '9"x4" (round)',
  '10"x4" (round)',
  '12"x4" (round)',
  '14"x4" (round)',
  '16"x4" (round - dummy)',
  '18"x4" (round - dummy)',
  '20"x4" (round - dummy)',
];
const availableFlavors = [
  "Dark Chocolate",
  "Funfetti (vanilla with sprinkles)",
  "Vanilla Caramel",
  "Mocha",
  "Red Velvet",
  "Banana",
];

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

const Custom = () => {
  const [tiers, setTiers] = useState<string[]>([]);
  const [heart, setHeart] = useState("");
  const [rectangleX, setRectangleX] = useState(12);
  const [rectangleY, setRectangleY] = useState(8);
  const minDate = dayjs().add(7, "day");

  const onSubmit = async () => {
    let sizeOut = "";
    switch (values.shape) {
      case "round":
        sizeOut = values.sizeRound;
        break;
      case "heart":
        sizeOut = values.sizeHeart;
        break;
      case "rectangle":
        sizeOut = values.sizeRectangle;
        break;
    }
    try {
      await api.post("current-user/custom-orders", {
        color: values.color,
        shape: values.color,
        tier: tiers.length ? String(tiers.length) : "",
        quantity: 1,
        cover: values.cover,
        description: values.description,
        size: sizeOut,
        flavor: values.flavor,
        pictureBase64: values.picture,
        message: values.message,
        payment: "full",
        type: "rush B",
        pickupDate: "1970-01-01",
        pickupTime: "00:00 AM",
      });
    } catch (error) {}
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: {
      color: "",
      shape: "",
      quantity: 1,
      cover: "",
      description: "",
      sizeRound: "",
      sizeHeart: "",
      sizeRectangle: '12"x8"x2.5"',
      flavor: "",
      picture: "",
      message: "",
      agree: false,
      pickupDateTime: minDate,
    },
    validationSchema: customOrderSchema,
    onSubmit,
  });

  const handleAddTier = () => {
    if (tiers.length < 6) {
      setTiers((prev) => [...prev, ""]); // Add empty string to tiers
    }
  };

  const handleChangeTier = (index: number, value: string) => {
    setTiers((prev) => {
      const newTiers = [...prev];
      newTiers[index] = value; // Update tier at the specific index

      // Convert the updated `newTiers` array to a CSV string
      const csvString = newTiers.join(", ");

      // Use the CSV string for `setFieldValue`
      setFieldValue("sizeRound", csvString);
      return newTiers;
    });
  };

  const handleChangeRectangle = (dir: string, value: number) => {
    switch (dir) {
      case "x":
        setRectangleX(value);
        break;
      case "y":
        setRectangleY(value);
        break;
    }
    setFieldValue("sizeRectangle", `${rectangleX}\"x${rectangleY}\"x2.5"`);
  };

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
        return;
      }
      try {
        // Convert the file to base64 string (without header)
        const base64String = await convertImageToBase64(file);
        setFieldValue("picture", base64String);
      } catch (err) {
        console.error("File upload error:", err);
        alert("Failed to upload file. Please try again.");
      }
    }
  };

  return (
    <Container sx={{ pb: 10 }}>
      <form onSubmit={handleSubmit}>
        <Stack maxWidth="sm" spacing={2}>
          <FormControl fullWidth>
            <InputLabel id="select-shape-label">Select Shape</InputLabel>
            <Select
              labelId="select-shape"
              label="Select Shape"
              id="shape"
              name="shape"
              value={values.shape}
              onChange={handleChange}
            >
              <MenuItem value={"round"}>{"Round"}</MenuItem>
              <MenuItem value={"heart"}>{"Heart"}</MenuItem>
              <MenuItem value={"rectangle"}>{"Rectangle"}</MenuItem>
            </Select>
          </FormControl>
          {values.shape === "round" ? (
            <>
              <Typography variant="h4">{"Tiers"}</Typography>
              <List>
                {tiers.map((tier, index) => (
                  <ListItem key={`tier-${index}`}>
                    <FormControl fullWidth>
                      <InputLabel id={`tier-select-label-${index}`}>
                        Select Tier
                      </InputLabel>
                      <Select
                        labelId={`tier-select-label-${index}`}
                        label="Select Tier"
                        value={tier}
                        onChange={(e) =>
                          handleChangeTier(index, e.target.value)
                        }
                      >
                        {availableTiers.map((availableTier, i) => (
                          <MenuItem key={i} value={availableTier}>
                            {availableTier}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setTiers((prevTiers) =>
                          prevTiers.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                ))}
                {tiers.length < 6 ? (
                  <ListItem key="insertTier" onClick={handleAddTier}>
                    <IconButton>
                      <AddIcon />
                    </IconButton>
                    <ListItemText primary="Insert Tier" />
                  </ListItem>
                ) : null}
              </List>
            </>
          ) : null}
          {values.shape === "heart" ? (
            <FormControl fullWidth>
              <InputLabel id="select-size-label">Size</InputLabel>
              <Select
                labelId="select-size-label"
                label="Flavor"
                id="select-size"
                name="Size"
                value={values.sizeHeart}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.sizeHeart && Boolean(errors.sizeHeart)}
              >
                <MenuItem value={"7"}>{'7"'}</MenuItem>
                <MenuItem value={"9"}>{'9"'}</MenuItem>
              </Select>
            </FormControl>
          ) : null}
          {values.shape === "rectangle" ? (
            <>
              <Typography variant="h4">{"Size"}</Typography>
              <Typography variant="h5">{values.sizeRectangle}</Typography>
              <Slider
                value={rectangleX}
                onChange={(event, value) => handleChangeRectangle("x", value)}
                defaultValue={12}
                valueLabelDisplay="auto"
                shiftStep={5}
                step={1}
                marks
                min={9}
                max={16}
              />
              <Slider
                value={rectangleY}
                onChange={(event, value) => handleChangeRectangle("y", value)}
                defaultValue={12}
                valueLabelDisplay="auto"
                shiftStep={5}
                step={1}
                marks
                min={5}
                max={12}
              />
            </>
          ) : null}
          <TextField
            label="Color"
            id="color"
            name="color"
            value={values.color}
            onChange={handleChange}
          />
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
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<UploadIcon />}
          >
            {"Upload File"}
            <VisuallyHiddenInput type="file" onChange={handleFileUpload} />
          </Button>

          <Header title="Terms & Conditions" subtitle="Please READ!" />
          <Typography variant="h5">
            {"DEPOSITS, PAYMENTS, CANCELLATIONS"}
          </Typography>
          <Typography variant="body1">
            {
              "A deposit of 50% is required to consider this an order. The remaining balance is DUE five (5) business days prior to the pick-up date."
            }
          </Typography>
          <Typography variant="body1">
            {
              "*Any changes to this order must be made no later than five (5) business days prior to pick-up date. Any changes requested after confirmation of order cannot be guaranteed and may be subject to additional charges."
            }
          </Typography>
          <Typography variant="body1">
            {
              "All deposits are non-refundable. There will be no credit given for orders canceled inside of five (5) business days before the date of event."
            }
          </Typography>
          <Typography variant="body1">
            {
              "For cancellations with more than five (5) business days' notice, credit may be given for a future order, less the fair market value of items that cannot be re-used. This offer is subject to the date being available."
            }
          </Typography>
          <Typography variant="body1">
            {
              "If full payment is not received on the due date, the order may be canceled."
            }
          </Typography>
          <Typography variant="h5">{"DELIVERY TERMS"}</Typography>
          <Typography variant="body1">
            {"The pick-up time will be confirmed upon placing your order."}
          </Typography>
          <Typography variant="body1">
            {
              "The Client must disclose any adverse road hazards and/or obstacles that may hamper the delivery and quality of finished products. In the case of an unavoidable occurence, such as an act of God, a car accident, poor road conditions, or dropping of cake during delivery - out of The Pink Butter Cake Studio cannot be held liable for more than the price of the cake described in this order."
            }
          </Typography>
          <Typography variant="body1">
            {
              "The Client should provide the screenshot of LALAMOVE CAR or GRAB CAR for pick up."
            }
          </Typography>
          <Typography variant="body1">
            {"The Client should be the one to book their own pick-up."}
          </Typography>
          <Typography variant="h5">{"OUR GUARANTEE"}</Typography>
          <Typography variant="body1">
            {
              "The Pink Butter Cake Studio will provide a professionally decorated dessert in a timely manner as specified in the order form. We are honored that you have chosen us for your special celebration. We guarantee that the flavors, size and general design elements will be met as outlined. If you are not satisfied with our product(s) please let us know at the time you receive your order."
            }
          </Typography>
          <Typography variant="body1">
            {
              "Although we make every attempt to provide an exact design and to match colors, custom cakes are a work of art and hand-made, it may not be possible to match an exact shade of a color, or design but we will come as close as possible. The final product may be subject to slight variations."
            }
          </Typography>
          <Typography variant="body1">
            {
              "We do not offer discounts or refunds if the exact shade of a color or design is not achieved or if variation occurs. In the event that a major variation needs to be made, The Pink Butter will communicate this to the customer and seek re-design approval, 5 days before the event."
            }
          </Typography>
          <Typography variant="h5">{"DESIGN VARIATIONS"}</Typography>
          <FormControlLabel
            control={
              <Checkbox
                name="agree"
                value={values.agree}
                onChange={handleChange}
              />
            }
            label="I have read and agreed to the Terms and Conditions"
            required
          />
          <Button
            variant="contained"
            type="submit"
            onClick={() => {
              console.log(errors);
            }}
            disabled={!values.agree}
          >
            Submit
          </Button>
        </Stack>
      </form>
    </Container>
  );
};

export default Custom;
