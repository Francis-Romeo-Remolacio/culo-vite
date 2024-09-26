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
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Menu,
} from "@mui/material";
import api from "../../../api/axiosConfig";
import { Tokens } from "../../../theme";

const style = {
  top: "100%",
  left: "100%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  p: 1,
};

const ManualSubtractionModal = ({
  open,
  handleClose,
  material,
  handleDelete,
}) => {
  const [formData, setFormData] = useState({
    pastryMaterialId: "",
    variant_id: "",
    subtraction_count: 1,
  });
  const [ingredientsInStock, setIngredientsInStock] = useState(true);
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);

  const handleSubmit = async (e) => {
    handleDelete(formData);
    handleClose();
  };

  useEffect(() => {
    if (material == null) {
      return;
    }
    const parsedData = {
      pastryMaterialId: material.pastryMaterialId,
      variant_id: material.pastryMaterialId,
      subtraction_count: 1,
    };

    setFormData(parsedData);
  }, [open]);
  useEffect(() => {
    updateIngredientInStockState();
  }, [material]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name == "variant_id") {
      updateIngredientInStockState();
    }
  };
  const updateIngredientInStockState = () => {
    if (
      material !== undefined &&
      material !== null &&
      material.subVariants !== undefined &&
      material.subVariants !== null
    ) {
      if (formData.pastryMaterialId == formData.variant_id) {
        setIngredientsInStock(material.ingredients_in_stock);
      } else {
        setIngredientsInStock(
          material.subVariants.find(
            (x) => x.pastryMaterialSubVariantId == formData.variant_id
          ).ingredients_in_stock
        );
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      fullWidth={true}
      maxWidth={true}
    >
      <DialogTitle id="dialog-title">
        Subtract Pastry Material Ingredients
      </DialogTitle>
      <Box sx={style} color={colors.text}>
        <DialogContent>
          <Box component="form" id="form_box_container">
            <Typography variant="caption">
              Subtracts only the ingredients of a variant (not including add
              ons), Use only if absolutely necessary
            </Typography>
            <Stack direction={"row"} spacing={1}>
              <Select
                sx={{ width: "100%" }}
                margin="dense"
                label="Variant Name"
                name="variant_id"
                value={formData.variant_id}
                onChange={(e) => handleChange(e)}
              >
                {material !== undefined && material !== null && (
                  <MenuItem value={formData.pastryMaterialId}>
                    {material.mainVariantName}
                  </MenuItem>
                )}
                {material !== undefined &&
                  material !== null &&
                  material.subVariants !== undefined &&
                  material.subVariants !== null &&
                  material.subVariants.map((subVariant, index) => (
                    <MenuItem value={subVariant.pastryMaterialSubVariantId}>
                      {subVariant.subVariantName}
                    </MenuItem>
                  ))}
              </Select>
            </Stack>
          </Box>
        </DialogContent>
      </Box>

      <DialogActions>
        <Button onClick={handleClose} color="secondary" sx={{ mr: 2 }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!ingredientsInStock}
        >
          Subtract from Inventory
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManualSubtractionModal;
