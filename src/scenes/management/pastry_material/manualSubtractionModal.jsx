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
import { Tokens } from "../../../Theme";

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
    variantId: "",
    subtraction_count: 1,
  });
  const [ingredientsInStock, setIngredientsInStock] = useState(false);
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
      variantId: material.pastryMaterialId,
      subtraction_count: 1,
    };

    setFormData(parsedData);
    updateIngredientInStockState();
  }, [open]);
  useEffect(() => {updateIngredientInStockState()}, [material, formData])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    updateIngredientInStockState();
  };

  const updateIngredientInStockState = () => {
    if (material !== undefined && material !== null &&
      material.subVariants !== undefined && material.subVariants !== null){
        if (formData.pastryMaterialId === formData.variantId){
         setIngredientsInStock(material.ingredientsInStock); 
        }
        else {
          setIngredientsInStock(material.subVariants.find(x => x.pastryMaterialSubVariantId == formData.variantId).ingredientsInStock)
        }
      }
  }

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
            <Typography variant="caption" >
              Subtracts only the ingredients of a specific design's size (not including add ons), 
              Use only if absolutely necessary
            </Typography>
            <Stack direction={"row"} spacing={1}>
              <Select
                sx={{ width: "100%" }}
                margin="dense"
                label="Size"
                name="variantId"
                value={formData.variantId}
                onChange={(e) => handleChange(e)}
              >
                {material !== undefined && material !== null && 
                <MenuItem value={material.pastryMaterialId}>{material.mainVariantName}</MenuItem>}
                {
                  material !== undefined && material !== null && 
                  material.subVariants !== undefined && material.subVariants !== null && 
                  material.subVariants.map((subVariant, index) => (
                  <MenuItem value={subVariant.pastryMaterialSubVariantId}>{subVariant.subVariantName}</MenuItem>
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
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={!ingredientsInStock}>
          Subtract from Inventory
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManualSubtractionModal;
