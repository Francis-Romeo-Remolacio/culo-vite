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
} from "@mui/material";
import api from "../../../api/axiosConfig";
import { Tokens } from "../../../theme";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "75%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const UpdateTagModal = ({ open, handleClose, handleSubmit, tag_id }) => {
  const [formData, setFormData] = useState({
    designTagId: "",
    designTagName: "",
  });
  const [error, setError] = useState(null);

  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);

  useEffect(() => {
    fetchDesignTagInfo();
  }, [open]);

  const handleChange = async (e, index = null) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const fetchDesignTagInfo = async () => {
    try {
      const response = await api.get(`/tags/${tag_id}`);
      setFormData({
        designTagId: tag_id,
        designTagName: response.data.designTagName,
      });
    } catch {
      console.error("Error fetching record:", error);
    }
  };
  const handleUpdateButtonClick = () => {
    handleSubmit(formData);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} color={colors.text}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Update Tag {formData.designId}
        </Typography>
        <Box component="form" mt={2} id="form_box_container">
          <TextField
            error={false}
            margin="dense"
            fullWidth
            label="Design Tag Name"
            name="designTagName"
            value={formData.designTagName}
            onChange={(e) => handleChange(e)}
          />

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={handleClose} color="secondary" sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateButtonClick}
              variant="contained"
              color="primary"
            >
              Update
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default UpdateTagModal;
