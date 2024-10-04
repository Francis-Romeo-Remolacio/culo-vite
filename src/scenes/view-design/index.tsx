// src/scenes/ViewDesign.jsx

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Typography,
  CircularProgress,
  Container,
  Stack,
  Button,
  Grid2 as Grid,
  FormControl,
  TextField,
  Skeleton,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  List,
  ListItem,
  Checkbox,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Paper,
  useTheme,
} from "@mui/material";

import api from "../../api/axiosConfig.js";
import { Helmet } from "react-helmet-async";
import TagChip from "../../components/TagChip.js";
import Cookies from "js-cookie";
import { useFormik } from "formik";
import { cartSchema } from "../../utils/Validation.ts";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import {
  Add as IncreaseIcon,
  Remove as DecreaseIcon,
} from "@mui/icons-material";
import {
  AddOn,
  Design,
  DesignVariant,
  VariantAddOn,
} from "../../utils/Schemas.ts";
import { Tokens } from "../../Theme.ts";

type OrderAddOn = {
  id: number;
  quantity: number;
};

const ViewDesign = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const designId = query.get("q") || undefined;

  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);

  const navigate = useNavigate();

  const [design, setDesign] = useState<Design>();
  const [imageType, setImageType] = useState("");
  const [picture, setPicture] = useState<Blob>();
  const [stockStatus, setStockStatus] = useState(false);
  const availableFlavors = [
    "Dark Chocolate",
    "Funfetti (vanilla with sprinkles)",
    "Vanilla Caramel",
    "Mocha",
    "Red Velvet",
    "Banana",
  ];
  const [openAddOn, setOpenAddOn] = useState(false);
  const [openSucc, setOpenSucc] = useState(false);
  const [openFail, setOpenFail] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<DesignVariant>();
  const [availableAddOns, setAvailableAddOns] = useState<AddOn[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<OrderAddOn[]>([]);
  const [userAddOns, setUserAddOns] = useState<OrderAddOn[]>([]);
  const [selectedOption, setSelectedOption] = useState<AddOn>();
  const [loggedIn, setLoggedIn] = useState(false);

  function gotoLogin() {
    const fullPath = location.pathname + location.search;
    navigate(`/login?from=${encodeURIComponent(fullPath)}`);
  }

  const onSubmit = async () => {
    if (loggedIn) {
      try {
        const finalAddOns = [...selectedAddOns, ...userAddOns];

        const cartResponse = await api.post("current-user/cart", {
          quantity: values.quantity,
          designId: design?.id,
          description: `Dedication: ${values.dedication}\nRequests:${values.requests}`,
          flavor: values.flavor,
          size: values.size,
          addonItem: finalAddOns,
          color:
            values.color === "custom"
              ? `Custom: ${values.customColor}`
              : values.color,
        });
        if (cartResponse.status === 200) {
          console.log("Cart item added successfully");
        }

        setOpenSucc(true);
      } catch (error) {
        console.error("There was an error adding the order:", error);
        setOpenFail(true);
      }
    } else {
      gotoLogin();
    }
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: {
      quantity: 1,
      dedication: "",
      requests: "",
      flavor: "",
      size: "",
      color: "default",
      customColor: "",
    },
    validationSchema: cartSchema,
    onSubmit,
  });

  const handleChangeQuantity = (method: string) => {
    switch (method) {
      case "decrement":
        if (values.quantity > 1) {
          const newValue = values.quantity - 1;
          setFieldValue("quantity", newValue);
        }
        break;
      case "increment":
        if (values.quantity < 10) {
          const newValue = values.quantity + 1;
          setFieldValue("quantity", newValue);
        }
        break;
    }
  };

  const handleOpenAddOn = () => {
    setOpenAddOn(true);
  };

  const handleCloseAddOn = () => {
    setOpenAddOn(false);
  };

  const handleToggleAddOn = (newAddOnId: number, list: string) => {
    if (list === "variant") {
      console.log(`Before: ${selectedAddOns}`);
      setSelectedAddOns((prevSelected: OrderAddOn[]) => {
        const existingAddOn = prevSelected.find(
          (existing) => existing.id === newAddOnId
        );

        if (existingAddOn) {
          // Remove if already selected
          return prevSelected.filter((existing) => existing.id !== newAddOnId);
        } else {
          // Retrieve the previous quantity if it exists, otherwise default to 1
          const lastQuantity =
            prevSelected.find((existing) => existing.id === newAddOnId)
              ?.quantity || 1;
          return [...prevSelected, { id: newAddOnId, quantity: lastQuantity }];
        }
      });
      console.log(`After: ${selectedAddOns}`);
    } else if (list === "custom") {
      console.log(`Before: ${userAddOns}`);
      setUserAddOns((prevSelected: OrderAddOn[]) => {
        const existingAddOn = prevSelected.find(
          (existing) => existing.id === newAddOnId
        );

        if (existingAddOn) {
          // Remove if already selected
          return prevSelected.filter((existing) => existing.id !== newAddOnId);
        } else {
          // Retrieve the previous quantity if it exists, otherwise default to 1
          const lastQuantity =
            prevSelected.find((existing) => existing.id === newAddOnId)
              ?.quantity || 1;
          return [...prevSelected, { id: newAddOnId, quantity: lastQuantity }];
        }
      });
      console.log(`After: ${userAddOns}`);
    }
  };

  const handleChangeAddOnQuantity = (id: number, quantity: number) => {
    const parsedQuantity = Math.max(1, Math.min(5, Number(quantity))); // Clamp between 1 and 5
    setSelectedAddOns((prevSelected) =>
      prevSelected.map((addOn) =>
        addOn.id === id ? { ...addOn, quantity: parsedQuantity } : addOn
      )
    );
  };

  const handleInsertAddOn = () => {
    if (selectedOption) {
      const existingAddOn = userAddOns.find(
        (item) => item.id === selectedOption.id
      );
      if (!existingAddOn) {
        setUserAddOns([...userAddOns, { id: selectedOption.id, quantity: 1 }]);
      }
    }
    handleCloseAddOn();
  };

  const fetchAddOns = async (variant: DesignVariant) => {
    try {
      await api.get("add-ons").then((response) => {
        const parsedAddOns: AddOn[] = response.data.map((addOn: any) => ({
          id: addOn.addOnsId,
          name: addOn.addOnName,
          measurement: addOn.measurement,
          price: addOn.pricePerUnit,
          size: addOn.size,
        }));
        const filteredAddOns = parsedAddOns.filter(
          (addOn: AddOn) =>
            !variant.addOns.some(
              (variantAddOn: VariantAddOn) => variantAddOn.id === addOn.id
            )
        );
        setAvailableAddOns(filteredAddOns);
      });
    } catch (error) {
      console.error("Failed to fetch add-ons: ", error);
    }
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = Cookies.get("token");
      if (token) {
        try {
          const response = await api.get("current-user");
          if (response.status === 200) {
            setLoggedIn(true);
          }
        } catch (error) {
          console.error("Token validation error:", error);
        }
      }
    };
    checkLoggedIn();
  }, []);

  useEffect(() => {
    const fetchDesignData = async () => {
      if (designId) {
        try {
          // Fetch both the design data and design info simultaneously
          const [designDataResponse, designInfoResponse] = await Promise.all([
            api.get(`designs/${encodeURIComponent(designId)}`),
            api.get(
              `ui-helpers/get-design-info/${encodeURIComponent(designId)}`
            ),
          ]);

          // Parse the design data
          const parsedDesignData = {
            id: designDataResponse.data.designId,
            name: designDataResponse.data.displayName,
            description: designDataResponse.data.cakeDescription,
            pictureUrl: designDataResponse.data.designPictureUrl,
            pictureData: designDataResponse.data.displayPictureData,
            tags: designDataResponse.data.designTags.map((tag: any) => ({
              id: tag.designTagId,
              name: tag.designTagName,
            })),
            shapes: designDataResponse.data.designShapes.map((shape: any) => ({
              id: shape.designShapeId,
              name: shape.shapeName,
            })),
          };

          // Parse the design info
          const parsedDesignInfo = {
            pastryMaterialId: designInfoResponse.data.pastryMaterialId,
            variants: designInfoResponse.data.variants.map((variant: any) => ({
              id: variant.variantId,
              name: variant.variantName,
              cost: variant.costEstimate,
              inStock: variant.inStock,
              addOns: variant.addOns.map((addOn: any) => ({
                id: addOn.addOnId,
                name: addOn.addOnName,
                price: addOn.price,
                amount: addOn.amount,
                stock: addOn.stock,
              })),
            })),
          };

          // Merge the design data and design info into a single object
          const combinedDesignData = {
            ...parsedDesignData,
            ...parsedDesignInfo,
          };
          setDesign(combinedDesignData as Design);

          // Set picture data
          setPicture(parsedDesignData.pictureData);
        } catch (error) {
          console.error("Error fetching design data or design info: ", error);
        }
      } else {
        navigate("/not-found");
      }
    };

    fetchDesignData();
  }, [designId]);

  // Function to get the image type by reading the base64 header
  const getImageType = (data: Blob) => {
    const firstChar = data.text.toString().charAt(0);
    switch (firstChar) {
      case "/":
        return "jpeg";
      case "i":
        return "png";
      default:
        throw new Error("Unknown image type.");
    }
  };

  useEffect(() => {
    if (picture) {
      const determineImageType = async () => {
        try {
          if (picture) {
            const type = getImageType(picture);
            setImageType(type);
          }
        } catch (err) {
          console.error("Error determining image type:", err);
        }
      };
      determineImageType();
    }
  }, [picture]);

  useEffect(() => {
    if (values.size) {
      const variant = design?.variants.find(
        (variant) => variant.name === values.size
      );
      setSelectedVariant(variant);
      if (variant) {
        setSelectedAddOns(
          variant.addOns.map((addOn: VariantAddOn) => ({
            id: addOn.id,
            quantity: addOn.amount,
          }))
        );
        setStockStatus(variant.inStock);
        fetchAddOns(variant);
      }
    }
  }, [values.size]);

  const ceilThenFormat = (num: number) => {
    if (num) {
      const rounded = Math.ceil(num / 100) * 100;
      const formatted = new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
      }).format(rounded);
      return formatted;
    }
  };

  return (
    <Container sx={{ maxWidth: "600px" }}>
      <Helmet>
        <title>{`${design?.name} - The Pink Butter Cake Studio`}</title>
      </Helmet>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          {picture ? (
            <img
              src={`data:image/${imageType};base64,${picture}`}
              alt={design?.name}
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: "8px",
              }}
            />
          ) : (
            <Skeleton variant="rounded" height={400} />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={2} width="100%" height="100%">
            <Typography variant="subtitle1">
              Pink Butter Cake Studio Original Design
            </Typography>
            {design?.name ? (
              <Typography variant="h1" gutterBottom>
                {design?.name}
              </Typography>
            ) : (
              <Skeleton variant="rectangular" width={160} height={40} />
            )}
            {design ? (
              <Typography variant="h3">
                {ceilThenFormat(
                  values.size
                    ? design?.variants.find(
                        (variant) => variant.name === values.size
                      )?.cost ?? 0
                    : design?.variants[0]?.cost ?? 0
                )}
              </Typography>
            ) : (
              <Skeleton variant="text" width={120} sx={{ fontSize: 24 }} />
            )}
            <Typography variant="body1">
              {stockStatus ? (
                <>
                  {"Availability: "}
                  <span color={stockStatus ? "success" : "error"}>
                    {stockStatus ? "In Stock" : "Out of Stock"}
                  </span>
                </>
              ) : (
                <>{"Select size to check stock"}</>
              )}
            </Typography>
            <Stack direction="row" spacing={1}>
              {design ? (
                design?.tags.map((tag) => <TagChip key={tag.id} id={tag.id} />)
              ) : (
                <Skeleton variant="circular" height={32} />
              )}
            </Stack>
            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <FormControl fullWidth>
                  <InputLabel id="select-size-label">Size</InputLabel>
                  <Select
                    labelId="select-size-label"
                    id="select-size"
                    name="size"
                    value={values.size}
                    label="Size"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.size && Boolean(errors.size)}
                  >
                    {design?.variants.map((variant) => (
                      <MenuItem key={variant.name} value={variant.name}>
                        {variant.name}
                      </MenuItem>
                    ))}
                  </Select>
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
                  >
                    {availableFlavors.map((flavor) => (
                      <MenuItem key={flavor} value={flavor}>
                        {flavor}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Stack direction="row" spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel id="select-color-label">Color</InputLabel>
                    <Select
                      labelId="select-color-label"
                      id="select-color"
                      name="color"
                      value={values.color}
                      label="Color"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.color && Boolean(errors.color)}
                    >
                      <MenuItem key="default" value="default">
                        Default
                      </MenuItem>
                      <MenuItem key="custom" value="custom">
                        Custom
                      </MenuItem>
                    </Select>
                  </FormControl>
                  {values.color === "custom" ? (
                    <TextField
                      label="Custom Color"
                      name="customColor"
                      value={values.customColor}
                      onChange={handleChange}
                      fullWidth
                    />
                  ) : (
                    <></>
                  )}
                </Stack>
                <Stack direction="row">
                  <IconButton onClick={() => handleChangeQuantity("decrement")}>
                    <DecreaseIcon />
                  </IconButton>
                  <TextField
                    label="Quantity"
                    id="quantity"
                    name="quantity"
                    value={values.quantity}
                    slotProps={{
                      htmlInput: { type: "number", min: 1, max: 10 },
                    }}
                  />
                  <IconButton onClick={() => handleChangeQuantity("increment")}>
                    <IncreaseIcon />
                  </IconButton>
                </Stack>
                <TextField
                  label="Dedication / Message"
                  id="field-dedication"
                  name="dedication"
                  value={values.dedication}
                  onChange={handleChange}
                  multiline
                  rows={4}
                />
                <TextField
                  label="Requests / Notes"
                  id="field-requests"
                  name="requests"
                  value={values.requests}
                  onChange={handleChange}
                  multiline
                  rows={4}
                />
                {values.size && selectedVariant ? (
                  <div>
                    <Typography variant="body1">
                      {`Size ${values.size} includes:`}
                    </Typography>
                    <List dense>
                      {selectedVariant.addOns.map((addOn) => (
                        <ListItem
                          key={addOn.id}
                          onClick={() => handleToggleAddOn(addOn.id, "variant")}
                          secondaryAction={
                            <Paper>
                              <TextField
                                inputProps={{
                                  type: "number",
                                  min: 1,
                                  max: 5,
                                }}
                                label="Quantity"
                                id={`quantity-${addOn.id}`}
                                name={`quantity-${addOn.id}`}
                                value={
                                  selectedAddOns.find(
                                    (existing) => existing.id === addOn.id
                                  )?.quantity ?? 1
                                }
                                onChange={(e) =>
                                  handleChangeAddOnQuantity(
                                    addOn.id,
                                    Number(e.target.value)
                                  )
                                }
                                size="small"
                              />
                            </Paper>
                          }
                        >
                          <Checkbox
                            edge="start"
                            checked={
                              !!selectedAddOns.find(
                                (existing) => existing.id === addOn.id
                              )
                            }
                            tabIndex={-1}
                            disableRipple
                          />
                          <ListItemText
                            primary={addOn.name}
                            secondary={`₱${addOn.price}`}
                          />
                        </ListItem>
                      ))}
                    </List>

                    <Typography variant="body1" style={{ marginTop: 16 }}>
                      {"Your add-ons:"}
                    </Typography>
                    <List dense>
                      {userAddOns.map((userAddOn) => (
                        <ListItem
                          key={userAddOn.id}
                          onClick={() =>
                            handleToggleAddOn(userAddOn.id, "custom")
                          }
                          secondaryAction={
                            <TextField
                              inputProps={{
                                type: "number",
                                min: 1,
                                max: 5,
                              }}
                              label="Quantity"
                              id={`quantity-${userAddOn.id}`}
                              name={`quantity-${userAddOn.id}`}
                              value={
                                userAddOns.find(
                                  (item) => item.id === userAddOn.id
                                )?.quantity || 1
                              }
                              onChange={(e) =>
                                handleChangeAddOnQuantity(
                                  userAddOn.id,
                                  Number(e.target.value)
                                )
                              }
                              size="small"
                            />
                          }
                        >
                          <Checkbox
                            edge="start"
                            checked={
                              !!userAddOns.find(
                                (item) => item.id === userAddOn.id
                              )
                            }
                            tabIndex={-1}
                            disableRipple
                          />
                          <ListItemText
                            primary={
                              availableAddOns.find(
                                (item) => item.id === userAddOn.id
                              )?.name
                            }
                            secondary={`₱${
                              availableAddOns.find(
                                (item) => item.id === userAddOn.id
                              )?.price
                            }`}
                          />
                        </ListItem>
                      ))}
                      <ListItem
                        key="insert_add_on"
                        onClick={() => handleOpenAddOn()}
                      >
                        <IconButton>
                          <IncreaseIcon />
                        </IconButton>
                        <ListItemText primary="Insert Add-On" />
                      </ListItem>
                      <Dialog open={openAddOn} onClose={handleCloseAddOn}>
                        <DialogTitle>Insert Add-On</DialogTitle>
                        <DialogContent>
                          <Autocomplete
                            id="autocomplete-add-on"
                            options={availableAddOns}
                            getOptionLabel={(option) => option.name}
                            onChange={(event, newValue) => {
                              if (newValue) {
                                setSelectedOption(newValue);
                              }
                            }}
                            sx={{ width: 300, pt: 1 }}
                            renderInput={(params) => (
                              <TextField {...params} label="Add-On" />
                            )}
                          />
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleCloseAddOn}>Cancel</Button>
                          <Button
                            onClick={handleInsertAddOn}
                            variant="contained"
                          >
                            Insert
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </List>
                  </div>
                ) : (
                  ""
                )}
                <Stack direction="row" spacing={2}>
                  <Button
                    color="primary"
                    variant="outlined"
                    fullWidth
                    type="submit"
                    startIcon={!isSubmitting ? <AddShoppingCartIcon /> : ""}
                    onClick={() => {
                      console.log(errors);
                      if (!loggedIn) {
                        gotoLogin();
                      }
                    }}
                    disabled={isSubmitting}
                  >
                    {!isSubmitting ? (
                      "Add to Cart"
                    ) : (
                      <CircularProgress size={21} />
                    )}
                  </Button>
                  <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    startIcon={!isSubmitting ? <PointOfSaleIcon /> : ""}
                    disabled={isSubmitting}
                    sx={{ color: colors.background }}
                  >
                    {!isSubmitting ? "Buy Now" : <CircularProgress size={21} />}
                  </Button>
                </Stack>
              </Stack>
            </form>
            <ul>
              <li>Available for Pick-up</li>
              <li>Available for Delivery</li>
            </ul>
            <Typography variant="body1">{design?.description}</Typography>
          </Stack>
        </Grid>
      </Grid>
      <Snackbar
        open={openSucc}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success">Successfully added to cart!</Alert>
      </Snackbar>
      <Snackbar
        open={openFail}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error">Failed to add to cart!</Alert>
      </Snackbar>
    </Container>
  );
};

export default ViewDesign;
