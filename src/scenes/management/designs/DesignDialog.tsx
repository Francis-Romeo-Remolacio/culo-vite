import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
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
import { Design, PastryMaterial, Tag } from "../../../utils/Schemas";
import { useEffect, useState } from "react";
import { getImageType } from "../../../components/Base64Image";
import PastryMaterialDialog from "./PastryMaterialDialog";
import { Add, Delete as DeleteIcon } from "@mui/icons-material";

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

  const [pastryMaterial, setPastryMaterial] =
    useState<Partial<PastryMaterial>>();
  const [fetchingPastryMaterial, setFetchingPastryMaterial] = useState(true);
  const [pastryMaterialOpen, setPastryMaterialOpen] = useState(false);

  const handleTogglePastryMaterial = () => {
    setPastryMaterialOpen(!pastryMaterialOpen);
  };

  const handleClosePastryMaterial = () => {
    setPastryMaterialOpen(false);
  };

  const initialValues: Design = {
    id: "",
    name: "",
    description: "",
    pictureData: "",
    shape: "round",
    tags: [],
    pastryMaterialId: "",
    variants: [],
  };

  const onSubmit = async () => {
    if (design?.id) {
      await api.patch(`designs/${design.id}`, values);
    } else {
      await api.post("designs", values);
    }
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

  const fetchPastryMaterial = async () => {
    if (design && design.id.length > 0) {
      setFetchingPastryMaterial(true);
      await api
        .get(`designs/${encodeURIComponent(design.id)}/pastry-material`)
        .then((response) => {
          const parsedPastryMaterial: PastryMaterial = {
            id: response.data.pastryMaterialId,
            designId: response.data.designId,
            designName: response.data.designName,
            created: new Date(response.data.dateAdded),
            lastModified: new Date(response.data.lastModifiedDate),
            otherCost: {
              additionalCost: response.data.otherCost.additionalCost,
              multiplier: response.data.otherCost.ingredientCostMultiplier,
            },
            costEstimate: response.data.costEstimate,
            costExactEstimate: response.data.costExactEstimate,
            mainVariantName: response.data.mainVariantName,
            ingredients: response.data.ingredients.map((ingredient: any) => ({
              id: ingredient.itemId,
              name: ingredient.itemName,
              type: ingredient.type,
              ingredientType: ingredient.ingredientType,
              amountMeasurement: ingredient.amountMeasurement,
              amount: ingredient.amount,
            })),
            ingredientImportance: response.data.ingredientImportance,
            addOns: response.data.addOns.map((addOn: any) => ({
              id: addOn.addOnsId,
              name: addOn.addOnsName,
              amount: addOn.amount,
            })),
            subVariants: response.data.subVariants.map((subVariant: any) => ({
              id: subVariant.pastryMaterialSubVariantId,
              name: subVariant.subVariantName,
              ingredients: subVariant.ingredients.map((ingredient: any) => ({
                id: ingredient.itemId,
                name: ingredient.itemName,
                type: ingredient.type,
                amount: ingredient.amount,
                amountMeasurement: ingredient.amountMeasurement,
                ingredientId: ingredient.pastryMaterialSubVariantIngredientId,
                ingredientType: ingredient.ingredientType,
              })),
              addOns: subVariant.addOns,
            })),
            inStock: response.data.inStock,
          };
          setPastryMaterial(parsedPastryMaterial);
        });
    }
    setFetchingPastryMaterial(false);
  };

  const updatePastryMaterial = async () => {
    if (design && pastryMaterial) {
      await api.patch(`pastry-materials/${pastryMaterial.id}`, {
        designId: design.id,
        mainVariantName: pastryMaterial.mainVariantName,
      });
      await api.patch(`pastry-materials/${pastryMaterial.id}/other-costs`, {
        additionalCost: pastryMaterial.otherCost?.additionalCost,
        ingredientCostMultiplier: pastryMaterial.otherCost?.multiplier,
      });
    }
  };

  useEffect(() => {
    fetchPastryMaterial();
  }, [design]);

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
  const handleAddTag = () => {
    if (availableTags.length === 0) return; // Prevent adding if no tags are available
    setFieldValue("tags", [...values.tags, availableTags[0]]);
  };

  const handleRemoveTag = (index: number) => {
    const updatedTags = [...values.tags];
    updatedTags.splice(index, 1); // Remove tag at the specified index
    setFieldValue("tags", updatedTags);
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
        <DialogContent>
          <Stack spacing={2} sx={{ width: 500 }}>
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
            <Stack direction="row" spacing={2}>
              <FormControl fullWidth>
                <InputLabel id="select-shape-label">Shape</InputLabel>
                <Select
                  labelId="select-shape"
                  label="Shape"
                  id="shape"
                  name="shape"
                  value={values.shape}
                  onChange={handleChange}
                >
                  <MenuItem value={"round"}>{"Round"}</MenuItem>
                  <MenuItem value={"heart"}>{"Heart"}</MenuItem>
                  <MenuItem value={"rectangle"}>{"Rectangle"}</MenuItem>
                  <MenuItem value={"custom"}>{"Custom"}</MenuItem>
                </Select>
              </FormControl>
              {values.shape === "custom" ? (
                <TextField
                  label="Custom Shape"
                  id="customShape"
                  name="customShape"
                  value={values.customShape}
                  onChange={handleChange}
                  fullWidth
                />
              ) : null}
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h3">{"Tags"}</Typography>

              {availableTags.length > 0 && values.tags.length < 5 ? (
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  onClick={handleAddTag}
                >
                  <Add />
                  Add
                </Button>
              ) : null}
            </Stack>
            <Stack spacing={2}>
              {values.tags.map((tag, index) => {
                // Create a temporary list of tags that includes the current tag + availableTags
                const options = [
                  tag,
                  ...availableTags.filter(
                    (availableTag) => availableTag.id !== tag.id
                  ),
                ];

                return (
                  <Stack direction="row" spacing={2}>
                    <FormControl
                      fullWidth
                      key={`select-tag-form-${index}`}
                      size="small"
                    >
                      <Select
                        labelId={`select-tag-${index}`}
                        id={`select-tag-${index}`}
                        value={tag.id} // Use the current tag ID directly
                        onChange={(e) =>
                          handleChangeTags(index, e.target.value as string)
                        }
                      >
                        {options.map((availableTag) => (
                          <MenuItem
                            key={availableTag.id}
                            value={availableTag.id}
                          >
                            {availableTag.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveTag(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                );
              })}
            </Stack>
            <Button
              onClick={handleTogglePastryMaterial}
              variant="contained"
              color="secondary"
              disabled={fetchingPastryMaterial}
            >
              {"Materials List"}
            </Button>
            <PastryMaterialDialog
              pastryMaterial={pastryMaterial as PastryMaterial}
              setPastryMaterial={setPastryMaterial}
              shape={values.shape}
              mode={design && design.id.length > 0 ? "edit" : "add"}
              open={pastryMaterialOpen}
              onClose={handleClosePastryMaterial}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => resetForm({ values: design || initialValues })}
          >
            Reset
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {!isSubmitting ? "Save" : <CircularProgress size={21} />}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DesignDialog;
