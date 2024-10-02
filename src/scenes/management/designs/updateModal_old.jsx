import React, { useState, useEffect } from "react";
import {
  Input,
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
} from "@mui/material";
import api from "../../../api/axiosConfig";
import { tokens } from "../../../theme";
import { UpdateModeEnum } from "chart.js";

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

const UpdateDesignModal = ({
  open,
  handleClose,
  handleUpdateSubmit,
  designData,
}) => {
  const defaultFormData = {
    displayName: "",
    designPictureUrl: "N/A",
    cakeDescription: "",
    designTags: [],
    displayPictureData: "",
  };

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [formData, setFormData] = useState(defaultFormData);
  const [error, setError] = useState(null);
  const [validTags, setValidTags] = useState([]);

  const fetchValidTags = async () => {
    try {
      const response = await api.get("/BOM/designs/tags");
      setValidTags(response.data);
    } catch (error) {
      setError("Failed to fetch valid tags");
      console.error("Failed to fetch valid tags:", error);
    }
  };

  const fetchDesignData = async () => {
    if (designData && designData.designId) {
      try {
        const encodedId = encodeURIComponent(designData.designId);
        const response = await api.get(`/BOM/designs/${encodedId}`);
        if (response.data.designId !== null) {
          const parsedResponse = response.data;
          if (
            response.data.designTags !== undefined &&
            response.data.designTags !== null
          ) {
            parsedResponse.designTags.forEach((element) => {
              element["initialData"] = "on";
              element["forDeletion"] = "off";
            });
          }
          setFormData(parsedResponse);
        }
      } catch (error) {
        setError("Failed to fetch design data");
        console.error("Failed to fetch design data:", error);
      }
    }
  };
  useEffect(() => {
    if (open) {
      fetchValidTags();
      fetchDesignData();
    }
  }, [open]);

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (index === null) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      setFormData((prevData) => {
        const newTagList = [...prevData.designTags];
        newTagList[index][name] = value;
        return {
          ...prevData,
          designTags: newTagList,
        };
      });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file.size > 1024 * 1024) {
      setError("File size exceeds the limit of 1MB.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64String = reader.result.split(",")[1];

      setFormData((prevData) => ({
        ...prevData,
        displayPictureData: base64String,
      }));
    };
  };

  const handleAddTagRow = () => {
    const newTagValue = {
      designTagId: validTags.length > 0 ? validTags[0].designTagId : "",
      designTagName: validTags.length > 0 ? validTags[0].designTagName : "",
      initialData: "off",
      forDeletion: "off",
    };
    setFormData((prevData) => ({
      ...prevData,
      designTags: [...prevData.designTags, newTagValue],
    }));
  };

  const handleRemoveTagRow = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      designTags: prevData.designTags.filter((_, i) => i !== index),
    }));
  };

  const handleAddModalClose = () => {
    setFormData(defaultFormData);
    handleClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleUpdateSubmit(formData);
    setFormData(defaultFormData);
    handleClose();
  };

  if (Object.keys(formData).length === 0) {
    return <p>Loading</p>;
  } else {
    return (
      <Modal
        open={open}
        onClose={handleAddModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} color={colors.text}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add New Design
          </Typography>
          <Button variant="contained" onClick={handleAddTagRow}>
            Add new tag
          </Button>
          <Box component="form" mt={2} id="form_box_container">
            <TextField
              error={false}
              fullWidth
              margin="dense"
              label="Display Name"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
            />
            <TextField
              error={false}
              fullWidth
              margin="dense"
              label="Description"
              name="cakeDescription"
              value={formData.cakeDescription}
              onChange={handleChange}
            />
            <Input
              fullWidth
              type="file"
              margin="dense"
              label="Image"
              name="displayPictureData"
              onChange={(e) => {
                handleChange(e);
                handleImageUpload(e);
              }}
            />
            {formData.designTags !== undefined &&
              formData.designTags !== null &&
              formData.designTags.map((item, index) => (
                <Box key={index} display="flex" alignItems="center">
                  <Select
                    autoWidth
                    disabled={item.initialData === "on"}
                    margin="dense"
                    label="Tag"
                    name="designTagId"
                    value={item.designTagId}
                    onChange={(e) => handleChange(e, index)}
                  >
                    {validTags.map((validTagRow, idx) => (
                      <MenuItem key={idx} value={validTagRow.designTagId}>
                        {validTagRow.designTagName}
                      </MenuItem>
                    ))}
                  </Select>
                  {item.initialData === "on" && (
                    <FormControlLabel
                      name="forDeletion"
                      control={<Checkbox />}
                      onChange={(e) => handleChange(e, index)}
                      label="Delete"
                    />
                  )}
                  {item.initialData === "off" && (
                    <Button
                      onClick={() => handleRemoveTagRow(index)}
                      color="secondary"
                      sx={{ ml: 2 }}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
              ))}
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button
                onClick={handleAddModalClose}
                color="secondary"
                sx={{ mr: 2 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={(e) => handleSubmit(e)}
              >
                Update Design
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    );
  }
};

export default UpdateDesignModal;
