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
import { tokens } from "../../../theme";
import { useEffect, useState } from "react";

const style = {
  top: "100%",
  left: "100%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  p: 1,
};
const DeleteConfirmationModal = ({
  open,
  handleClose,
  material,
  handleDelete,
}) => {
  const [formData, setFormData] = useState({
    designId: "",
    pastryMaterialId: "",
    designName: "",
  });
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    if (material !== undefined && material !== null) {
      setFormData({
        designId: material.designId,
        pastryMaterialId: material.pastryMaterialId,
        designName: material.designName,
      });
    }
  }, [material]);

  const handleSubmit = async () => {
    await handleDelete(formData);
    handleClose();
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
      <DialogTitle id="dialog-title">Delete Pastry Material</DialogTitle>
      <Box sx={style} color={colors.text}>
        <DialogContent>
          <Box component="form" id="form_box_container">
            <Typography variant="h4" p={2}>
              Do you want to delete the pastry material for {formData.designName}?
              <Typography variant="caption" display={"block"}>
                Pastry Material ID: {formData.pastryMaterialId} <br/>
                Design ID: {formData.designId}
              </Typography>
            </Typography>
          </Box>
        </DialogContent>
      </Box>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="warning">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
