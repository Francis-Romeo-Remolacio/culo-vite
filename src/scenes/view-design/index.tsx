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
} from "@mui/material";

import api from "../../api/axiosConfig.js";
import { Helmet } from "react-helmet-async";
import TagChip from "../../components/TagChip.js";
import Cookies from "js-cookie";
import { useFormik } from "formik";
import { cartSchema } from "../../utils/Validation.ts";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { Add as IncreaseIcon } from "@mui/icons-material";
import {
  AddOn,
  Design,
  DesignVariant,
  OrderAddOn,
  VariantAddOn,
} from "../../utils/Schemas.ts";
import { getImageType } from "../../components/Base64Image.tsx";
import NumberCounter from "../../components/NumberCounter.tsx";
import ButtonCheckout from "../../components/ButtonCheckout.tsx";

const ViewDesign = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const designId = query.get("q") || undefined;

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
  const [openSnack, setOpenSnack] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedVariant, setSelectedVariant] = useState<DesignVariant>();
  const [availableAddOns, setAvailableAddOns] = useState<AddOn[]>([]);
  const [filteredAddOns, setFilteredAddOns] = useState<AddOn[]>([]);
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
        const cartResponse = await api.post("current-user/cart", {
          quantity: values.quantity,
          designId: design?.id,
          description: `Dedication: ${values.dedication}\nRequests:${values.requests}`,
          flavor: values.flavor,
          size: values.size,
          addonItem: [...selectedAddOns, ...userAddOns],
          color:
            values.color === "custom"
              ? `Custom: ${values.customColor}`
              : values.color,
        });
        if (cartResponse.status === 200) {
          console.log("Cart item added successfully");
        }

        handleAlert("success", "Successfully added to cart!");
      } catch (error) {
        console.error("There was an error adding the order:", error);
        handleAlert("error", "Failed to add to cart!");
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

  const handleToggleAddOn = (
    newAddOnId: number,
    list: "variant" | "custom"
  ) => {
    let addOnsList;
    let setAddOnsList: any;
    switch (list) {
      case "variant":
        addOnsList = selectedAddOns;
        setAddOnsList = setSelectedAddOns;
        break;
      case "custom":
        addOnsList = userAddOns;
        setAddOnsList = setUserAddOns;
        break;
    }
    if (addOnsList && setAddOnsList) {
      setAddOnsList((prevSelected: OrderAddOn[]) => {
        const existingAddOn = prevSelected.find(
          (existing) => existing.id === newAddOnId
        );

        if (existingAddOn) {
          // Remove the add-on but keep its quantity for future toggles
          return prevSelected
            .map((addOn) =>
              addOn.id === newAddOnId
                ? { ...addOn, quantity: addOn.quantity }
                : addOn
            )
            .filter((existing) => existing.id !== newAddOnId);
        } else {
          // Keep the quantity of the add-on if previously removed
          const lastQuantity =
            prevSelected.find((existing) => existing.id === newAddOnId)
              ?.quantity || 1;
          return [
            ...prevSelected,
            { id: newAddOnId, name: "", price: 0, quantity: lastQuantity },
          ];
        }
      });
    }
  };

  const handleChangeAddOnQuantity = (
    id: number,
    newQuantity: number,
    list: "variant" | "custom"
  ) => {
    let addOnsList;
    let setAddOnsList: any;

    switch (list) {
      case "variant":
        addOnsList = selectedAddOns;
        setAddOnsList = setSelectedAddOns;
        break;
      case "custom":
        addOnsList = userAddOns;
        setAddOnsList = setUserAddOns;
        break;
    }

    if (addOnsList && setAddOnsList) {
      setAddOnsList((prevSelected: any) =>
        prevSelected.map((addOn: any) =>
          addOn.id === id
            ? {
                ...addOn,
                quantity: Math.min(
                  Math.max(addOn.quantity + newQuantity, 1),
                  10
                ),
              }
            : addOn
        )
      );
    }
  };

  const handleInsertAddOn = () => {
    if (selectedOption) {
      const existingAddOn = userAddOns.find(
        (item) => item.id === selectedOption.id
      );
      if (!existingAddOn) {
        // Add `quantity: 1` to the selectedOption
        setUserAddOns([...userAddOns, { ...selectedOption, quantity: 1 }]);
      }
    }
    handleCloseAddOn();
  };

  const handleAlert = (type: string, message: string) => {
    setAlertType(type);
    setAlertMessage(message);
    setOpenSnack(true);
  };

  const fetchAddOns = async (variant: DesignVariant) => {
    try {
      await api.get("add-ons").then((response) => {
        const parsedAddOns: AddOn[] = response.data.map((addOn: any) => ({
          id: addOn.id,
          name: addOn.addOnName,
          measurement: addOn.measurement,
          price: addOn.price,
          size: addOn.size,
        }));
        setAvailableAddOns(parsedAddOns);
        filterAddOns();
      });
    } catch (error) {
      console.error("Failed to fetch add-ons: ", error);
    }
  };

  const filterAddOns = () => {
    if (selectedVariant) {
      // First filter to remove add-ons already in the `variant.addOns`
      let filteredAddOns = availableAddOns.filter(
        (addOn: AddOn) =>
          !selectedVariant.addOns.some(
            (variantAddOn: AddOn) => variantAddOn.id === addOn.id
          )
      );

      // Further filter to remove add-ons already in `userAddOns`
      filteredAddOns = filteredAddOns.filter(
        (addOn: AddOn) =>
          !userAddOns.some((userAddOn: AddOn) => userAddOn.id === addOn.id)
      );
      setFilteredAddOns(filteredAddOns);
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

  useEffect(() => {
    if (picture) {
      const determineImageType = async () => {
        try {
          if (picture) {
            const type = getImageType(String(picture));
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
            name: addOn.name,
            price: addOn.price,
            quantity: addOn.amount,
          }))
        );
        setStockStatus(variant.inStock);
        fetchAddOns(variant);
      }
    }
  }, [values.size]);

  useEffect(() => {
    if (values.size && selectedVariant) {
      filterAddOns();
    }
  }, [availableAddOns, userAddOns]);

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
                  ) : null}
                </Stack>
                <NumberCounter
                  value={values.quantity}
                  handleChange={handleChangeQuantity}
                ></NumberCounter>
                <TextField
                  label="Dedication / Message"
                  id="field-dedication"
                  name="dedication"
                  value={values.dedication}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  inputProps={{ maxLength: 50 }}
                  helperText="Maximum 50 characters"
                />
                <TextField
                  label="Requests / Notes"
                  id="field-requests"
                  name="requests"
                  value={values.requests}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  inputProps={{ maxLength: 50 }}
                  helperText="Maximum 50 characters"
                />
                {values.size && selectedVariant ? (
                  <div>
                    <Typography variant="body1">
                      {`Size ${values.size} includes:`}
                    </Typography>
                    <List dense>
                      {selectedVariant.addOns.map((addOn) => (
                        <ListItem key={addOn.id}>
                          <Checkbox
                            edge="start"
                            checked={
                              !!selectedAddOns.find(
                                (existing) => existing.id === addOn.id
                              )
                            }
                            onClick={() =>
                              handleToggleAddOn(addOn.id, "variant")
                            }
                            tabIndex={-1}
                            disableRipple
                          />
                          <ListItemText
                            primary={addOn.name}
                            secondary={`₱${addOn.price}`}
                          />
                          <NumberCounter
                            value={
                              selectedAddOns.find(
                                (existing) => existing.id === addOn.id
                              )?.quantity ?? 1 // Default to 1 if not found
                            }
                            handleChange={(method) => {
                              if (method === "increment") {
                                handleChangeAddOnQuantity(
                                  addOn.id,
                                  1,
                                  "variant"
                                ); // Increment by 1
                              } else {
                                handleChangeAddOnQuantity(
                                  addOn.id,
                                  -1,
                                  "variant"
                                ); // Decrement by 1
                              }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>

                    <Typography variant="body1" style={{ marginTop: 16 }}>
                      {"Your add-ons:"}
                    </Typography>
                    <List dense>
                      {userAddOns.map((addOn) => (
                        <ListItem
                          key={addOn.id}
                          secondaryAction={
                            <NumberCounter
                              value={
                                userAddOns.find(
                                  (existing) => existing.id === addOn.id
                                )?.quantity ?? 1 // Default to 1 if not found
                              }
                              handleChange={(method) => {
                                if (method === "increment") {
                                  handleChangeAddOnQuantity(
                                    addOn.id,
                                    1,
                                    "custom"
                                  ); // Increment by 1
                                } else {
                                  handleChangeAddOnQuantity(
                                    addOn.id,
                                    -1,
                                    "custom"
                                  ); // Decrement by 1
                                }
                              }}
                            />
                          }
                        >
                          <Checkbox
                            edge="start"
                            checked={
                              !!userAddOns.find((item) => item.id === addOn.id)
                            }
                            onClick={() =>
                              handleToggleAddOn(addOn.id, "custom")
                            }
                            tabIndex={-1}
                            disableRipple
                          />
                          <ListItemText
                            primary={
                              availableAddOns.find(
                                (item) => item.id === addOn.id
                              )?.name
                            }
                            secondary={`₱${
                              availableAddOns.find(
                                (item) => item.id === addOn.id
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
                            options={filteredAddOns}
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
                  {!isSubmitting ? (
                    <ButtonCheckout
                      suborders={[
                        {
                          quantity: values.quantity,
                          designId: design?.id,
                          description: `Dedication: ${values.dedication}\nRequests:${values.requests}`,
                          flavor: values.flavor,
                          size: values.size,
                          addonItem: [...selectedAddOns, ...userAddOns],
                          color:
                            values.color === "custom"
                              ? `Custom: ${values.customColor}`
                              : values.color,
                        },
                      ]}
                      buyNowAddOns={[...selectedAddOns, ...userAddOns]}
                      buyNowDesignName={design?.name}
                    />
                  ) : (
                    <CircularProgress size={21} />
                  )}
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
        open={openSnack}
        autoHideDuration={2500}
        onClose={() => {
          setOpenSnack(false);
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={alertType}>{alertMessage}</Alert>
      </Snackbar>
    </Container>
  );
};

export default ViewDesign;
