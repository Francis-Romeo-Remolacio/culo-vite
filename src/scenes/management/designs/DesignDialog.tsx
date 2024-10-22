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
// import PastryMaterialDialog from "./PastryMaterialDialog";
import { Add, Delete as DeleteIcon, X } from "@mui/icons-material";
import PastryMaterialDialog from "./PastryMaterialDialog";
import { parseDesignDataForSubmission } from "../../../utils/Parser";

type DesignDialogProps = {
  design?: Design;
  open: boolean;
  onClose: () => void;
  tags: Tag[];
};

const DesignDialog = ({ open, onClose, design, tags }: DesignDialogProps) => {
  console.log("DESIGN::");
  console.log(design);

  const [picture, setPicture] = useState("");
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

  const initialValues: Partial<Design> = {
    name: "",
    description: "",
    shape: "round",
    customShape: "",
    tags: [],
    pastryMaterialId: "",
    variants: [],
  };

  const onSubmit = async () => {
    const parsedDesignBody = parseDesignDataForSubmission(values as Design, picture);
    
    if (design?.id) {
      await api.patch(`designs/${design.id}`, parsedDesignBody);
    } else {
      await api.post("designs", parsedDesignBody);
    }
    onClose();
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
    initialValues: design ? design : initialValues,
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
            variants: [
              // Main Variant
              {
                name: response.data.mainVariantName,
                costEstimate: response.data.costEstimate,
                costExactEstimate: response.data.costExactEstimate,
                ingredients: response.data.ingredients.map(
                  (ingredient: any) => ({
                    relationId: ingredient.ingredientId,
                    id: ingredient.itemId,
                    name: ingredient.itemName,
                    type: ingredient.type,
                    measurement: ingredient.amountMeasurement,
                    amount: ingredient.amount,
                    ingredientType: ingredient.ingredientType,
                    created: new Date(ingredient.dateAdded),
                    lastModified: new Date(ingredient.lastModifiedDate),
                  })
                ),
                ingredientImportance: response.data.ingredientImportance,
                addOns: response.data.addOns.map((addOn: any) => ({
                  relationId: addOn.pastryMaterialAddOnId,
                  id: addOn.addOnsId,
                  name: addOn.addOnsName,
                  amount: addOn.amount,
                })),
                inStock: response.data.ingredientsInStock,
                created: new Date(response.data.dateAdded),
                lastModified: new Date(response.data.lastModifiedDate),
              },
              // Sub-Variants
              response.data.subVariants.map((subVariant: any) => ({
                name: subVariant.subVariantName,
                costEstimate: subVariant.subVariantCostEstimate,
                costExactEstimate: subVariant.subVariantExactCostEstimate,
                ingredients: subVariant.subVariantIngredients.map(
                  (ingredient: any) => ({
                    relationId: ingredient.pastryMaterialSubVariantIngredientId,
                    id: ingredient.itemId,
                    name: ingredient.itemName,
                    type: ingredient.type,
                    amount: ingredient.amount,
                    amountMeasurement: ingredient.amountMeasurement,
                    ingredientType: ingredient.ingredientType,
                    created: new Date(ingredient.dateAdded),
                    lastModified: new Date(ingredient.lastModifiedDate),
                  })
                ),
                addOns: subVariant.subVariantAddOns.map((addOn: any) => ({
                  relationId: addOn.pastryMaterialSubVariantAddOnId,
                  id: addOn.addOnsId,
                  name: addOn.addOnsName,
                  amount: addOn.amount,
                })),
                inStock: subVariant.ingredientsInStock,
                created: new Date(subVariant.dateAdded),
                lastModified: new Date(subVariant.lastModifiedDate),
              })),
            ],
          };
          setPastryMaterial(parsedPastryMaterial);
          console.log("FETCHED::");
          console.log(parsedPastryMaterial);
        });
      setFetchingPastryMaterial(false);
    }
  };
  //Fetch design image using the id property in the design prop
  const fetchDesignImage = async () => {
    const response = await api.get(
      `designs/${design?.id}/display-picture-data`
    );
    setPicture(response.data.displayPictureData);
    setImageType(getImageType(response.data.displayPictureData));
  };

  // Filter available tags when values.tags changes
  useEffect(() => {
    filterTags();
  }, [values.tags]);

  // Form Setup on Edit Mode
  useEffect(() => {
    // if (design?.pictureData) {
    //   setImageType(getImageType(design.pictureData));
    //   setValues(design);
    // }
    setPicture("");

    //Set form data to selected design
    if (design !== undefined) {
      if (design.id !== undefined && design.id !== ""){

        //Set the image in the form to the selected design's image if the id of design object has a value
        //Else, change the picture in the form to nothing
        fetchDesignImage();

        //Fetch the design's pastry material as well if design id exists
        fetchPastryMaterial();
      }

      //Set the form data to selected design
      setValues(design);
      console.log(design);
    }
  }, [design]);

  // Filter tags to exclude already chosen ones
  const filterTags = () => {
    if (values.tags) {
      const chosenTagIds = values.tags.map((tag) => tag.id);
      const filteredTags = tags.filter((tag) => !chosenTagIds.includes(tag.id));
      setAvailableTags(filteredTags);
    }
  };
  const handleAddTag = () => {
    if (values.tags) {
      if (availableTags.length === 0) return; // Prevent adding if no tags are available
      setFieldValue("tags", [...values.tags, availableTags[0]]);
    }
  };

  const handleRemoveTag = (index: number) => {
    if (values.tags) {
      const updatedTags = [...values.tags];
      updatedTags.splice(index, 1); // Remove tag at the specified index
      setFieldValue("tags", updatedTags);
    }
  };

  const handleChangeTags = (index: number, newTagId: string) => {
    if (values.tags) {
      const updatedTags = [...values.tags];
      updatedTags[index] = tags.find((tag) => tag.id === newTagId) as Tag;
      setFieldValue("tags", updatedTags);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{design ? "Edit Design" : "Add Design"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2} sx={{ width: 500 }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              {design ? (
                <img
                  src={`data:image/${imageType};base64,${picture}`}
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

              {availableTags.length > 0 &&
              values.tags &&
              values.tags.length < 5 ? (
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
              {values.tags &&
                values.tags.map((tag, index) => {
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
            {!fetchingPastryMaterial ? (
              <PastryMaterialDialog
                pastryMaterial={pastryMaterial as PastryMaterial}
                setPastryMaterial={setPastryMaterial}
                shape={values.shape ? values.shape : "custom"}
                mode={design && design.id.length > 0 ? "edit" : "add"}
                open={pastryMaterialOpen}
                onClose={handleClosePastryMaterial}
              />
            ) : null}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => resetForm({ values: design || initialValues })}
          >
            Reset
          </Button>
          <Button onClick={() => handleSubmit()} type="submit" variant="contained" disabled={isSubmitting}>
            {!isSubmitting ? "Save" : <CircularProgress size={21} />}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DesignDialog;
