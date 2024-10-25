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
  styled,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useFormik } from "formik";
import api from "../../../api/axiosConfig";
import { designSchema } from "../../../utils/Validation";
import {
  Design,
  PastryMaterial,
  PastryMaterialVariant,
  Tag,
} from "../../../utils/Schemas";
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
  const [isDeleting, setIsDeleting] = useState(false);

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
    const parsedDesignBody = parseDesignDataForSubmission(
      values as Design,
      picture
    );

    if (design?.id) {
      await api.patch(`designs/${design.id}`, parsedDesignBody);
      //Copy the design tags
      const designTagsCopy = design?.tags.map((x) => x.id);
      //Get all tags that was not included in the parsed design request body
      const deletedTags: string[] = designTagsCopy?.filter(
        (x) => parsedDesignBody.designTagIds.includes(x) == false
      );
      //Delete all found tags not included
      if (deletedTags !== undefined) {
        await api.delete(`designs/${design.id}/tags`, { data: deletedTags });
      }
    } else {
      await api.post("designs", parsedDesignBody);
    }
    onClose();
  };

  const handleDelete = async () => {
    if (design?.id == undefined) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await api.delete(
        `/designs/${encodeURIComponent(design?.id)}`
      );
      onClose();
    } catch {
      console.error("Failed delete design: " + design?.id);
    }
    setIsDeleting(false);
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
          const responseData = response.data;

          var parsedPastryMaterial: PastryMaterial;
          if (
            responseData === undefined ||
            responseData === null ||
            responseData.pastryMaterialId === null
          ) {
            parsedPastryMaterial = {
              id: undefined,
              designId: design?.id,
              designName: design?.name,
              created: new Date(),
              lastModified: new Date(),
              otherCost: {
                additionalCost: 0,
                multiplier: 2,
              },
              variants: [
                {
                  name: "",
                  costEstimate: 0,
                  costExactEstimate: 0,
                  ingredients: [],
                  ingredientImportance: [],
                  addOns: [],
                  inStock: false,
                  created: new Date(),
                  lastModified: new Date()
                }
              ]
            }
          } else {
            parsedPastryMaterial = {
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
              ],
            };
            const subVariants: PastryMaterialVariant[] =
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
                    measurement: ingredient.amountMeasurement,
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
              }));
            parsedPastryMaterial.variants =
              parsedPastryMaterial.variants.concat(subVariants);
          }

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
      if (design.id !== undefined && design.id !== "") {
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
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e === null) return;
    if (e.target === null) return;
    if (e.target.files === null) return;

    const file = e.target.files[0];
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64String = reader.result?.toString().split(",")[1];

      setPicture(base64String as string);
      setImageType(file.type);
    };
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
            <Button
              component="label"
              role={undefined}
              variant={picture ? "contained" : "outlined"}
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload image
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleImageUpload(e);
                }}
              />
            </Button>
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
          {design?.id !== undefined &&
            design?.id !== null &&
            design?.id !== "" && (
              <Button
                onClick={() => handleDelete()}
                color="error"
                variant="contained"
                disabled={isSubmitting || isDeleting}
              >
                {!isSubmitting || !isDeleting ? (
                  "Delete"
                ) : (
                  <CircularProgress size={21} />
                )}
              </Button>
            )}
          <Button
            onClick={() => resetForm({ values: design || initialValues })}
          >
            Reset
          </Button>
          <Button
            onClick={() => handleSubmit()}
            type="submit"
            variant="contained"
            disabled={isSubmitting || isDeleting}
          >
            {!isSubmitting || !isDeleting ? (
              "Save"
            ) : (
              <CircularProgress size={21} />
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DesignDialog;
