import {
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import api from "../../../api/axiosConfig";
import { designSchema } from "../../../utils/Validation";
import { Design } from "../../../utils/Schemas";
import { useEffect, useState } from "react";
import { getImageType } from "../../../components/Base64Image";
import { Close as CloseIcon, Delete } from "@mui/icons-material";

type DesignDialogProps = {
  open: boolean;
  onClose: () => void;
  design?: Design;
  mode: "add" | "edit";
};

const DesignDialog = ({ open, onClose, design }: DesignDialogProps) => {
  const [imageType, setImageType] = useState("");

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
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleSubmit,
    setValues,
    resetForm,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: designSchema,
    onSubmit,
  });

  // Form Setup
  useEffect(() => {
    if (design) {
      setImageType(getImageType(design.pictureData));
      setValues(design);
    }
  }, [design]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{"Edit Design"}</DialogTitle>
      <form onSubmit={onSubmit}>
        <Stack spacing={2} sx={{ width: 400, p: 2 }}>
          {design ? (
            <img
              src={`data:image/${imageType};base64,${design?.pictureData}`}
              alt={design?.name}
              style={{
                height: "auto",
                borderRadius: "8px",
              }}
            />
          ) : null}
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
          <List>
            {design?.tags.map((tag) => (
              <ListItem
                key={tag.id}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete">
                    <Delete />
                  </IconButton>
                }
              >
                <ListItemText primary={tag.name} />
              </ListItem>
            ))}
          </List>
          <Stack direction="row-reverse">
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              onClick={(e) => e.preventDefault()}
            >
              {!isSubmitting ? "Save" : <CircularProgress size={21} />}
            </Button>
            <Button
              onClick={() => {
                console.log(values);

                if (design) {
                  resetForm({ values: design });
                }
              }}
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
