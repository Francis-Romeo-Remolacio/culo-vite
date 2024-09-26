import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  useTheme,
} from "@mui/material";
import { Tokens } from "../../../theme";

const ManualAddDialog = ({ open, handleClose, handleSubmit }) => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);
  const [formData, setFormData] = useState({
    designTagName: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCreate = async () => {};

  const handleCancel = () => {
    // Close the dialog and clear the text field
    handleClose();
    setFormData({ designTagName: "" });
  };

  return (
    <>
      <Dialog open={open} onClose={handleCancel}>
        <DialogTitle>Create New Tag</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the name of the new design tag:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="designTagName"
            name="designTagName"
            label="Design Tag Name"
            type="text"
            fullWidth
            variant="standard"
            value={formData.designTagName}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" sx={{ mr: 2 }} onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleSubmit(formData);
              handleClose();
              setFormData({ designTagName: "" });
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManualAddDialog;
