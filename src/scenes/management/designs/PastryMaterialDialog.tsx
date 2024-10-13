import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Slider,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import {
  AddOn,
  Ingredient,
  PastryMaterial,
  PastryMaterialAddOn,
  PastryMaterialIngredient,
  PastryMaterialSubVariant,
} from "../../../utils/Schemas";
import { pastryMaterialSchema } from "../../../utils/Validation";
import { useFormik } from "formik";
import { ChangeEvent, useEffect, useReducer, useState } from "react";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import api from "../../../api/axiosConfig";
import { toCurrency } from "../../../utils/Formatter";

// Actions for ingredients and add-ons
const INGREDIENT_ACTIONS = {
  ADD_INGREDIENT: "addIngredient",
  UPDATE_INGREDIENT: "updateIngredient",
  REMOVE_INGREDIENT: "removeIngredient",
} as const;

type IngredientAction =
  | {
      type: typeof INGREDIENT_ACTIONS.ADD_INGREDIENT;
      payload: PastryMaterialIngredient;
    }
  | { type: typeof INGREDIENT_ACTIONS.REMOVE_INGREDIENT; payload: number }
  | {
      type: typeof INGREDIENT_ACTIONS.UPDATE_INGREDIENT;
      payload: { index: number; ingredient: Partial<PastryMaterialIngredient> };
    };

// Reducer function for ingredients
function ingredientsReducer(
  state: PastryMaterialIngredient[],
  action: IngredientAction
) {
  switch (action.type) {
    case INGREDIENT_ACTIONS.ADD_INGREDIENT:
      return [...state, action.payload]; // PastryMaterialIngredient

    case INGREDIENT_ACTIONS.REMOVE_INGREDIENT:
      return state.filter((_, index) => index !== action.payload); // number (index)

    case INGREDIENT_ACTIONS.UPDATE_INGREDIENT:
      return state.map((ingredient, index) => {
        if (index === action.payload.index) {
          return { ...ingredient, ...action.payload.ingredient };
        }
        return ingredient;
      });

    default:
      return state;
  }
}

const ADDON_ACTIONS = {
  ADD_ADDON: "addAddon",
  UPDATE_ADDON: "updateAddon",
  REMOVE_ADDON: "removeAddon",
} as const;

type AddOnAction =
  | { type: typeof ADDON_ACTIONS.ADD_ADDON; payload: PastryMaterialAddOn }
  | {
      type: typeof ADDON_ACTIONS.UPDATE_ADDON;
      payload: { index: number; addOn: Partial<PastryMaterialAddOn> };
    }
  | { type: typeof ADDON_ACTIONS.REMOVE_ADDON; payload: number };

function addOnsReducer(state: PastryMaterialAddOn[], action: AddOnAction) {
  switch (action.type) {
    case ADDON_ACTIONS.ADD_ADDON:
      return [...state, action.payload];
    case ADDON_ACTIONS.UPDATE_ADDON:
      const updatedAddOns = [...state];
      updatedAddOns[action.payload.index] = {
        ...updatedAddOns[action.payload.index],
        ...action.payload.addOn,
      };
      return updatedAddOns;
    case ADDON_ACTIONS.REMOVE_ADDON:
      return state.filter((_, index) => index !== action.payload);
    default:
      return state;
  }
}

// Actions for subvariants
interface SubVariantsState {
  subVariants: PastryMaterialSubVariant[];
  availableIngredients: Pick<Ingredient, "id" | "name" | "type">[][]; // one list per subvariant
  availableAddOns: Pick<AddOn, "id" | "name">[][]; // one list per subvariant
}

const SUBVARIANT_ACTIONS = {
  ADD_SUBVARIANT: "addSubVariant",
  UPDATE_SUBVARIANT: "updateSubVariant",
  REMOVE_SUBVARIANT: "removeSubVariant",
  ADD_INGREDIENT_TO_SUBVARIANT: "addIngredientToSubVariant",
  REMOVE_INGREDIENT_FROM_SUBVARIANT: "removeIngredientFromSubVariant",
  UPDATE_INGREDIENT_IN_SUBVARIANT: "updateIngredientInSubVariant",
  ADD_ADDON_TO_SUBVARIANT: "addAddonToSubVariant",
  REMOVE_ADDON_FROM_SUBVARIANT: "removeAddonFromSubVariant",
  UPDATE_ADDON_IN_SUBVARIANT: "updateAddonInSubVariant",
} as const;

