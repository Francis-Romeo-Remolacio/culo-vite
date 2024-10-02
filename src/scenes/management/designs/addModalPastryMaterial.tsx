import React, { useState, useEffect } from "react";
import {
  useTheme,
  Box,
  Button,
  TextField,
  Modal,
  Typography,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  OutlinedInput,
  Stack,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import api from "../../../api/axiosConfig";
import { Tokens } from "../../../Theme";

const style = {
  top: "100%",
  left: "100%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  p: 1,
};

const AddPastryMaterialModal = ({
  open,
  addDesignModalOpen,
  handleClose,
  handleAdd,
}) => {
  const defaultFormData = {
    designId: "",
    otherCost: {
      additionalCost : 0.0
    },
    ingredients: [],
    addOns: [],
    subVariants: [],
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [error, setError] = useState(null);

  const [validItemTypes, setValidItemTypes] = useState([]);
  const [validMeasurements, setValidMeasurements] = useState({});
  const [validDesignIds, setValidDesignIds] = useState([]);

  const [validInventoryItems, setValidInventoryItems] = useState([]);
  const [validAddOns, setValidAddOns] = useState([]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    fetchValidMeasurements();
    fetchValidItemTypes();
    fetchValidInventoryItems();
    fetchValidAddOns();
  }, []);
  useEffect(() => {
    if (addDesignModalOpen === false) {
      setFormData(defaultFormData);
    }
  }, [addDesignModalOpen]);

  const fetchValidItemTypes = async () => {
    try {
      const response = await api.get("/ui-helpers/valid-item-types");
      setValidItemTypes(response.data);
    } catch (error) {
      setError("Failed to fetch valid item types");
      console.error("Failed to fetch valid item types:", error);
    }
  };
  const fetchValidMeasurements = async () => {
    try {
      const response = await api.get("/ui-helpers/valid-measurement-values");
      setValidMeasurements(response.data);
    } catch (error) {
      setError("Failed to fetch valid measurement units");
      console.error("Failed to fetch valid measurement units:", error);
    }
  };
  const fetchValidInventoryItems = async () => {
    try {
      const response = await api.get("/ingredients/active");
      setValidInventoryItems(response.data);
    } catch {
      setError("Failed to fetch valid inventory items");
      console.error("Failed to fetch valid inventory items:", error);
    }
  };
  const fetchValidAddOns = async () => {
    try {
      const response = await api.get("/add-ons");
      setValidAddOns(response.data);
    } catch {
      setError("Failed to fetch valid add on items");
      console.error("Failed to fetch valid add on items:", error);
    }
  };
  const handleAddModalClose = () => {
    setFormData(defaultFormData);
    handleClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleClose();

    await handleAdd(formData);
  };
  const handleChange = async (e, index = null) => {
    const { name, value } = e.target;

    if (index === null) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      var newIngredients = [];
      setFormData((prevData) => {
        newIngredients = [...prevData.ingredients];
        newIngredients[index] = {
          ...newIngredients[index],
          [name]: value,
          changed: "on",
        };
        return {
          ...prevData,
          ingredients: newIngredients,
        };
      });

      if (name == "itemId") {
        const encodedId = encodeURIComponent(value);
        if (formData.ingredients[index].ingredientType == "INV") {
          const selectedInventoryItem = validInventoryItems.find(
            (item) => item.id == encodedId
          );
          if (selectedInventoryItem !== undefined) {
            newIngredients[index].itemName = selectedInventoryItem.name;
            newIngredients[index].amountMeasurement =
              selectedInventoryItem.measurements;
          }
        }
        /*
        if (formData.ingredients[index].ingredientType == "MAT") {
          try {
            const response = await api.get("/BOM/materials/" + encodedId);
            if (
              response &&
              response.data.material.materialName &&
              response.data.material.amountMeasurement
            ) {
              newIngredients[index].itemName =
                response.data.material.materialName;
              newIngredients[index].amountMeasurement =
                response.data.material.amountMeasurement;
            }
          } catch (error) {
            console.error("Failed to get material:", error);
          }
        }
        */
      }
      setFormData((prevData) => {
        return { ...prevData, ingredients: newIngredients };
      });
    }
  };
  const handleSubVariantChange = async (e, index, ingredientIndex = null) => {
    const { name, value } = e.target;
    if (ingredientIndex === null) {
      var newSubVariant = [];
      setFormData((prevData) => {
        newSubVariant = prevData.subVariants;
        newSubVariant[index][name] = value;
        newSubVariant[index]["changed"] = "on";
        return { ...prevData, subVariants: newSubVariant };
      });
    } else {
      var newSubIng = [];
      setFormData((prevData) => {
        newSubIng = prevData.subVariants;
        newSubIng[index].subVariantIngredients[ingredientIndex][name] = value;
        if (
          newSubIng[index].subVariantIngredients[ingredientIndex][
            "forInsertion"
          ] === "off"
        ) {
          newSubIng[index].subVariantIngredients[ingredientIndex]["changed"] =
            "on";
        }
        return { ...prevData, subVariants: newSubIng };
      });

      if (name == "itemId") {
        const encodedId = encodeURIComponent(value);
        if (
          newSubIng[index].subVariantIngredients[ingredientIndex]
            .ingredientType == "INV"
        ) {
          try {
            const response = await api.get(`/Ingredients/${encodedId}`);
            if (response && response.data.name && response.data.measurements) {
              newSubIng[index].subVariantIngredients[ingredientIndex].itemName =
                response.data.name;
              newSubIng[index].subVariantIngredients[
                ingredientIndex
              ].amountMeasurement = response.data.measurements;
            }
          } catch (error) {
            console.error("Failed to get item in inventory:", error);
          }
        }
        if (
          newSubIng[index].subVariantIngredients[ingredientIndex]
            .ingredientType == "MAT"
        ) {
          try {
            const response = await api.get(`/pastry-materials/${encodedId}`);
            if (
              response &&
              response.data.material.materialName &&
              response.data.material.amountMeasurement
            ) {
              newSubIng[index].subVariantIngredients[ingredientIndex].itemName =
                response.data.material.materialName;
              newSubIng[index].subVariantIngredients[
                ingredientIndex
              ].amountMeasurement = response.data.material.amountMeasurement;
            }
          } catch (error) {
            console.error("Failed to get material:", error);
          }
        }
      }
      setFormData((prevData) => {
        return { ...prevData, subVariants: newSubIng };
      });
    }
  };
  const handleAddOnChange = async (e, index) => {
    const { name, value } = e.target;
    var newAddOns = [];
    setFormData((prevData) => {
      newAddOns = prevData.addOns;
      newAddOns[index][name] = value;
      newAddOns[index].changed = "on";

      if (name == "addOnsId") {
        const selectedAddOn = validAddOns.find(
          (addOn) => addOn.addOnsId == value
        );

        if (selectedAddOn !== undefined) {
          newAddOns[index].addOnsName = selectedAddOn.addOnName;
        }
      }
      return { ...prevData, addOns: newAddOns };
    });
  };
  const handleSubVariantAddOnChange = async (e, index, subvarAddOnIndex) => {
    const { name, value } = e.target;
    var newSubVariants = [];
    setFormData((prevData) => {
      newSubVariants = prevData.subVariants;
      newSubVariants[index].subVariantAddOns[subvarAddOnIndex][name] = value;
      newSubVariants[index].subVariantAddOns[subvarAddOnIndex].changed = "on";
      if (name == "addOnsId") {
        const selectedAddOn = validAddOns.find(
          (addOn) => addOn.addOnsId == value
        );

        if (selectedAddOn !== undefined) {
          newSubVariants[index].subVariantAddOns[subvarAddOnIndex].addOnsName =
            selectedAddOn.addOnName;
        }
      }
      return { ...prevData, subVariants: newSubVariants };
    });
  };
  
  const handleAdditionalCostChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      var newOtherCost = prevData.otherCost;
      newOtherCost[name] = value

      return {...prevData, otherCost: newOtherCost}
    })
  }

  const handleAddIngredientFormRow = () => {
    const newIngredient = {
      ingredientType: "INV",
      itemId: String(validInventoryItems[0].id),
      itemName: validInventoryItems[0].name,
      amountMeasurement: validInventoryItems[0].measurements,
      amount: "0",
      forInsertion: "on",
    };

    setFormData((prevData) => ({
      ...prevData,
      ingredients: [...prevData.ingredients, newIngredient],
    }));
  };
  const handleRemoveIngredientRow = (e, index) => {
    setFormData((prevData) => ({
      ...prevData,
      ingredients: prevData.ingredients.filter((_, i) => i !== index),
    }));
  };
  const handleAddAddOnFormRow = () => {
    const newAddOn = {
      addOnsId: validAddOns[0].addOnsId,
      addOnsName: validAddOns[0].addOnName,
      amount: 0,
      forInsertion: "on",
    };
    setFormData((prevData) => ({
      ...prevData,
      addOns: [...prevData.addOns, newAddOn],
    }));
  };
  const handleRemoveAddOnRow = (e, index) => {
    var newAddOns = [];
    setFormData((prevData) => {
      newAddOns = prevData.addOns;
      newAddOns.splice(index, 1);
      return { ...prevData, addOns: newAddOns };
    });
  };
  const handleAddVariantRow = () => {
    const newVariant = {
      subVariantName: "",
      forInsertion: "on",
      subVariantIngredients: [],
      subVariantAddOns: [],
    };
    setFormData((prevData) => ({
      ...prevData,
      subVariants: [...prevData.subVariants, newVariant],
    }));
  };
  const handleRemoveVariantRow = (e, index) => {
    var newVariant = [];
    setFormData((prevData) => {
      newVariant = prevData.subVariants;
      newVariant.splice(index, 1);
      return { ...prevData, subVariants: newVariant };
    });
  };
  const handleAddSubVariantAddOnRow = (e, index) => {
    const newAddOn = {
      addOnsId: validAddOns[0].addOnsId,
      addOnsName: validAddOns[0].addOnName,
      amount: 0,
      forInsertion: "on",
    };
    var newSubVariantRow = [];
    setFormData((prevData) => {
      newSubVariantRow = prevData.subVariants;
      newSubVariantRow[index].subVariantAddOns.push(newAddOn);

      return { ...prevData, subVariants: newSubVariantRow };
    });
  };
  const handleRemoveSubVariantAddOnRow = (e, index, addOnIndex) => {
    var newSubVariant = [];
    setFormData((prevData) => {
      newSubVariant = prevData.subVariants;
      newSubVariant[index].subVariantAddOns.splice(addOnIndex, 1);
      return { ...prevData, subVariants: newSubVariant };
    });
  };
  const handleAddSubVariantIngredientRow = (e, index) => {
    const newIngredient = {
      ingredientType: "INV",
      itemId: String(validInventoryItems[0].id),
      itemName: validInventoryItems[0].name,
      amountMeasurement: validInventoryItems[0].measurements,
      amount: "0",
      forInsertion: "on",
    };
    var newSubVariant = [];
    setFormData((prevData) => {
      newSubVariant = prevData.subVariants;
      newSubVariant[index].subVariantIngredients.push(newIngredient);
      return { ...prevData, subVariants: newSubVariant };
    });
  };
  const handleRemoveSubVariantIngredientRow = (e, index, ingredientIndex) => {
    var newSubVariant = [];
    setFormData((prevData) => {
      newSubVariant = prevData.subVariants;
      newSubVariant[index].subVariantIngredients.splice(ingredientIndex, 1);
      return { ...prevData, subVariants: newSubVariant };
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      maxWidth={true}
      fullWidth={true}
    >
      <DialogTitle id="dialog-title">Add new Pastry Material</DialogTitle>
      <Box sx={style} color={colors.text}>
        <DialogContent>
          <Box component="form" id="form_box_container">
            <Typography variant="h2" p={2}>
              Smallest Size
              <Typography variant="caption" display={"block"}>
                Contains the base ingredients and add-ons, when any other size's
                ingredient is subtracted to the inventory, the base ingredients
                also gets subtracted. <br />
                It is recommended to put the smallest size of the design in
                this.
              </Typography>
            </Typography>
            <TextField
              error={false}
              fullWidth
              margin="dense"
              label="Smallest Size Name"
              name="mainVariantName"
              value={formData.mainVariantName}
              onChange={(e) => handleChange(e)}
            />
            
            <Typography variant="h4" p={2}>
            Other Costs
              <Typography variant="caption" display={"block"}>
              Contains other costs that will be included in the final calculation of the price for all of the sizes.<br />
              This could include fees such as labor, utilities, and other miscellaneous fees. <br />
              </Typography>
            </Typography>
            <TextField
              error={false}
              fullWidth
              margin="dense"
              label="Additional Cost"
              name="additionalCost"
              type="number"
              value={formData.otherCost.additionalCost}
              onChange={(e) => handleAdditionalCostChange(e)}
            />

            <Stack spacing={1}>
              <Typography variant="h4" p={2}>
                Main Ingredients
              </Typography>
              <Button variant="contained" onClick={handleAddIngredientFormRow}>
                Add new Ingredient
              </Button>
              {formData.ingredients.map((ingredient, index) => (
                <Box key={"mainvar_ingredient" + index}>
                  <Stack spacing={0.1} direction="row" mt={1}>
                    <Select
                      sx={{ width: "10%" }}
                      autoWidth
                      margin="dense"
                      label="Ingredient Type"
                      name="ingredientType"
                      value={ingredient.ingredientType}
                      onChange={(e) => handleChange(e, index)}
                    >
                      {validItemTypes.map((type, idx) => (
                        <MenuItem key={idx} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                    {/*
                    <TextField
                      sx={{ width: "20%" }}
                      error={false}
                      margin="dense"
                      label="Item Id"
                      name="itemId"
                      value={ingredient.itemId}
                      onChange={(e) => handleChange(e, index)}
                    />
                    */}
                    <Select
                      sx={{ width: "20%" }}
                      error={false}
                      margin="dense"
                      label="Item Id"
                      name="itemId"
                      value={ingredient.itemId}
                      onChange={(e) => handleChange(e, index)}
                    >
                      {ingredient.ingredientType == "INV" &&
                        validInventoryItems.map((inventoryItem, idx) => (
                          <MenuItem key={idx} value={String(inventoryItem.id)}>
                            ID:{String(inventoryItem.id)} / {inventoryItem.name}
                          </MenuItem>
                        ))}
                    </Select>
                    <TextField
                      sx={{ width: "20%" }}
                      margin="dense"
                      label="Item Name"
                      name="itemName"
                      disabled
                      value={ingredient.itemName}
                    />
                    <Select
                      sx={{ width: "30%" }}
                      autoWidth
                      margin="dense"
                      name="amountMeasurement"
                      value={ingredient.amountMeasurement}
                      onChange={(e) => handleChange(e, index)}
                    >
                      {Object.entries(validMeasurements).map(
                        (
                          [quantityUnit, measurementUnitList],
                          validMeasurementsIndex
                        ) =>
                          measurementUnitList.includes(
                            ingredient.amountMeasurement
                          ) &&
                          measurementUnitList.map((measurementUnit, i) => (
                            <MenuItem
                              key={`${validMeasurementsIndex}-${i}`}
                              value={measurementUnit}
                            >
                              {measurementUnit}
                            </MenuItem>
                          ))
                      )}
                    </Select>
                    <TextField
                      sx={{ width: "20%" }}
                      margin="dense"
                      type="number"
                      label="Amount"
                      name="amount"
                      value={ingredient.amount}
                      onChange={(e) => handleChange(e, index)}
                    />
                    {ingredient.forInsertion === "off" && (
                      <FormControlLabel
                        name="forDeletion"
                        control={<Checkbox />}
                        onChange={(e) => handleChange(e, index)}
                        label="Delete"
                      />
                    )}
                    {ingredient.forInsertion === "on" && (
                      <Button
                        id={`remove_button${index}`}
                        variant="contained"
                        onClick={(e) => handleRemoveIngredientRow(e, index)}
                      >
                        Remove
                      </Button>
                    )}
                  </Stack>
                </Box>
              ))}
            </Stack>

            <Stack spacing={1}>
              <Typography variant="h4" p={2}>
                Main Add Ons
              </Typography>
              <Button variant="contained" onClick={handleAddAddOnFormRow}>
                Add new add-on
              </Button>
              {formData.addOns.map((addOn, index) => (
                <Box key={"mainvar_add_on" + index}>
                  <Stack spacing={0.1} direction="row" mt={1}>
                    <Select
                      sx={{ width: "30%" }}
                      error={false}
                      margin="dense"
                      label="Add On Id"
                      name="addOnsId"
                      value={addOn.addOnsId}
                      onChange={(e) => handleAddOnChange(e, index)}
                    >
                      {validAddOns.map((addOn, idx) => (
                        <MenuItem key={idx} value={String(addOn.id)}>
                          ID:{String(addOn.id)} / {addOn.addOnName}
                        </MenuItem>
                      ))}
                    </Select>

                    <TextField
                      sx={{ width: "40%" }}
                      disabled
                      error={false}
                      margin="dense"
                      label="Add-On Name"
                      name="addOnsName"
                      value={addOn.addOnsName}
                      onChange={(e) => handleAddOnChange(e, index)}
                    />
                    <TextField
                      sx={{ width: "20%" }}
                      margin="dense"
                      type="number"
                      label="Amount"
                      name="amount"
                      value={addOn.amount}
                      onChange={(e) => handleAddOnChange(e, index)}
                    />

                    {addOn.forInsertion === "off" && (
                      <FormControlLabel
                        name="forDeletion"
                        control={<Checkbox />}
                        onChange={(e) => handleAddOnChange(e, index)}
                        label="Delete"
                      />
                    )}
                    {addOn.forInsertion === "on" && (
                      <Button
                        id={`remove_button${index}`}
                        variant="contained"
                        onClick={(e) => handleRemoveAddOnRow(e, index)}
                      >
                        Remove
                      </Button>
                    )}
                  </Stack>
                </Box>
              ))}
            </Stack>

            <Stack spacing={1} pt={2}>
              <Typography variant="h2" p={2}>
                Other Sizes
                <Typography variant="caption" display={"block"}>
                  Contains the other sizes for the current design
                </Typography>
              </Typography>
              <Button variant="contained" onClick={handleAddVariantRow}>
                Add new size
              </Button>
            </Stack>

            {formData.subVariants.map((subVariant, index) => (
              <Box key={"subvar" + index} mb={2}>
                <Stack spacing={0.1} direction="row" mt={1}>
                  <Typography variant="h4" p={2}>
                    Other Size #{index + 1} <br /> Name:{" "}
                    {subVariant.subVariantName}
                  </Typography>
                  {subVariant.forInsertion === "off" && (
                    <FormControlLabel
                      name="forDeletion"
                      control={<Checkbox />}
                      onChange={(e) => handleSubVariantChange(e, index)}
                      label="Delete"
                    />
                  )}
                  {subVariant.forInsertion === "on" && (
                    <Button
                      id={`remove_button${index}`}
                      variant="contained"
                      onClick={(e) => handleRemoveVariantRow(e, index)}
                    >
                      Remove
                    </Button>
                  )}
                </Stack>
                <TextField
                  error={false}
                  fullWidth
                  margin="dense"
                  label="Other Size Name"
                  name="subVariantName"
                  value={subVariant.subVariantName}
                  onChange={(e) => handleSubVariantChange(e, index)}
                />
                <Stack>
                  <Typography variant="h5" p={2}>
                  Other Size #{index + 1} Ingredients
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={(e) => handleAddSubVariantIngredientRow(e, index)}
                  >
                    Add new Ingredient
                  </Button>
                </Stack>

                {subVariant.subVariantIngredients.map(
                  (subVariantIngredient, indexSubVariantIng) => (
                    <Box
                      key={
                        "subvar" + index + "_ingredient" + indexSubVariantIng
                      }
                      mb={2}
                    >
                      <Stack spacing={0.1} direction="row" mt={1}>
                        <Select
                          sx={{ width: "10%" }}
                          margin="dense"
                          label="Ingredient Type"
                          name="ingredientType"
                          value={subVariantIngredient.ingredientType}
                          onChange={(e) =>
                            handleSubVariantChange(e, index, indexSubVariantIng)
                          }
                        >
                          {validItemTypes.map((type, idx) => (
                            <MenuItem key={idx} value={type}>
                              {type}
                            </MenuItem>
                          ))}
                        </Select>
                        <Select
                          sx={{ width: "20%" }}
                          error={false}
                          margin="dense"
                          label="Item Id"
                          name="itemId"
                          value={subVariantIngredient.itemId}
                          onChange={(e) =>
                            handleSubVariantChange(e, index, indexSubVariantIng)
                          }
                        >
                          {subVariantIngredient.ingredientType == "INV" &&
                            validInventoryItems.map((inventoryItem, idx) => (
                              <MenuItem
                                key={idx}
                                value={String(inventoryItem.id)}
                              >
                                ID:{String(inventoryItem.id)} /{" "}
                                {inventoryItem.name}
                              </MenuItem>
                            ))}
                        </Select>
                        <TextField
                          sx={{ width: "20%" }}
                          margin="dense"
                          label="Item Name"
                          name="itemName"
                          disabled
                          value={subVariantIngredient.itemName}
                        />
                        <Select
                          sx={{ width: "30%" }}
                          autoWidth
                          margin="dense"
                          name="amountMeasurement"
                          value={subVariantIngredient.amountMeasurement}
                          onChange={(e) =>
                            handleSubVariantChange(e, index, indexSubVariantIng)
                          }
                        >
                          {Object.entries(validMeasurements).map(
                            (
                              [quantityUnit, measurementUnitList],
                              validMeasurementsIndex
                            ) =>
                              measurementUnitList.includes(
                                subVariantIngredient.amountMeasurement
                              ) &&
                              measurementUnitList.map((measurementUnit, i) => (
                                <MenuItem
                                  key={`${validMeasurementsIndex}-${i}`}
                                  value={measurementUnit}
                                >
                                  {measurementUnit}
                                </MenuItem>
                              ))
                          )}
                        </Select>
                        <TextField
                          sx={{ width: "20%" }}
                          margin="dense"
                          type="number"
                          label="Amount"
                          name="amount"
                          value={subVariantIngredient.amount}
                          onChange={(e) =>
                            handleSubVariantChange(e, index, indexSubVariantIng)
                          }
                        />
                        {subVariantIngredient.forInsertion === "off" && (
                          <FormControlLabel
                            name="forDeletion"
                            control={<Checkbox />}
                            onChange={(e) =>
                              handleSubVariantChange(
                                e,
                                index,
                                indexSubVariantIng
                              )
                            }
                            label="Delete"
                          />
                        )}
                        {subVariantIngredient.forInsertion === "on" && (
                          <Button
                            id={`remove_button${index}`}
                            variant="contained"
                            onClick={(e) =>
                              handleRemoveSubVariantIngredientRow(
                                e,
                                index,
                                indexSubVariantIng
                              )
                            }
                          >
                            Remove
                          </Button>
                        )}
                      </Stack>
                    </Box>
                  )
                )}

                <Stack>
                  <Typography variant="h5" p={2}>
                    Other Size #{index + 1} Add Ons
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={(e) => handleAddSubVariantAddOnRow(e, index)}
                  >
                    Add new add-on
                  </Button>
                </Stack>
                {subVariant.subVariantAddOns.map(
                  (subvarAddOn, subvarAddOnIndex) => (
                    <Box key={"subvarAddOn" + index + "_" + subvarAddOnIndex}>
                      <Stack spacing={0.1} direction="row" mt={1}>
                        <Select
                          sx={{ width: "30%" }}
                          error={false}
                          margin="dense"
                          label="Add On Id"
                          name="addOnsId"
                          value={subvarAddOn.addOnsId}
                          onChange={(e) =>
                            handleSubVariantAddOnChange(
                              e,
                              index,
                              subvarAddOnIndex
                            )
                          }
                        >
                          {validAddOns.map((addOn, idx) => (
                            <MenuItem key={idx} value={String(addOn.id)}>
                              ID:{String(addOn.id)} / {addOn.addOnName}
                            </MenuItem>
                          ))}
                        </Select>

                        <TextField
                          sx={{ width: "40%" }}
                          disabled
                          error={false}
                          margin="dense"
                          label="Add-On Name"
                          name="addOnsName"
                          value={subvarAddOn.addOnsName}
                          onChange={(e) =>
                            handleSubVariantAddOnChange(
                              e,
                              index,
                              subvarAddOnIndex
                            )
                          }
                        />
                        <TextField
                          sx={{ width: "20%" }}
                          margin="dense"
                          type="number"
                          label="Amount"
                          name="amount"
                          value={subvarAddOn.amount}
                          onChange={(e) =>
                            handleSubVariantAddOnChange(
                              e,
                              index,
                              subvarAddOnIndex
                            )
                          }
                        />

                        {subvarAddOn.forInsertion === "off" && (
                          <FormControlLabel
                            name="forDeletion"
                            control={<Checkbox />}
                            onChange={(e) =>
                              handleSubVariantAddOnChange(
                                e,
                                index,
                                subvarAddOnIndex
                              )
                            }
                            label="Delete"
                          />
                        )}
                        {subvarAddOn.forInsertion === "on" && (
                          <Button
                            id={`remove_button${index}`}
                            variant="contained"
                            onClick={(e) =>
                              handleRemoveSubVariantAddOnRow(
                                e,
                                index,
                                subvarAddOnIndex
                              )
                            }
                          >
                            Remove
                          </Button>
                        )}
                      </Stack>
                    </Box>
                  )
                )}
              </Box>
            ))}
          </Box>
        </DialogContent>
      </Box>
      <DialogActions>
        <Button onClick={handleAddModalClose} color="secondary" sx={{ mr: 2 }}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPastryMaterialModal;
