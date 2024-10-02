import React, { useState, useEffect, SetStateAction, ChangeEvent } from "react";
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

type ManualAddDialogProps = {
  open: boolean;
  setOpenEditModal: (value: SetStateAction<boolean>) => void;
  handleSubmit: (data: any) => Promise<void>;
  tagId: string;
};

const UpdateTagModal = ({
  open,
  setOpenEditModal,
  handleSubmit,
  tagId,
}: ManualAddDialogProps) => {
  const [formData, setFormData] = useState({
    designTagId: "",
    designTagName: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDesignTagInfo();
  }, [open]);

  const handleChange = async (
    event: ChangeEvent<HTMLInputElement>,
    index = null
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const fetchDesignTagInfo = async () => {
    try {
      const response = await api.get(`/tags/${tagId}`);
      setFormData({
        designTagId: tagId,
        designTagName: response.data.designTagName,
      });
    } catch {
      console.error("Error fetching record:", error);
    }
  };
  const handleUpdateButtonClick = () => {
    handleSubmit(formData);
    setOpenEditModal(false);
  };

  return (
    <Modal
      open={open}
      onClose={setOpenEditModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Update Tag {formData.designTagId}
        </Typography>
        <Box component="form" mt={2} id="form_box_container">
          <TextField
            error={false}
            margin="dense"
            fullWidth
            label="Design Tag Name"
            name="designTagName"
            value={formData.designTagName}
            onChange={handleChange}
          />

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button
              onClick={() => {
                setOpenEditModal;
              }}
              color="secondary"
              sx={{ mr: 2 }}
            >
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