type SubVariantAction =
  | {
      type: typeof SUBVARIANT_ACTIONS.ADD_SUBVARIANT;
      payload: Partial<PastryMaterialSubVariant>;
    }
  | {
      type: typeof SUBVARIANT_ACTIONS.UPDATE_SUBVARIANT;
      payload: { index: number; subVariant: Partial<PastryMaterialSubVariant> };
    }
  | { type: typeof SUBVARIANT_ACTIONS.REMOVE_SUBVARIANT; payload: number }
  | {
      type: typeof SUBVARIANT_ACTIONS.ADD_INGREDIENT_TO_SUBVARIANT;
      payload: { index: number; ingredient: PastryMaterialIngredient };
    }
  | {
      type: typeof SUBVARIANT_ACTIONS.REMOVE_INGREDIENT_FROM_SUBVARIANT;
      payload: { subVariantIndex: number; ingredientIndex: number };
    }
  | {
      type: typeof SUBVARIANT_ACTIONS.UPDATE_INGREDIENT_IN_SUBVARIANT;
      payload: {
        subVariantIndex: number;
        ingredientIndex: number;
        ingredient: Partial<PastryMaterialIngredient>;
      };
    }
  | {
      type: typeof SUBVARIANT_ACTIONS.ADD_ADDON_TO_SUBVARIANT;
      payload: { index: number; addOn: PastryMaterialAddOn };
    }
  | {
      type: typeof SUBVARIANT_ACTIONS.REMOVE_ADDON_FROM_SUBVARIANT;
      payload: { subVariantIndex: number; addOnIndex: number };
    }
  | {
      type: typeof SUBVARIANT_ACTIONS.UPDATE_ADDON_IN_SUBVARIANT;
      payload: {
        subVariantIndex: number;
        addOnIndex: number;
        addOn: Partial<PastryMaterialAddOn>;
      };
    };

function subVariantsReducer(state: SubVariantsState, action: SubVariantAction) {
  switch (action.type) {
    case SUBVARIANT_ACTIONS.ADD_SUBVARIANT:
      return {
        ...state,
        subVariants: [
          ...state.subVariants,
          action.payload as PastryMaterialSubVariant,
        ],
        availableIngredients: [...state.availableIngredients, []], // Initialize an empty list for new subvariant
        availableAddOns: [...state.availableAddOns, []], // Initialize an empty list for new subvariant
      };

    case SUBVARIANT_ACTIONS.UPDATE_SUBVARIANT:
      return {
        ...state,
        subVariants: state.subVariants.map((subVariant, index) => {
          if (index === action.payload.index) {
            return { ...subVariant, ...action.payload.subVariant };
          }
          return subVariant;
        }),
      };

    case SUBVARIANT_ACTIONS.REMOVE_SUBVARIANT:
      return {
        ...state,
        subVariants: state.subVariants.filter(
          (_, index) => index !== action.payload
        ),
        availableIngredients: state.availableIngredients.filter(
          (_, index) => index !== action.payload
        ),
        availableAddOns: state.availableAddOns.filter(
          (_, index) => index !== action.payload
        ),
      };

    case SUBVARIANT_ACTIONS.ADD_INGREDIENT_TO_SUBVARIANT:
      return {
        ...state,
        subVariants: state.subVariants.map((subVariant, index) => {
          if (index === action.payload.index) {
            return {
              ...subVariant,
              ingredients: [
                ...subVariant.ingredients,
                action.payload.ingredient,
              ],
            };
          }
          return subVariant;
        }),
      };

    case SUBVARIANT_ACTIONS.REMOVE_INGREDIENT_FROM_SUBVARIANT:
      return {
        ...state,
        subVariants: state.subVariants.map((subVariant, subIndex) => {
          if (subIndex === action.payload.subVariantIndex) {
            return {
              ...subVariant,
              ingredients: subVariant.ingredients.filter(
                (_, ingredientIndex) =>
                  ingredientIndex !== action.payload.ingredientIndex
              ),
            };
          }
          return subVariant;
        }),
      };

    case SUBVARIANT_ACTIONS.UPDATE_INGREDIENT_IN_SUBVARIANT:
      return {
        ...state,
        subVariants: state.subVariants.map((subVariant, subIndex) => {
          if (subIndex === action.payload.subVariantIndex) {
            return {
              ...subVariant,
              ingredients: subVariant.ingredients.map(
                (ingredient, ingredientIndex) => {
                  if (ingredientIndex === action.payload.ingredientIndex) {
                    return { ...ingredient, ...action.payload.ingredient };
                  }
                  return ingredient;
                }
              ),
            };
          }
          return subVariant;
        }),
      };

    case SUBVARIANT_ACTIONS.ADD_ADDON_TO_SUBVARIANT:
      return {
        ...state,
        subVariants: state.subVariants.map((subVariant, index) => {
          if (index === action.payload.index) {
            return {
              ...subVariant,
              addOns: [...subVariant.addOns, action.payload.addOn],
            };
          }
          return subVariant;
        }),
      };

    case SUBVARIANT_ACTIONS.REMOVE_ADDON_FROM_SUBVARIANT:
      return {
        ...state,
        subVariants: state.subVariants.map((subVariant, subIndex) => {
          if (subIndex === action.payload.subVariantIndex) {
            return {
              ...subVariant,
              addOns: subVariant.addOns.filter(
                (_, addOnIndex) => addOnIndex !== action.payload.addOnIndex
              ),
            };
          }
          return subVariant;
        }),
      };

    case SUBVARIANT_ACTIONS.UPDATE_ADDON_IN_SUBVARIANT:
      return {
        ...state,
        subVariants: state.subVariants.map((subVariant, subIndex) => {
          if (subIndex === action.payload.subVariantIndex) {
            return {
              ...subVariant,
              addOns: subVariant.addOns.map((addOn, addOnIndex) => {
                if (addOnIndex === action.payload.addOnIndex) {
                  return { ...addOn, ...action.payload.addOn };
                }
                return addOn;
              }),
            };
          }
          return subVariant;
        }),
      };

    default:
      return state;
  }
}

