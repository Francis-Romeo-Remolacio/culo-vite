import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import api from "../../../api/axiosConfig";
import { designSchema } from "../../../utils/Validation";
import { Design, Tag } from "../../../utils/Schemas";
import { useEffect, useState } from "react";
import { getImageType } from "../../../components/Base64Image";

type DesignDialogProps = {
  mode: "add" | "edit";
  open: boolean;
  onClose: () => void;
  design?: Design;
  tags: Tag[];
};

const DesignDialog = ({
  mode,
  open,
  onClose,
  design,
  tags,
}: DesignDialogProps) => {
  const [imageType, setImageType] = useState("");
  const [availableTags, setAvailableTags] = useState<Tag[]>(tags);

  const initialValues: Design = {
    id: "",
    name: "",
    description: "",
    pictureData: "",
    shape: "",
    tags: [],
    pastryMaterialId: "",
    variants: [],
  };

  const onSubmit = async () => {
    await api.post("designs", values);
  };

  const {
    values,
    handleChange,
    handleSubmit,
    setFieldValue,
    setValues,
    resetForm,
    isSubmitting,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: designSchema,
    onSubmit,
  });

  // Filter available tags when values.tags changes
  useEffect(() => {
    filterTags();
  }, [values.tags]);

  // Form Setup on Edit Mode
  useEffect(() => {
    if (design) {
      setImageType(getImageType(design.pictureData));
      setValues(design);
    }
  }, [design]);

  // Filter tags to exclude already chosen ones
  const filterTags = () => {
    const chosenTagIds = values.tags.map((tag) => tag.id);
    const filteredTags = tags.filter((tag) => !chosenTagIds.includes(tag.id));
    setAvailableTags(filteredTags);
  };

  const handleChangeTags = (index: number, newTagId: string) => {
    const updatedTags = [...values.tags];
    updatedTags[index] = tags.find((tag) => tag.id === newTagId) as Tag;
    setFieldValue("tags", updatedTags);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {mode === "edit" ? "Edit Design" : "Add Design"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2} sx={{ width: 600, p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            {design ? (
              <img
                src={`data:image/${imageType};base64,${design?.pictureData}`}
                alt={design?.name}
                style={{
                  width: "50%",
                  height: "auto",
                  borderRadius: "8px",
                }}
              />
            ) : null}
          </Box>
          <TextField
            label="Name"
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange}
          />
          <TextField
            label="Description"
            id="description"
            name="description"
            value={values.description}
            onChange={handleChange}
            multiline
            rows={6}
          />
          <TextField
            label="Shape"
            id="shape"
            name="shape"
            value={values.shape}
            onChange={handleChange}
          />
          <Typography>{"Tags"}</Typography>
          <Stack spacing={1}>
            {values.tags.map((tag, index) => {
              // Create a temporary list of tags that includes the current tag + availableTags
              const options = [
                tag,
                ...availableTags.filter(
                  (availableTag) => availableTag.id !== tag.id
                ),
              ];

              return (
                <FormControl fullWidth key={`select-tag-form-${index}`}>
                  <InputLabel id={`select-tag-${index}-label`}>Tag</InputLabel>
                  <Select
                    labelId={`select-tag-${index}`}
                    id={`select-tag-${index}`}
                    value={tag.id} // Use the current tag ID directly
                    label="Tag"
                    onChange={(e) =>
                      handleChangeTags(index, e.target.value as string)
                    }
                  >
                    {options.map((availableTag) => (
                      <MenuItem key={availableTag.id} value={availableTag.id}>
                        {availableTag.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              );
            })}
          </Stack>

          <Stack direction="row-reverse">
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {!isSubmitting ? "Save" : <CircularProgress size={21} />}
            </Button>
            <Button
              onClick={() => resetForm({ values: design || initialValues })}
            >
              Reset
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </Stack>
        </Stack>
      </form>
    </Dialog>
  );
};

export default DesignDialog;
