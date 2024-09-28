// src/scenes/ViewDesign.jsx

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Typography,
  CircularProgress,
  Container,
  Stack,
  Button,
  Grid,
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
} from "@mui/material";
import api from "../../api/axiosConfig.js";
import { Helmet } from "react-helmet-async";
import TagChip from "../../components/TagChip.jsx";
import Cookies from "js-cookie";
import { useFormik } from "formik";
import { cartSchema } from "./../../utils/Validation.ts";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import { Add } from "@mui/icons-material";
import {
  AddOn,
  Design,
  DesignVariant,
  VariantAddOn,
} from "../../utils/Schemas.ts";

type OrderAddOn = {
  id: number;
  quantity: number;
};

const ViewDesign = () => {
  const [designId, setDesignId] = useState("");
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const idFromURI = query.get("q");
  if (idFromURI) {
    setDesignId(idFromURI);
  }

  const navigate = useNavigate();

  const [design, setDesignData] = useState<Design>();
  const [loading, setLoading] = useState(true);
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
        // Add the main order
        const cartResponse = await api.post("current-user/cart", {
          quantity: values.quantity,
          designId: design?.id,
          description: `Dedication: ${values.dedication}\nRequests:${values.requests}`,
          flavor: values.flavor,
          size: values.size,
          color:
            values.color === "custom"
              ? `Custom: ${values.customColor}`
              : values.color,
        });
        if (cartResponse.status === 200) {
          console.log("Cart item added successfully");
        }

        // Get the suborderId from the response
        console.log(cartResponse.data[0].suborderId);

        const suborderId = cartResponse.data[0].suborderId;

        // Add new add-ons to the order
        const [finalAddOns, setFinalAddOns] = useState<OrderAddOn[]>();

        setFinalAddOns(selectedAddOns);

        // Add user add-ons
        userAddOns.forEach((addOn) => {
          finalAddOns?.push(addOn);
        });

        // Show success message
        setOpenSucc(true);

        await api.put(
          `orders/current-user/${suborderId}/manage-add-ons`,
          finalAddOns
        );
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
      const [parsedDesign, setParsedDesign] = useState<Partial<Design>>();
      try {
        await api
          .get(`designs/${encodeURIComponent(designId)}`)
          .then((response) => {
            const design = response.data;
            const parsedData: Partial<Design> = {
              id: design.designId,
              name: design.displayName,
              description: design.cakeDescription,
              pictureUrl: design.designPictureUrl,
              pictureData: design.displayPictureData,
              tags: design.designTags.map((tag: any) => ({
                id: tag.designTagId,
                name: tag.designTagName,
              })),
              shapes: design.designShapes.map((shape: any) => ({
                id: shape.designShapeId,
                name: shape.shapeName,
              })),
            };
            setParsedDesign(parsedData);
          });
      } catch (error) {
        console.error("Error fetching design data: ", error);
      }
      try {
        const response = await api
          .get(`ui-helpers/get-design-info/${encodeURIComponent(designId)}`)
          .then((response) => {
            const design = response.data;
            const parsedInfo: Partial<Design> = {
              pastryMaterialId: design.pastryMaterialId,
              variants: design.variants.map((variant: any) => ({
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
            setParsedDesign(parsedInfo);
          });
      } catch (error) {
        console.error("Error fetching design info: ", error);
      }
      setDesignData(parsedDesign as Design);
      try {
        setPicture(design?.pictureData);
      } catch (err) {
        console.error("Error setting picture: ", err);
      }
      setLoading(false);
    };

    if (designId) {
      fetchDesignData();
    } else {
      navigate("/not-found");
    }
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
          const type = getImageType(picture);
          setImageType(type);
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

  if (loading) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        width="100%"
        minHeight="90vh"
      >
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
    );
  }

  return (
    <Container sx={{ maxWidth: "600px" }}>
      <Helmet>
        <title>{design?.name} - The Pink Butter Cake Studio</title>
      </Helmet>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
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
              <Skeleton variant="rounded" />
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={2} width="100%" height="100%">
              <Typography variant="subtitle1">
                Pink Butter Cake Studio Original Design
              </Typography>
              <Typography variant="h1" gutterBottom>
                {design?.name}
              </Typography>
              <Typography variant="h3">
                {ceilThenFormat(
                  values.size
                    ? design?.variants.find(
                        (variant) => variant.name === values.size
                      )?.costEstimate ?? 0
                    : design?.variants[0]?.costEstimate ?? 0
                )}
              </Typography>
              {/*
            <Stack direction="row" spacing={1}>
              <Rating name="read-only" value={rating} readOnly />{" "}
              {rating.toFixed(1)}
            </Stack>
            */}
              <Typography variant="body1">
                {stockStatus ? (
                  <>
                    Availability:{" "}
                    <span color={stockStatus ? "success" : "error"}>
                      {" "}
                      {stockStatus ? "In Stock" : "Out of Stock"}
                    </span>
                  </>
                ) : (
                  <></>
                )}
              </Typography>
              <Stack direction="row" spacing={1}>
                {design?.tags.map((tag) => (
                  <TagChip key={tag.id} id={tag.id} />
                ))}
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
                  <TextField
                    inputProps={{ type: "number", min: 1 }}
                    label="Quantity"
                    id="quantity"
                    name="quantity"
                    value={values.quantity}
                    onChange={handleChange}
                  />
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
                            button
                            onClick={() =>
                              handleToggleAddOn(addOn.id, "variant")
                            }
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
                              primary={addOn.id}
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
                            button
                            onClick={() =>
                              handleToggleAddOn(userAddOn.id, "custom")
                            }
                            secondaryAction={
                              <TextField
                                inputProps={{ type: "number", min: 1, max: 5 }}
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
                          button
                          onClick={() => handleOpenAddOn()}
                        >
                          <IconButton>
                            <Add />
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
                    >
                      {!isSubmitting ? (
                        "Buy Now"
                      ) : (
                        <CircularProgress size={21} />
                      )}
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
      )}
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
