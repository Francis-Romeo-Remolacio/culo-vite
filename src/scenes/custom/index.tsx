import {
  Box,
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
import { useAlert } from "../../components/CuloAlert.js";
import TermsDialog from "../../components/TermsDialog.js";
import { MuiColorInput } from "mui-color-input";

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
  const { makeAlert } = useAlert();

  const [tiers, setTiers] = useState<string[]>([]);
  const [sizeHeart, setSizeHeart] = useState<number>(8);
  const [rectangleX, setRectangleX] = useState(12);
  const [rectangleY, setRectangleY] = useState(8);
  const minDate = dayjs().add(7, "day");

  const [imageType, setImageType] = useState("");

  const [open, setOpen] = useState(false);
  const onClose = () => {
    setOpen(false);
  };

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
        tier: tiers.length ? tiers.length : "",
        quantity: 1,
        cover: values.cover,
        description: values.description,
        size: sizeOut,
        flavor: values.flavor,
        pictureBase64: values.picture,
        message: values.message,
      });
      makeAlert(
        "success",
        "Order successfully placed. You can view it in your cart."
      );
    } catch (error) {
      console.error(error);
      makeAlert("error", "Error placing order, please try again.");
    }
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

  const handleChangeHeart = (event: Event, value: number | number[]) => {
    setSizeHeart(value as number);
    setFieldValue("mainVariantName", String(value));
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
      setImageType(file.type);
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
    <Container
      maxWidth="sm"
      sx={{
        pt: 3,
      }}
    >
      <Header title="Custom Order Form" />
      <Box
        sx={{
          display: "inline-block",
          "& form": {
            display: "flex",
          },
        }}
      >
        <form onSubmit={handleSubmit}>
          <Stack maxWidth="sm" spacing={2} sx={{ mt: 2 }}>
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
              <>
                <Typography variant="h4">{`Size: ${sizeHeart}"`}</Typography>
                <Slider
                  id="sizeHeart"
                  name="sizeHeart"
                  value={sizeHeart}
                  onChange={handleChangeHeart}
                  defaultValue={8}
                  valueLabelDisplay="auto"
                  shiftStep={5}
                  step={1}
                  marks
                  min={6}
                  max={10}
                />
              </>
            ) : null}
            {values.shape === "rectangle" ? (
              <>
                <Typography variant="h4">{`Size: ${rectangleX}\"x${rectangleY}\"x2.5"`}</Typography>
                <Slider
                  value={rectangleX}
                  onChange={(event, value) =>
                    handleChangeRectangle("x", value as number)
                  }
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
                  onChange={(event, value) =>
                    handleChangeRectangle("y", value as number)
                  }
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
            <MuiColorInput
              format="rgb"
              label="Color"
              id="color"
              name="color"
              value={values.color}
              onChange={(value) => setFieldValue("color", value)}
              isAlphaHidden
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
            {values.picture ? (
              <img src={`data:${imageType};base64,${values.picture}`} />
            ) : null}
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<UploadIcon />}
            >
              {"Upload File"}
              <VisuallyHiddenInput
                type="file"
                onChange={handleFileUpload}
                accept="image/*"
              />
            </Button>
            <TermsDialog
              open={open}
              onClose={onClose}
              agree={values.agree}
              handleChange={handleChange}
            />
            <Button
              variant="contained"
              type="submit"
              onClick={(e) => {
                e.preventDefault();

                if (Object.keys(errors).length > 0) {
                  // Check if there are any errors
                  if (errors.agree) {
                    setOpen(true); // Open modal if `errors.agree` exists
                  } else {
                    makeAlert(
                      "error",
                      Object.entries(errors)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(", ")
                    );
                  }
                } else {
                  handleSubmit(); // Submit the form if no errors
                }
              }}
            >
              Submit
            </Button>
          </Stack>
        </form>
      </Box>
    </Container>
  );
};

export default Custom;
