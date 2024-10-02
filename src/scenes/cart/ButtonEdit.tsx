import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid2 as Grid,
  IconButton,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import api from "../../api/axiosConfig";

function CustomTabPanel(props) {
  const { children, tab, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={tab !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {tab === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  tab: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ButtonEdit = ({ orderData, designInfo }) => {
  const [price, setPrice] = useState(orderData.price);
  const [size, setSize] = useState(orderData.size);
  const [flavor, setFlavor] = useState(orderData.flavor);
  const [quantity, setQuantity] = useState(orderData.quantity);
  const [description, setDescription] = useState(orderData.description);
  const [orderAddOns, setOrderAddOns] = useState([]);
  const [variant, setVariant] = useState(null);
  const [open, setOpen] = useState(false);
  const [openSucc, setOpenSucc] = useState(false);
  const [openFail, setOpenFail] = useState(false);
  const [tab, setTab] = useState(0);
  const [availableAddOns, setAvailableAddOns] = useState([]);
  const [availableFlavors, setAvailableFlavors] = useState([
    "Dark Chocolate",
    "Funfetti (vanilla with sprinkles)",
    "Vanilla Caramel",
    "Mocha",
    "Red Velvet",
    "Banana",
  ]);

  const handleChangeTab = (event, newTab) => {
    setTab(newTab);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleClickFlavor = (flavor) => {
    setFlavor(flavor);
  };
  const handleClickSize = (size) => {
    setSize(size);
  };
  const handleChangeQuantity = (event) => {
    setQuantity(event.target.value);
  };
  const handleChangeDescription = (event) => {
    setDescription(event.target.value);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSucc(false);
    setOpenFail(false);
  };

  const handleEditOrder = async () => {
    try {
      // update_order_details
      const orderDetails = {
        description,
        quantity,
        size,
        flavor,
      };
      await api.patch(
        `/api/AddingOrders/${orderData.id}/update_order_details`,
        orderDetails
      );

      // Add new add-ons to the order
      /*for (const addOn of orderAddOns) {
        await api.patch(`/api/AddingOrders/${orderData.id}/add_new_add_ons`, {
          addOnName: addOn.addOnName,
          quantity: addOn.quantity,
        });
      }*/

      // Close the dialog
      handleClose();

      setOpenSucc(true);
    } catch (error) {
      console.error("There was an error adding the order:", error);
      setOpenFail(true);
    }
  };

  /*useEffect(() => {
    const fetchAvailableAddOns = async () => {
      try {
        const response = await api.get("add-ons");
        setAvailableAddOns(response.data);
      } catch (error) {
        console.error("There was an error fetching available add-ons:", error);
      }
    };
    fetchAvailableAddOns();
  }, []);*/

  /*useEffect(() => {
    const fetchOrderAddOns = async () => {
      const response = await api.get(
        `orders/suborders/${orderData.id}/add-ons`
      );
      setOrderAddOns(response.data.addOnDPOs);
    };
    fetchOrderAddOns();
  }, [orderData]);*/

  useEffect(() => {
    const findVariantByName = (designInfo, variantName) => {
      // Check if designInfo and variants array exist
      if (
        !designInfo ||
        !designInfo.variants ||
        !Array.isArray(designInfo.variants)
      ) {
        setVariant(null);
      }

      // Find the variant object by variant_name
      const variant = designInfo.variants.find(
        (v) => v.variant_name === variantName
      );
      setVariant(variant || null);
    };
    findVariantByName(designInfo, size);
  }, [size]);

  // AddOns

  const addEmptyAddOn = () => {
    setOrderAddOns([...orderAddOns, { addOnName: "", quantity: 0 }]);
  };

  const handleAddOnChange = (idx, newValue) => {
    const newOrderAddOns = [...orderAddOns];
    newOrderAddOns[idx].addOnName = newValue ? newValue.addOnName : "";
    setOrderAddOns(newOrderAddOns);
  };

  const updateAddOnQuantity = (addOnName, newQuantity) => {
    setOrderAddOns(
      orderAddOns.map((addOn) =>
        addOn.addOnName === addOnName
          ? { ...addOn, quantity: newQuantity }
          : addOn
      )
    );
  };

  const removeAddOn = (addOnName) => {
    setOrderAddOns(
      orderAddOns.filter((addOn) => addOn.addOnName !== addOnName)
    );
  };

  return (
    <>
      <IconButton variant="contained" onClick={handleClickOpen}>
        <EditIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">
          {"Confirm order details"}
        </DialogTitle>
        <DialogContent sx={{ minWidth: "600px", minHeight: "700px" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tab} onChange={handleChangeTab}>
              <Tab label="General Details" {...a11yProps(0)} />
              <Tab label="Add-Ons" {...a11yProps(1)} disabled />
            </Tabs>
          </Box>
          <CustomTabPanel tab={tab} index={0}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Stack spacing={2}>
                  <Typography variant="h5">Size</Typography>
                  <Box display="flex" flexWrap="wrap" gap="2px">
                    {designInfo ? (
                      designInfo.variants.map((variant) => (
                        <Button
                          key={variant.variant_name}
                          label={variant.variant_name}
                          children={variant.variant_name}
                          onClick={() => handleClickSize(variant.variant_name)}
                          variant={
                            size === variant.variant_name
                              ? "contained"
                              : "outlined"
                          }
                        />
                      ))
                    ) : (
                      <></>
                    )}
                    <Button
                      key="Custom"
                      label="Custom"
                      children="Custom"
                      onClick={() => handleClickSize("Custom")}
                      variant={size === "Custom" ? "contained" : "outlined"}
                    />
                  </Box>
                  <Typography variant="h5">Flavor</Typography>
                  <Box display="flex" flexWrap="wrap" gap="2px">
                    {availableFlavors.map((flavorinator) => (
                      <Button
                        key={flavorinator}
                        label={flavorinator}
                        children={flavorinator}
                        onClick={() => handleClickFlavor(flavorinator)}
                        variant={
                          flavor === flavorinator ? "contained" : "outlined"
                        }
                      />
                    ))}
                    <Button
                      key="Custom"
                      label="Custom"
                      children="Custom"
                      onClick={() => handleClickFlavor("Custom")}
                      variant={flavor === "Custom" ? "contained" : "outlined"}
                    />
                  </Box>
                  <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <TextField
                      inputProps={{ type: "number", min: 1 }}
                      label="Quantity"
                      id="quantityNumber"
                      variant="filled"
                      value={quantity}
                      onChange={handleChangeQuantity}
                    />
                  </FormControl>
                </Stack>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    id="descriptionText"
                    label="Customization Requests"
                    multiline
                    rows={8}
                    value={description}
                    onChange={handleChangeDescription}
                    sx={{ height: "100%" }}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </CustomTabPanel>
          <CustomTabPanel tab={tab} index={1}>
            <Button
              fullWidth
              variant="contained"
              onClick={addEmptyAddOn}
              pb="8px"
            >
              Insert Add-On
            </Button>

            {/* OrderAddons */}
            <Stack spacing={2}>
              {orderAddOns.map((addOn, idx) => (
                <Grid container key={idx} sx={{ width: "100%" }}>
                  <Grid size={{ xs: 9 }}>
                    {/* OrderAddOns Name */}
                    <Autocomplete
                      disablePortal
                      id={`order-add-on-${idx}`}
                      options={availableAddOns}
                      getOptionLabel={(option) => option.addOnName}
                      onChange={(event, newValue) =>
                        handleAddOnChange(idx, newValue)
                      }
                      renderInput={(params) => (
                        <TextField
                          variant="filled"
                          defaultValue={addOn.addOnName}
                          {...params}
                          label={`Order Add On #${idx + 1}`}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 2 }}>
                    {/* OrderAddOns Quantity */}
                    <TextField
                      type="number"
                      label="Quantity"
                      variant="filled"
                      value={addOn.quantity}
                      onChange={(event) =>
                        updateAddOnQuantity(addOn.addOnName, event.target.value)
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 1 }}>
                    {/* OrderAddOns Remove Button */}
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{ width: "100%", height: "100%" }}
                    >
                      <IconButton
                        onClick={() => removeAddOn(addOn.addOnName)}
                        color="error"
                      >
                        <RemoveCircleIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              ))}
            </Stack>
          </CustomTabPanel>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleEditOrder} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSucc}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Successfully edited item details.
        </Alert>
      </Snackbar>
      <Snackbar
        open={openFail}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          Failed to edit item details!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ButtonEdit;
