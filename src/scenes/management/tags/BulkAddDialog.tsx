import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Tokens } from "../../../theme";
import api from "../../../api/axiosConfig";

const BulkAddDialog = ({ open, handleClose, handleSubmit }) => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);
  const [formData, setFormData] = useState("");
  const [progress, setProgress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData(event.target.value);
  };

  const handleBulkCreate = async () => {
    const tags = formData.split("\n").filter((tag) => tag.trim() !== "");
    setLoading(true);

    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i];
      setProgress(`Processing ${i + 1} / ${tags.length}`);
      try {
        await api.post("/tags", { designTagName: tag });
      } catch (error) {
        console.error(`Error creating tag "${tag}":`, error);
      }
    }

    setLoading(false);
    setProgress("");
    handleSubmit();
    handleClose();
    setFormData("");
  };

  const handleCancel = () => {
    handleClose();
    setFormData("");
  };

  return (
    <>
      <Dialog open={open} onClose={handleCancel}>
        <DialogTitle>Bulk Add Tags</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the names of the new design tags, one per line:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="design_tag_names"
            name="design_tag_names"
            label="Design Tag Names"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={10}
            value={formData}
            onChange={handleChange}
          />
          {progress && <Typography variant="body2">{progress}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            sx={{ mr: 2 }}
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBulkCreate}
            disabled={loading}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BulkAddDialog;
