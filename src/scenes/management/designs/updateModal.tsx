import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  Stack,
  styled,
  DialogContent,
  Divider,
  InputLabel,
  FormControl,
  DialogActions,
  Box,
} from "@mui/material";
import api from "../../../api/axiosConfig";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

const UpdateDesignModal = ({
  open,
  handleClose,
  handleUpdateSubmit,
  updatePastryMaterialOpen,
  designData,
}) => {
  const defaultFormData = {
    displayName: "",
    designPictureUrl: "N/A",
    cakeDescription: "",
    designTags: [],
    displayPictureData: "",
    designShapes: [],
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [error, setError] = useState(null);
  const [validTags, setValidTags] = useState([]);
  const [fileType, setFileType] = useState("");

  const fetchValidTags = async () => {
    try {
      const response = await api.get("/tags");
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
        const response = await api.get(`/designs/${encodedId}`);
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
          if (
            response.data.designShapes !== undefined &&
            response.data.designShapes !== null
          ) {
            parsedResponse.designShapes.forEach((element) => {
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

  const handleChange = (e, index = null, index2 = null) => {
    const { name, value } = e.target;
    if (index === null) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      if (index2 !== null) {
        if (index2 === 1) {
          setFormData((prevData) => {
            const newTagList = [...prevData.designTags];
            newTagList[index][name] = value;
            return {
              ...prevData,
              designTags: newTagList,
            };
          });
        } else if (index2 === 2) {
          setFormData((prevData) => {
            const newShapeList = [...prevData.designShapes];
            newShapeList[index][name] = value;
            return {
              ...prevData,
              designShapes: newShapeList,
            };
          });
        }
      }
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
      setFileType(file.type);
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

  const handleAddShapeRow = () => {
    const newShapeValue = {
      shapeName: "",
      initialData: "off",
      forDeletion: "off",
    };
    setFormData((prevData) => ({
      ...prevData,
      designShapes: [...prevData.designShapes, newShapeValue],
    }));
  };

  const handleRemoveTagRow = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      designTags: prevData.designTags.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveShapeRow = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      designShapes: prevData.designShapes.filter((_, i) => i !== index),
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

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  if (Object.keys(formData).length === 0) {
    return <p>Loading</p>;
  } else {
    return (
      <Dialog open={open} onClose={handleAddModalClose}>
        <DialogTitle>Editing Design "{designData.displayName}"</DialogTitle>
        <DialogContent sx={{ minWidth: "600px" }}>
          <Stack spacing={2}>
            <Box display="flex" justifyContent="center">
              {formData.displayPictureDataEncoded && (
                <img
                  src={`data:${fileType};base64,${designData.displayPictureData}`}
                  alt="Uploaded Preview"
                  style={{
                    width: "300px",
                    height: "auto",
                    borderRadius: "8px",
                  }}
                />
              )}
            </Box>
            <Button
              component="label"
              role={undefined}
              variant={
                designData.displayPictureData ? "contained" : "outlined"
              }
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload image
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleChange(e);
                  handleImageUpload(e);
                }}
              />
            </Button>
            <TextField
              error={false}
              fullWidth
              label="Display Name"
              name="displayName"
              variant="filled"
              value={formData.displayName}
              onChange={handleChange}
            />
            <TextField
              error={false}
              fullWidth
              multiline
              rows={4}
              label="Description"
              name="cakeDescription"
              variant="filled"
              value={formData.cakeDescription}
              onChange={handleChange}
            />
            <Divider />
            <Typography variant="h6">Tags</Typography>
            {formData.designTags !== undefined &&
              formData.designTags !== null &&
              formData.designTags.map((item, index) => (
                <Stack key={index} direction="row" spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel
                      variant="filled"
                      id={`tag-${index}-label`}
                    >{`Tag #${index + 1}`}</InputLabel>
                    <Select
                      labelId={`tag-${index}-label`}
                      disabled={item.initialData === "on"}
                      name="designTagId"
                      variant="filled"
                      value={item.designTagId}
                      onChange={(e) => handleChange(e, index, 1)}
                    >
                      {validTags.map((validTagRow, idx) => (
                        <MenuItem key={idx} value={validTagRow.designTagId}>
                          {validTagRow.designTagName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {item.initialData === "on" && (
                    <FormControlLabel
                      name="forDeletion"
                      control={<Checkbox />}
                      onChange={(e) => handleChange(e, index, 1)}
                      label="Delete"
                      sx={{ minWidth: "80px" }}
                    />
                  )}
                  {item.initialData === "off" && (
                    <Button
                      onClick={() => handleRemoveTagRow(index)}
                      startIcon={<DeleteIcon />}
                      color="secondary"
                      sx={{ minWidth: "80px" }}
                    >
                      Remove
                    </Button>
                  )}
                </Stack>
              ))}
            <Button variant="outlined" onClick={handleAddTagRow}>
              Add new tag
            </Button>
            <Divider />

            <Typography variant="h6">Shapes</Typography>
            {formData.designShapes.map((shape, index) => (
              <Stack key={index} direction="row" spacing={2}>
                <FormControl fullWidth>
                  <TextField
                    error={false}
                    disabled={shape.initialData === "on"}
                    onChange={(e) => handleChange(e, index, 2)}
                    id={`shape-${index}-label`}
                    label={`Shape #${index + 1}`}
                    name="shapeName"
                    variant="filled"
                    value={shape.shapeName}
                  />
                </FormControl>
                {shape.initialData === "on" && (
                  <FormControlLabel
                    name="forDeletion"
                    control={<Checkbox />}
                    onChange={(e) => handleChange(e, index, 2)}
                    label="Delete"
                    sx={{ minWidth: "80px" }}
                  />
                )}
                {shape.initialData === "off" && (
                  <Button
                    onClick={() => handleRemoveShapeRow(index)}
                    startIcon={<DeleteIcon />}
                    color="secondary"
                    sx={{ minWidth: "80px" }}
                  >
                    Remove
                  </Button>
                )}
              </Stack>
            ))}
            <Button variant="outlined" onClick={handleAddShapeRow}>
              Add new shape
            </Button>
            <Divider />

            <Typography variant="h6">Pastry Material</Typography>
            <Button variant="outlined" onClick={updatePastryMaterialOpen}>
              Edit pastry material
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddModalClose} color="secondary">
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            onClick={(e) => handleSubmit(e)}
          >
            Update Design
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
};

export default UpdateDesignModal;
