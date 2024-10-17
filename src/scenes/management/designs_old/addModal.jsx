import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
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
  CircularProgress,
} from "@mui/material";
import api from "../../../api/axiosConfig";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

const AddDesignModal = ({
  open,
  handleClose,
  handleAddSubmit,
  addPastryMaterialOpen,
}) => {
  const defaultFormData = {
    displayName: "",
    displayPictureUrl: "",
    cakeDescription: "",
    designTagIds: [],
    displayPictureData: "",
    designShapes: [],
    displayPictureDataEncoded: "",
  };
  const [error, setError] = useState(null);

  const [validTags, setValidTags] = useState([]);
  const [formData, setFormData] = useState(defaultFormData);
  const [fileType, setFileType] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  const fetchValidTags = async () => {
    try {
      const response = await api.get("/tags");
      setValidTags(response.data);
    } catch (error) {
      setError("Failed to fetch valid tags");
      console.error("Failed to fetch valid tags:", error);
    }
  };

  useEffect(() => {
    fetchValidTags();
    setFormData(defaultFormData);
  }, []);

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
            const newTagList = [...prevData.designTagIds];
            newTagList[index] = value;
            return {
              ...prevData,
              designTagIds: newTagList,
            };
          });
        } else if (index2 === 2) {
          setFormData((prevData) => {
            const newShapeList = [...prevData.designShapes];
            newShapeList[index] = value;
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
        displayPictureDataEncoded: base64String,
      }));
      setFileType(file.type);
    };
  };

  const handleAddTagRow = () => {
    const newTagValue = validTags.length > 0 ? validTags[0].designTagId : "";
    setFormData((prevData) => ({
      ...prevData,
      designTagIds: [...prevData.designTagIds, newTagValue],
    }));
  };

  const handleAddShapeRow = () => {
    setFormData((prevData) => ({
      ...prevData,
      designShapes: [...prevData.designShapes, ""],
    }));
  };

  const handleRemoveTagRow = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      designTagIds: prevData.designTagIds.filter((_, i) => i !== index),
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
    setSubmitting(true);
    // Implement form submission logic here
    await handleAddSubmit(formData);
    setFormData(defaultFormData);
    handleClose();
    setSubmitting(false);
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
  return (
    <Dialog open={open} onClose={handleAddModalClose}>
      <DialogTitle>Adding a new Design</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ minWidth: "600px" }}>
          <Stack spacing={2}>
            <Box display="flex" justifyContent="center">
              {formData.displayPictureDataEncoded && (
                <img
                  src={`data:${fileType};base64,${formData.displayPictureDataEncoded}`}
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
                formData.displayPictureDataEncoded ? "contained" : "outlined"
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
            {formData.designTagIds.map((tagId, index) => (
              <Stack key={index} direction="row" spacing={2}>
                <FormControl fullWidth>
                  <InputLabel
                    variant="filled"
                    id={`tag-${index}-label`}
                  >{`Tag #${index + 1}`}</InputLabel>
                  <Select
                    labelId={`tag-${index}-label`}
                    label={`Tag #${index + 1}`}
                    name="designTagIds"
                    value={tagId}
                    onChange={(e) => handleChange(e, index, 1)}
                  >
                    {validTags.map((validTagRow, idx) => (
                      <MenuItem key={idx} value={validTagRow.designTagId}>
                        {validTagRow.designTagName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  onClick={() => handleRemoveTagRow(index)}
                  startIcon={<DeleteIcon />}
                  color="secondary"
                  sx={{ minWidth: "80px" }}
                >
                  Remove
                </Button>
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
                    value={shape}
                  />
                </FormControl>
                <Button
                  onClick={() => handleRemoveShapeRow(index)}
                  startIcon={<DeleteIcon />}
                  color="secondary"
                  sx={{ minWidth: "80px" }}
                >
                  Remove
                </Button>
              </Stack>
            ))}
            <Button variant="outlined" onClick={handleAddShapeRow}>
              Add new shape
            </Button>
            <Divider />

            <Typography variant="h6">Pastry Material</Typography>
            <Button variant="outlined" onClick={addPastryMaterialOpen}>
              Edit pastry material
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleAddModalClose}
            color="secondary"
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {!isSubmitting ? "Add" : <CircularProgress size={21} />}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddDesignModal;
