import React, { useState, useEffect } from "react";
import {
  useTheme,
  Box,
  Button,
  TextField,
  Modal,
  Typography,
  Select,
  Stack,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  OutlinedInput,
  FormControl,
} from "@mui/material";
import api from "../../../api/axiosConfig";
import { Tokens } from "../../../Theme";
import { CookieSharp } from "@mui/icons-material";

const style = {
  top: "100%",
  left: "100%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  p: 1,
};

const UpdatePastryMaterialModal = ({
  open,
  handleClose,
  material,
  handleUpdate,
}) => {
  const [formData, setFormData] = useState({
    designId: "",
    otherCost: {
      additionalCost: 0.0,
    },
    ingredients: [],
    addOns: [],
    subVariants: [],
    forDeletion: "",
  });
  const [error, setError] = useState(null);

  const [validItemTypes, setValidItemTypes] = useState([]);
  const [validMeasurements, setValidMeasurements] = useState({});
  const [validDesignIds, setValidDesignIds] = useState([]);

  const [validInventoryItems, setValidInventoryItems] = useState([]);
  const [validAddOns, setValidAddOns] = useState([]);

  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);

  useEffect(() => {
    fetchValidMeasurements();
    fetchValidItemTypes();
    fetchValidInventoryItems();
    fetchValidAddOns();
  }, []);

  useEffect(() => {
    fetchDesignsWithoutPastryMaterials();
  }, [open]);

  useEffect(() => {
    if (material) {
      var newIngredientsForForm = [];
      material.ingredients.forEach((element) => {
        var currentIngredient = element;
        currentIngredient["forDeletion"] = "off";
        currentIngredient["forInsertion"] = "off";
        currentIngredient["changed"] = "off";
        newIngredientsForForm.push(currentIngredient);
      });
      var newAddOnsForForm = [];
      material.addOns.forEach((element) => {
        var currentAddOn = element;
        currentAddOn["forDeletion"] = "off";
        currentAddOn["forInsertion"] = "off";
        currentAddOn["changed"] = "off";
        newAddOnsForForm.push(currentAddOn);
      });
      var newSubVariantsForForm = [];
      material.subVariants.forEach((element) => {
        var currentVariant = element;
        currentVariant["forDeletion"] = "off";
        currentVariant["forInsertion"] = "off";
        currentVariant["changed"] = "off";
        currentVariant.subVariantIngredients.map(
          (subVariantIngredient, index) => {
            subVariantIngredient["forDeletion"] = "off";
            subVariantIngredient["forInsertion"] = "off";
            subVariantIngredient["changed"] = "off";
          }
        );
        currentVariant.subVariantAddOns.map((subVariantAddOn, index) => {
          subVariantAddOn["forDeletion"] = "off";
          subVariantAddOn["forInsertion"] = "off";
          subVariantAddOn["changed"] = "off";
        });
        newSubVariantsForForm.push(currentVariant);
      });
      setFormData({
        designId: material.designId,
        mainVariantName: material.mainVariantName,
        dateAdded: material.dateAdded,
        lastModifiedDate: material.lastModifiedDate,
        costEstimate: material.costEstimate,
        otherCost: material.otherCost,
        addOns: newAddOnsForForm,
        ingredients: newIngredientsForForm,
        subVariants: newSubVariantsForForm,
      });
    }
  }, [material]);

  const fetchValidItemTypes = async () => {
    try {
      const response = await api.get("/ui-helpers/valid-item-types");
      setValidItemTypes(response.data);
    } catch (error) {
      setError("Failed to fetch valid item types");
      console.error("Failed to fetch valid item types:", error);
    }
  };
  const fetchDesignsWithoutPastryMaterials = async () => {
    setValidDesignIds([]);
    try {
      const response = await api.get("/designs/without-pastry-material");
      setValidDesignIds(response.data);
      // Append the current material if it exists
      if (
        material !== null &&
        material.designId !== undefined &&
        material.designId !== null
      ) {
        setValidDesignIds((prevValidDesignIds) => [
          ...prevValidDesignIds,
          { designId: material.designId, displayName: material.designName },
        ]);
      }
    } catch (error) {
      setError("Failed to fetch valid design ids");
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

  const handleSubmit = async (e) => {
    //First Step : Check if Design Exists in db
    var designExists = false;
    try {
      const response = await api.get(
        "/designs/" + encodeURIComponent(formData.designId)
      );

      if (response.data.designId != null) {
        designExists = true;
        e.preventDefault();
        handleClose();
        await handleUpdate(material.pastryMaterialId, formData);
      } else {
        console.error("INVALID DESIGN ID");
        return;
      }
    } catch (error) {
      setError("Failed to fetch validity of design id");
      console.error("Failed to fetch validity of design id:", error);
    }
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
            newIngredients[index].itemName = selectedInventoryItem.itemName;
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
          formData.subVariants[index].subVariantIngredients[ingredientIndex]
            .ingredientType == "INV"
        ) {
          const selectedInventoryItem = validInventoryItems.find(
            (item) => item.id == encodedId
          );
          if (selectedInventoryItem !== undefined) {
            newSubIng[index].subVariantIngredients[ingredientIndex].itemName =
              selectedInventoryItem.itemName;
            newSubIng[index].subVariantIngredients[
              ingredientIndex
            ].amountMeasurement = selectedInventoryItem.measurements;
          }
        }
        {
          /*
          if (
          newSubIng[index].subVariantIngredients[ingredientIndex]
            .ingredientType == "MAT"
        ) {
          try {
            const response = await api.get("/BOM/materials/" + encodedId);
            if (
              response &&
              response.data.material.materialName &&
              response.data.material.amountMeasurement
            ) {
              newSubIng[index].subVariantIngredients[
                ingredientIndex
              ].itemName = response.data.material.materialName;
              newSubIng[index].subVariantIngredients[
                ingredientIndex
              ].amountMeasurement = response.data.material.amountMeasurement;
            }
          } catch (error) {
            console.error("Failed to get material:", error);
          }
        }  
          */
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
      newOtherCost[name] = value;

      return { ...prevData, otherCost: newOtherCost };
    });
  };

  const handleAddIngredientFormRow = () => {
    const newIngredient = {
      ingredientType: "INV",
      itemId: String(validInventoryItems[0].id),
      itemName: validInventoryItems[0].itemName,
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
      itemName: validInventoryItems[0].itemName,
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
      <DialogTitle id="dialog-title">Update Pastry Material</DialogTitle>
      <Box sx={style} color={colors.text}>
        <DialogContent>
          <Box component="form" id="form_box_container">
            <Typography variant="h2" p={2}>
              Design ID
              <Typography variant="caption" display={"block"}>
                To what cake is this recipe linked to
              </Typography>
            </Typography>
            <Select
              error={false}
              fullWidth
              margin="dense"
              label="Design ID"
              name="designId"
              value={formData.designId}
              onChange={(e) => handleChange(e)}
            >
              {validDesignIds !== undefined &&
                validDesignIds !== null &&
                validDesignIds.map((designInfo, index) => (
                  <MenuItem key={index} value={designInfo.designId}>
                    {designInfo.displayName}
                  </MenuItem>
                ))}
            </Select>

          </Box>
        </DialogContent>
      </Box>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdatePastryMaterialModal;