type PastryMaterialDialogProps = {
  pastryMaterial?: PastryMaterial;
  setPastryMaterial: React.Dispatch<
    React.SetStateAction<Partial<PastryMaterial> | undefined>
  >;
  shape: "round" | "heart" | "rectangle" | "custom";
  mode: string;
  open: boolean;
  onClose: () => void;
};
const PastryMaterialDialog = ({
  pastryMaterial,
  setPastryMaterial,
  shape,
  mode,
  open,
  onClose,
}: PastryMaterialDialogProps) => {
  console.log(pastryMaterial);

  const [ingredients, dispatchIngredients] = useReducer(
    ingredientsReducer,
    pastryMaterial ? pastryMaterial.ingredients : []
  );
  const [addOns, dispatchAddOns] = useReducer(
    addOnsReducer,
    pastryMaterial ? pastryMaterial.addOns : []
  );

  const [tiers, setTiers] = useState<string[]>([]);
  const [sizeHeart, setSizeHeart] = useState<number>(8);
  const [rectangleX, setRectangleX] = useState(12);
  const [rectangleY, setRectangleY] = useState(8);
  const [isCustomPrice, setIsCustomPrice] = useState(
    pastryMaterial?.otherCost.additionalCost ? true : false
  );

  const [fetchedIngredients, setFetchedIngredients] = useState<
    Pick<Ingredient, "id" | "name" | "type">[]
  >([]);
  const [fetchedAddOns, setFetchedAddOns] = useState<
    Pick<AddOn, "id" | "name">[]
  >([]);

  const [availableIngredients, setAvailableIngredients] = useState<
    Pick<Ingredient, "id" | "name" | "type">[]
  >([]);
  const [availableAddOns, setAvailableAddOns] = useState<
    Pick<AddOn, "id" | "name">[]
  >([]);
  const [unitMapping, setUnitMapping] = useState<Record<string, string[]>>();

  const initialState: SubVariantsState = {
    subVariants: [],
    availableIngredients: fetchedIngredients.map(() => [...fetchedIngredients]), // initialize per subvariant
    availableAddOns: fetchedAddOns.map(() => [...fetchedAddOns]), // initialize per subvariant
  };
  const [subVariants, dispatchSubVariants] = useReducer(
    subVariantsReducer,
    initialState
  );

  const availableTiers = [
    '5"x4" (round)',
    '6"x4" (round)',
    '8"x4" (round)',
    '9"x4" (round)',
    '10"x4" (round)',
    '12"x4" (round)',
    '14"x4" (round)',
    '16"x4" (round - dummy)',
    '18"x4" (round - dummy)',
    '20"x4" (round - dummy)',
  ];

  const initialValues: Partial<PastryMaterial> = {
    id: "",
    designId: "",
    otherCost: {
      additionalCost: 0,
      multiplier: 3,
    },
    mainVariantName: "",
    ingredientImportance: [],
  };

  const fetchIngredients = async () => {
    await api.get("ingredients").then((response) => {
      const parsedIngredients: Pick<Ingredient, "id" | "name" | "type">[] =
        response.data.map((ingredient: any) => ({
          id: ingredient.id,
          name: ingredient.name,
          type: ingredient.type,
        }));
      setFetchedIngredients(parsedIngredients);
      setAvailableIngredients(parsedIngredients);
    });
  };

  const fetchAddOns = async () => {
    await api.get("add-ons").then((response) => {
      const parsedAddOns: Pick<AddOn, "id" | "name">[] = response.data.map(
        (addOn: any) => ({
          id: addOn.id,
          name: addOn.addOnName,
        })
      );
      setFetchedAddOns(parsedAddOns);
      setAvailableAddOns(parsedAddOns);
    });
  };

  const fetchUnits = async () => {
    try {
      await api.get("ui-helpers/valid-measurement-values").then((response) => {
        setUnitMapping({
          solid: response.data.Mass,
          liquid: response.data.Volume,
          count: response.data.Count,
        });
      });
    } catch (error) {
      console.error("Error fetching valid measurement units:", error);
    }
  };

  useEffect(() => {
    fetchIngredients();
    fetchAddOns();
    fetchUnits();
  }, []);

  useEffect(() => {
    const filteredIngredients = availableIngredients.filter(
      (availableIngredient) =>
        !ingredients.some(
          (ingredient) => ingredient.id === availableIngredient.id
        )
    );
    setAvailableIngredients(filteredIngredients);
  }, [ingredients]);

  useEffect(() => {
    const filteredAddOns = availableAddOns.filter(
      (availableAddOn) =>
        !addOns.some((addOn) => addOn.id === availableAddOn.id)
    );
    setAvailableAddOns(filteredAddOns);
  }, [addOns]);

  const onSubmit = async () => {
    const payload = {
      ...values,
      ingredients: ingredients,
      addOns: addOns,
    };

    // Make API request with the payload
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    handleBlur,
    setFieldValue,
    setValues,
    resetForm,
    isSubmitting,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: pastryMaterialSchema,
    onSubmit,
  });

  // Sizing
  const handleAddTier = () => {
    if (tiers.length < 6) {
      setTiers((prev) => [...prev, ""]); // Add empty string to tiers
    }
  };

  const handleChangeTier = (index: number, value: string) => {
    setTiers((prev) => {
      const newTiers = [...prev];
      newTiers[index] = value; // Update tier at the specific index

      // Convert the updated `newTiers` array to a CSV string
      const csvString = newTiers.join(", ");

      // Use the CSV string for `setFieldValue`
      setFieldValue("mainVariantName", csvString);
      return newTiers;
    });
  };

  const handleChangeHeart = (event: Event, value: number | number[]) => {
    setSizeHeart(value as number);
    setFieldValue("mainVariantName", String(value));
  };

  const handleChangeRectangle = (dir: string, value: number | number[]) => {
    if (typeof value === "number") {
      switch (dir) {
        case "x":
          setRectangleX(value);
          break;
        case "y":
          setRectangleY(value);
          break;
      }
    }
    setFieldValue("mainVariantName", `${rectangleX}\"x${rectangleY}\"x2.5"`);
  };

  // Pricing
  const handleChangeSwitch = (event: ChangeEvent<HTMLInputElement>) => {
    setIsCustomPrice(event.target.checked);

    event.target.checked ? setFieldValue("otherCosts.multiplier", 2) : null;
  };

  // Ingredients
  const handleAddIngredient = () => {
    if (availableIngredients.length > 0) {
      const newIngredient: PastryMaterialIngredient = {
        id: availableIngredients[0].id,
        name: availableIngredients[0].name,
        type: availableIngredients[0].type,
        ingredientType: "INV",
        amountMeasurement: "",
        amount: 0,
      };
      dispatchIngredients({
        type: INGREDIENT_ACTIONS.ADD_INGREDIENT,
        payload: newIngredient,
      });
    }
  };

  const handleUpdateIngredient = (
    index: number,
    updatedData: Partial<PastryMaterialIngredient>
  ) => {
    dispatchIngredients({
      type: INGREDIENT_ACTIONS.UPDATE_INGREDIENT,
      payload: { index, ingredient: updatedData },
    });
  };

  const handleRemoveIngredient = (index: number) => {
    dispatchIngredients({
      type: INGREDIENT_ACTIONS.REMOVE_INGREDIENT,
      payload: index,
    });
  };

  // Add-Ons
  const handleAddAddOn = () => {
    if (availableAddOns.length > 0) {
      const newAddOn = availableAddOns[0]; // Get the first available add-on or customize logic for selection
      dispatchAddOns({
        type: ADDON_ACTIONS.ADD_ADDON,
        payload: { ...newAddOn, amount: 0 },
      });
    } else {
      console.warn("No available add-ons to add.");
    }
  };

  const handleUpdateAddOn = (
    index: number,
    updatedData: Partial<PastryMaterialAddOn>
  ) => {
    dispatchAddOns({
      type: ADDON_ACTIONS.UPDATE_ADDON,
      payload: { index, addOn: updatedData },
    });
  };

  const handleRemoveAddOn = (index: number) => {
    dispatchAddOns({ type: ADDON_ACTIONS.REMOVE_ADDON, payload: index });
  };

  // SubVariants
  const handleAddSubVariant = () => {
    const newSubVariant: Partial<PastryMaterialSubVariant> = {
      name: "",
      ingredients: [],
      addOns: [],
    };
    dispatchSubVariants({
      type: SUBVARIANT_ACTIONS.ADD_SUBVARIANT,
      payload: newSubVariant,
    });
  };

  const handleUpdateSubVariant = (
    index: number,
    updatedData: Partial<PastryMaterialSubVariant>
  ) => {
    dispatchSubVariants({
      type: SUBVARIANT_ACTIONS.UPDATE_SUBVARIANT,
      payload: { index, subVariant: updatedData },
    });
  };

  const handleRemoveSubVariant = (index: number) => {
    dispatchSubVariants({
      type: SUBVARIANT_ACTIONS.REMOVE_SUBVARIANT,
      payload: index,
    });
  };

  // Updated to account for subvariant-specific available ingredients
  const handleAddIngredientToSubVariant = (index: number) => {
    const availableForSubVariant = subVariants.availableIngredients[index]; // Use subVariantsState
    if (availableForSubVariant.length > 0) {
      const newIngredient: PastryMaterialIngredient = {
        id: availableForSubVariant[0].id,
        name: availableForSubVariant[0].name,
        type: availableForSubVariant[0].type,
        ingredientType: "INV",
        amountMeasurement: "",
        amount: 0,
      };
      dispatchSubVariants({
        type: SUBVARIANT_ACTIONS.ADD_INGREDIENT_TO_SUBVARIANT,
        payload: { index, ingredient: newIngredient },
      });
    }
  };

  const handleUpdateIngredientInSubVariant = (
    subVariantIndex: number,
    ingredientIndex: number,
    updatedData: Partial<PastryMaterialIngredient>
  ) => {
    dispatchSubVariants({
      type: SUBVARIANT_ACTIONS.UPDATE_INGREDIENT_IN_SUBVARIANT,
      payload: { subVariantIndex, ingredientIndex, ingredient: updatedData },
    });
  };

  const handleRemoveIngredientFromSubVariant = (
    subVariantIndex: number,
    ingredientIndex: number
  ) => {
    dispatchSubVariants({
      type: SUBVARIANT_ACTIONS.REMOVE_INGREDIENT_FROM_SUBVARIANT,
      payload: { subVariantIndex, ingredientIndex },
    });
  };

  // Updated to account for subvariant-specific available add-ons
  const handleAddAddOnToSubVariant = (index: number) => {
    const availableForSubVariant = subVariants.availableAddOns[index]; // Use subVariantsState
    if (availableForSubVariant.length > 0) {
      const newAddOn: PastryMaterialAddOn = {
        id: availableForSubVariant[0].id,
        name: availableForSubVariant[0].name,
        amount: 0,
      };
      dispatchSubVariants({
        type: SUBVARIANT_ACTIONS.ADD_ADDON_TO_SUBVARIANT,
        payload: { index, addOn: newAddOn },
      });
    }
  };

  const handleUpdateAddOnInSubVariant = (
    subVariantIndex: number,
    addOnIndex: number,
    updatedData: Partial<PastryMaterialAddOn>
  ) => {
    dispatchSubVariants({
      type: SUBVARIANT_ACTIONS.UPDATE_ADDON_IN_SUBVARIANT,
      payload: { subVariantIndex, addOnIndex, addOn: updatedData },
    });
  };

  const handleRemoveAddOnFromSubVariant = (
    subVariantIndex: number,
    addOnIndex: number
  ) => {
    dispatchSubVariants({
      type: SUBVARIANT_ACTIONS.REMOVE_ADDON_FROM_SUBVARIANT,
      payload: { subVariantIndex, addOnIndex },
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{`${
        mode === "edit" ? "Edit" : "Add"
      } Materials List`}</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h3">{"Smallest Size"}</Typography>
              <Typography variant="subtitle2">
                {
                  "Contains the base ingredients and add-ons, when any other size's ingredient is subtracted to the inventory, the base ingredients also gets subtracted."
                }
              </Typography>
              <Typography variant="subtitle2">
                {
                  "Therefore, it is recommended to put the smallest size of the design as the base size."
                }
              </Typography>
            </Box>

            {/* Sizing based on shape */}
            {shape === "round" ? (
              <>
                <List>
                  {tiers.map((tier, index) => (
                    <ListItem key={`tier-${index}`}>
                      <FormControl fullWidth>
                        <InputLabel id={`tier-select-label-${index}`}>
                          Select Tier
                        </InputLabel>
                        <Select
                          labelId={`tier-select-label-${index}`}
                          label="Select Tier"
                          value={tier}
                          onChange={(e) =>
                            handleChangeTier(index, e.target.value)
                          }
                        >
                          {availableTiers.map((availableTier, i) => (
                            <MenuItem key={i} value={availableTier}>
                              {availableTier}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <IconButton
                        color="error"
                        onClick={() => {
                          setTiers((prevTiers) =>
                            prevTiers.filter((_, i) => i !== index)
                          );
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                  {tiers.length < 6 ? (
                    <ListItem key="insertTier" onClick={handleAddTier}>
                      <IconButton>
                        <AddIcon />
                      </IconButton>
                      <ListItemText primary="Insert Tier" />
                    </ListItem>
                  ) : null}
                </List>
              </>
            ) : null}
            {shape === "heart" ? (
              <>
                <Typography variant="h4">{`Size: ${values.mainVariantName}`}</Typography>
                <Slider
                  id="mainVariantName"
                  name="mainVariantName"
                  value={sizeHeart}
                  onChange={handleChangeHeart}
                  defaultValue={8}
                  valueLabelDisplay="auto"
                  shiftStep={5}
                  step={1}
                  marks
                  min={6}
                  max={10}
                />
              </>
            ) : null}
            {shape === "rectangle" ? (
              <>
                <Typography variant="h4">{"Size"}</Typography>
                <Typography variant="h5">{values.mainVariantName}</Typography>
                <Slider
                  value={rectangleX}
                  onChange={(event, value) => handleChangeRectangle("x", value)}
                  defaultValue={12}
                  valueLabelDisplay="auto"
                  shiftStep={5}
                  step={1}
                  marks
                  min={9}
                  max={16}
                />
                <Slider
                  value={rectangleY}
                  onChange={(event, value) => handleChangeRectangle("y", value)}
                  defaultValue={12}
                  valueLabelDisplay="auto"
                  shiftStep={5}
                  step={1}
                  marks
                  min={5}
                  max={12}
                />
              </>
            ) : null}
            {shape === "custom" ? (
              <TextField
                label="Size"
                id="mainVariantName"
                name="mainVariantName"
                value={values.mainVariantName}
                onChange={handleChange}
                fullWidth
              ></TextField>
            ) : null}

            {/* Pricing */}
            <Box>
              <Typography variant="h3">{"Pricing"}</Typography>
              <Typography variant="subtitle2">
                {"Pricing is only reflected by the last saved materials list."}
              </Typography>
              <Typography variant="subtitle2">
                {
                  "If there were any changes, please save first to validate the pricing from the server."
                }
              </Typography>
            </Box>
            {pastryMaterial && values.otherCost ? (
              <>
                <Typography variant="h4">{`Multiplier: ${
                  values.otherCost.multiplier
                }x (${toCurrency(
                  pastryMaterial.costExactEstimate * values.otherCost.multiplier
                )})`}</Typography>
                <Slider
                  disabled={isCustomPrice}
                  id="multiplier"
                  name="multiplier"
                  value={values.otherCost.multiplier}
                  onChange={(event, newValue) => {
                    setFieldValue("otherCost.multiplier", newValue);
                  }}
                  defaultValue={3}
                  valueLabelDisplay="auto"
                  shiftStep={1}
                  step={0.1}
                  min={2}
                  max={5}
                />
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="h4">{"Custom"}</Typography>
                  <Switch
                    checked={isCustomPrice}
                    onChange={handleChangeSwitch}
                  />
                </Stack>
                {isCustomPrice ? (
                  <TextField
                    label="Custom Additional Cost"
                    id="additionalCost"
                    name="additionalCost"
                    type="number"
                    value={values.otherCost.additionalCost}
                    onChange={handleChange}
                    slotProps={{ htmlInput: { min: 0 } }}
                  />
                ) : null}
              </>
            ) : (
              "Please save design first to get price calculation"
            )}

            {/* Ingredients */}
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h3">{"Main Ingredients"}</Typography>
              <Button
                color="primary"
                variant="contained"
                size="small"
                onClick={handleAddIngredient}
              >
                <AddIcon />
                Add
              </Button>
            </Stack>
            <Stack spacing={1}>
              {ingredients.map((ingredient, index) => {
                const optionsIngredients = [
                  ingredient,
                  ...availableIngredients.filter(
                    (availableIngredient) =>
                      availableIngredient.id !== ingredient.id
                  ),
                ];

                // Find the corresponding fetched ingredient by ID
                const fetchedIngredient = fetchedIngredients.find(
                  (fetched) => fetched.id === ingredient.id
                );

                // Get the type from fetchedIngredient if it exists
                const ingredientType = fetchedIngredient
                  ? fetchedIngredient.type
                  : null;

                // Spread the unitMapping to get the correct measurement options
                const optionsMeasurements =
                  ingredientType && unitMapping
                    ? unitMapping[ingredientType] // Use the type from fetchedIngredient
                    : [];

                return (
                  <Stack
                    direction="row"
                    spacing={1}
                    key={`ingredient-stack-${index}`}
                  >
                    <FormControl
                      fullWidth
                      key={`select-ingredient-form-${index}`}
                      size="small"
                    >
                      <Select
                        labelId={`select-ingredient-${index}`}
                        id={`select-ingredient-${index}`}
                        value={ingredient.id} // Use the current ingredient ID directly
                        onChange={(e) =>
                          handleUpdateIngredient(index, { id: e.target.value })
                        }
                      >
                        {optionsIngredients.map((optionIngredient) => (
                          <MenuItem
                            key={optionIngredient.id}
                            value={optionIngredient.id}
                          >
                            {optionIngredient.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl
                      fullWidth
                      key={`select-ingredient-measurement-form-${index}`}
                      size="small"
                    >
                      <Select
                        labelId={`select-ingredient-measurement-${index}`}
                        id={`select-ingredient-measurement-${index}`}
                        value={ingredient.amountMeasurement} // Correct field for measurement
                        onChange={(e) =>
                          handleUpdateIngredient(index, {
                            amountMeasurement: e.target.value,
                          })
                        }
                      >
                        {optionsMeasurements.map((measurement) => {
                          return (
                            <MenuItem key={measurement} value={measurement}>
                              {measurement}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>

                    <TextField
                      id={`ingredient-amount-${index}`}
                      label="Amount"
                      type="number"
                      value={ingredient.amount} // Make sure you handle this value
                      onChange={(e) =>
                        handleUpdateIngredient(index, {
                          amount: Number(e.target.value),
                        })
                      }
                      slotProps={{ htmlInput: { min: 0 } }}
                      size="small"
                    />

                    <IconButton
                      color="error"
                      onClick={() => handleRemoveIngredient(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                );
              })}
            </Stack>

            {/* Add-Ons */}
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h3">{"Main Add-Ons"}</Typography>
              <Button
                color="primary"
                variant="contained"
                size="small"
                onClick={handleAddAddOn}
              >
                <AddIcon />
                Add
              </Button>
            </Stack>
            <Stack spacing={1}>
              {addOns.map((addOn, index) => {
                const optionsAddOns = [
                  addOn,
                  ...availableAddOns.filter(
                    (availableAddOn) => availableAddOn.id !== addOn.id
                  ),
                ];

                return (
                  <Stack
                    direction="row"
                    spacing={1}
                    key={`add-on-stack-${index}`}
                  >
                    <FormControl
                      fullWidth
                      key={`select-add-on-form-${index}`}
                      size="small"
                    >
                      <Select
                        labelId={`select-add-on-${index}`}
                        id={`select-add-on-${index}`}
                        value={addOn.id} // Use the current ingredient ID directly
                        onChange={(e) =>
                          handleUpdateAddOn(index, {
                            id: e.target.value as number,
                          })
                        }
                      >
                        {optionsAddOns.map((optionsAddOn) => (
                          <MenuItem
                            key={optionsAddOn.id}
                            value={optionsAddOn.id}
                          >
                            {optionsAddOn.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      id={`ingredient-amount-${index}`}
                      label="Amount"
                      type="number"
                      value={addOn.amount} // Make sure you handle this value
                      onChange={(e) =>
                        handleUpdateAddOn(index, {
                          amount: Number(e.target.value),
                        })
                      }
                      slotProps={{ htmlInput: { min: 0 } }}
                      size="small"
                    />

                    <IconButton
                      color="error"
                      onClick={() => handleRemoveAddOn(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                );
              })}
            </Stack>

            {/* Subvariants */}
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h3">{"Other Sizes"}</Typography>
              <Button
                color="primary"
                variant="contained"
                size="small"
                onClick={handleAddSubVariant}
              >
                <AddIcon />
                Add
              </Button>
            </Stack>

            <Stack spacing={2}>
              {subVariants.map((subVariant, subIndex) => (
                <Box key={`subvariant-${subIndex}`}>
                  <Stack spacing={2}>
                    {/* Subvariant Name */}
                    <TextField
                      label="Subvariant Name"
                      value={subVariant.name}
                      onChange={(e) =>
                        handleUpdateSubVariant(subIndex, {
                          name: e.target.value,
                        })
                      }
                      fullWidth
                      size="small"
                    />

                    {/* Subvariant Ingredients */}
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h5">Ingredients</Typography>
                      <Button
                        color="primary"
                        variant="contained"
                        size="small"
                        onClick={() =>
                          handleAddIngredientToSubVariant(subIndex)
                        }
                      >
                        <AddIcon />
                        Add
                      </Button>
                    </Stack>

                    <Stack spacing={1}>
                      {subVariant.ingredients.map(
                        (ingredient, ingredientIndex) => {
                          // Fetch the specific available ingredients for this subvariant
                          const optionsIngredients = [
                            ingredient,
                            ...availableIngredients[subIndex].filter(
                              (availableIngredient) =>
                                availableIngredient.id !== ingredient.id
                            ),
                          ];

                          const fetchedIngredient = fetchedIngredients.find(
                            (fetched) => fetched.id === ingredient.id
                          );
                          const ingredientType = fetchedIngredient
                            ? fetchedIngredient.type
                            : null;
                          const optionsMeasurements =
                            ingredientType && unitMapping
                              ? unitMapping[ingredientType]
                              : [];

                          return (
                            <Stack
                              direction="row"
                              spacing={1}
                              key={`subvariant-ingredient-${ingredientIndex}`}
                            >
                              {/* Ingredient Selection */}
                              <FormControl fullWidth size="small">
                                <Select
                                  value={ingredient.id}
                                  onChange={(e) =>
                                    handleUpdateIngredientInSubVariant(
                                      subIndex,
                                      ingredientIndex,
                                      {
                                        id: e.target.value,
                                      }
                                    )
                                  }
                                >
                                  {optionsIngredients.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                      {option.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>

                              {/* Measurement */}
                              <FormControl fullWidth size="small">
                                <Select
                                  value={ingredient.amountMeasurement}
                                  onChange={(e) =>
                                    handleUpdateIngredientInSubVariant(
                                      subIndex,
                                      ingredientIndex,
                                      {
                                        amountMeasurement: e.target.value,
                                      }
                                    )
                                  }
                                >
                                  {optionsMeasurements.map((measurement) => (
                                    <MenuItem
                                      key={measurement}
                                      value={measurement}
                                    >
                                      {measurement}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>

                              {/* Amount */}
                              <TextField
                                label="Amount"
                                type="number"
                                value={ingredient.amount}
                                onChange={(e) =>
                                  handleUpdateIngredientInSubVariant(
                                    subIndex,
                                    ingredientIndex,
                                    {
                                      amount: Number(e.target.value),
                                    }
                                  )
                                }
                                size="small"
                              />

                              <IconButton
                                color="error"
                                onClick={() =>
                                  handleRemoveIngredientFromSubVariant(
                                    subIndex,
                                    ingredientIndex
                                  )
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Stack>
                          );
                        }
                      )}
                    </Stack>

                    {/* Subvariant Add-Ons */}
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h5">Add-Ons</Typography>
                      <Button
                        color="primary"
                        variant="contained"
                        size="small"
                        onClick={() => handleAddAddOnToSubVariant(subIndex)}
                      >
                        <AddIcon />
                        Add
                      </Button>
                    </Stack>

                    <Stack spacing={1}>
                      {subVariant.addOns.map((addOn, addOnIndex) => {
                        // Fetch the specific available add-ons for this subvariant
                        const optionsAddOns = [
                          addOn,
                          ...availableAddOns[subIndex].filter(
                            (availableAddOn) => availableAddOn.id !== addOn.id
                          ),
                        ];

                        return (
                          <Stack
                            direction="row"
                            spacing={1}
                            key={`subvariant-addon-${addOnIndex}`}
                          >
                            {/* Add-On Selection */}
                            <FormControl fullWidth size="small">
                              <Select
                                value={addOn.id}
                                onChange={(e) =>
                                  handleUpdateAddOnInSubVariant(
                                    subIndex,
                                    addOnIndex,
                                    {
                                      id: e.target.value as number,
                                    }
                                  )
                                }
                              >
                                {optionsAddOns.map((option) => (
                                  <MenuItem key={option.id} value={option.id}>
                                    {option.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            {/* Add-On Amount */}
                            <TextField
                              label="Amount"
                              type="number"
                              value={addOn.amount}
                              onChange={(e) =>
                                handleUpdateAddOnInSubVariant(
                                  subIndex,
                                  addOnIndex,
                                  {
                                    amount: Number(e.target.value),
                                  }
                                )
                              }
                              size="small"
                            />

                            <IconButton
                              color="error"
                              onClick={() =>
                                handleRemoveAddOnFromSubVariant(
                                  subIndex,
                                  addOnIndex
                                )
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Stack>
                        );
                      })}
                    </Stack>

                    {/* Remove Subvariant */}
                    <Button
                      color="error"
                      variant="contained"
                      size="small"
                      onClick={() => handleRemoveSubVariant(subIndex)}
                    >
                      Remove Subvariant
                    </Button>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          {pastryMaterial ? (
            <Button onClick={onClose}>{"Save without Closing"}</Button>
          ) : null}
          <Button onClick={onClose}>{"Cancel"}</Button>
          <Button variant="contained">{"Apply"}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PastryMaterialDialog;
