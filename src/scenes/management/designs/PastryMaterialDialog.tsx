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
  PastryMaterialVariant,
} from "../../../utils/Schemas";
import { ChangeEvent, useEffect, useReducer, useState } from "react";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import api from "../../../api/axiosConfig";
import { toCurrency } from "../../../utils/Formatter";

interface PastryMaterialState {
  values: {
    variants: PastryMaterialVariant[];
    otherCost: { additionalCost: number; multiplier: number };
  };
  variantsToDelete: string[];
  ingredientsToDelete: string[];
  addOnsToDelete: string[];
}

const ACTIONS = {
  ADD_VARIANT: "addVariant",
  UPDATE_VARIANT: "updateVariant",
  REMOVE_VARIANT: "removeVariant",
  ADD_INGREDIENT_TO_VARIANT: "addIngredientToVariant",
  REMOVE_INGREDIENT_FROM_VARIANT: "removeIngredientFromVariant",
  UPDATE_INGREDIENT_IN_VARIANT: "updateIngredientInVariant",
  ADD_ADDON_TO_VARIANT: "addAddonToVariant",
  REMOVE_ADDON_FROM_VARIANT: "removeAddonFromVariant",
  UPDATE_ADDON_IN_VARIANT: "updateAddonInVariant",
  MARK_VARIANT_FOR_DELETION: "markVariantForDeletion",
  MARK_INGREDIENT_FOR_DELETION: "markIngredientForDeletion",
  MARK_ADDON_FOR_DELETION: "markAddonForDeletion",
  UPDATE_PASTRY_MATERIAL: "updatePastryMaterial",
} as const;

interface VariantAction {
  type: string;
  payload?: any; // This should be more specific if possible
}

// type VariantAction =
//   | {
//       type: typeof ACTIONS.ADD_VARIANT;
//       payload: Partial<PastryMaterialVariant>;
//     }
//   | {
//       type: typeof ACTIONS.UPDATE_VARIANT;
//       payload: { index: number; variant: Partial<PastryMaterialVariant> };
//     }
//   | { type: typeof ACTIONS.REMOVE_VARIANT; payload: number }
//   | {
//       type: typeof ACTIONS.ADD_INGREDIENT_TO_VARIANT;
//       payload: { index: number; ingredient: Partial<PastryMaterialIngredient> };
//     }
//   | {
//       type: typeof ACTIONS.REMOVE_INGREDIENT_FROM_VARIANT;
//       payload: { variantIndex: number; ingredientIndex: number };
//     }
//   | {
//       type: typeof ACTIONS.UPDATE_INGREDIENT_IN_VARIANT;
//       payload: {
//         variantIndex: number;
//         ingredientIndex: number;
//         ingredient: Partial<PastryMaterialIngredient>;
//       };
//     }
//   | {
//       type: typeof ACTIONS.ADD_ADDON_TO_VARIANT;
//       payload: { index: number; addOn: Partial<PastryMaterialAddOn> };
//     }
//   | {
//       type: typeof ACTIONS.REMOVE_ADDON_FROM_VARIANT;
//       payload: { variantIndex: number; addOnIndex: number };
//     }
//   | {
//       type: typeof ACTIONS.UPDATE_ADDON_IN_VARIANT;
//       payload: {
//         variantIndex: number;
//         addOnIndex: number;
//         addOn: Partial<PastryMaterialAddOn>;
//       };
//     }
//   | { type: typeof ACTIONS.MARK_VARIANT_FOR_DELETION; payload: number }
//   | {
//       type: typeof ACTIONS.MARK_INGREDIENT_FOR_DELETION;
//       payload: { variantIndex: number; ingredientIndex: number };
//     }
//   | {
//       type: typeof ACTIONS.MARK_ADDON_FOR_DELETION;
//       payload: { variantIndex: number; addOnIndex: number };
//     }
//   | {
//       type: typeof ACTIONS.UPDATE_PASTRY_MATERIAL;
//       payload: Partial<Pick<PastryMaterial, "otherCost">>;
//     };

function reducer(state: PastryMaterialState, action: VariantAction) {
  switch (action.type) {
    // Add a new variant
    case ACTIONS.ADD_VARIANT:
      return {
        ...state,
        values: {
          ...state.values,
          variants: [
            ...state.values.variants,
            action.payload as PastryMaterialVariant,
          ],
        },
      };

    // Update an existing variant
    case ACTIONS.UPDATE_VARIANT:
      return {
        ...state,
        values: {
          ...state.values,
          variants: state.values.variants.map((variant, index) => {
            if (index === action.payload.index) {
              return { ...variant, ...action.payload.variant };
            }
            return variant;
          }),
        },
      };

    // Update pastry material top-level properties like "otherCost"
    case ACTIONS.UPDATE_PASTRY_MATERIAL:
      return {
        ...state,
        values: {
          ...state.values,
          otherCost: {
            ...state.values.otherCost,
            ...action.payload.otherCost,
          },
        },
      };

    // Remove a variant (mark for deletion if already exists, otherwise remove from state)
    case ACTIONS.REMOVE_VARIANT:
      const variantToRemove = state.values.variants[action.payload];
      const variantId = variantToRemove.id;

      return {
        ...state,
        values: {
          ...state.values,
          variants: state.values.variants.filter(
            (_, index) => index !== action.payload
          ),
        },
        variantsToDelete: variantId
          ? [...state.variantsToDelete, variantId]
          : state.variantsToDelete,
      };

    // Add an ingredient to a variant
    case ACTIONS.ADD_INGREDIENT_TO_VARIANT:
      return {
        ...state,
        values: {
          ...state.values,
          variants: state.values.variants.map((variant, index) => {
            if (index === action.payload.index) {
              return {
                ...variant,
                ingredients: [
                  ...variant.ingredients,
                  action.payload.ingredient,
                ],
              };
            }
            return variant;
          }),
        },
      };

    // Remove an ingredient from a variant
    case ACTIONS.REMOVE_INGREDIENT_FROM_VARIANT:
      return {
        ...state,
        values: {
          ...state.values,
          variants: state.values.variants.map((variant, index) => {
            if (index === action.payload.variantIndex) {
              return {
                ...variant,
                ingredients: variant.ingredients.filter(
                  (_, i) => i !== action.payload.ingredientIndex
                ),
              };
            }
            return variant;
          }),
        },
      };

    // Mark ingredient for deletion without removing from state
    case ACTIONS.MARK_INGREDIENT_FOR_DELETION:
      const ingredientToMark =
        state.values.variants[action.payload.variantIndex].ingredients[
          action.payload.ingredientIndex
        ];

      return {
        ...state,
        ingredientsToDelete: ingredientToMark.relationId
          ? [...state.ingredientsToDelete, ingredientToMark.relationId]
          : state.ingredientsToDelete,
      };

    // Update an ingredient in a variant
    case ACTIONS.UPDATE_INGREDIENT_IN_VARIANT:
      return {
        ...state,
        values: {
          ...state.values,
          variants: state.values.variants.map((variant, index) => {
            if (index === action.payload.variantIndex) {
              return {
                ...variant,
                ingredients: variant.ingredients.map((ingredient, i) => {
                  if (i === action.payload.ingredientIndex) {
                    return {
                      ...ingredient,
                      ...action.payload.ingredient,
                    };
                  }
                  return ingredient;
                }),
              };
            }
            return variant;
          }),
        },
      };

    // Add an add-on to a variant
    case ACTIONS.ADD_ADDON_TO_VARIANT:
      return {
        ...state,
        values: {
          ...state.values,
          variants: state.values.variants.map((variant, index) => {
            if (index === action.payload.index) {
              return {
                ...variant,
                addOns: [...variant.addOns, action.payload.addOn],
              };
            }
            return variant;
          }),
        },
      };

    // Remove an add-on from a variant
    case ACTIONS.REMOVE_ADDON_FROM_VARIANT:
      return {
        ...state,
        values: {
          ...state.values,
          variants: state.values.variants.map((variant, index) => {
            if (index === action.payload.variantIndex) {
              return {
                ...variant,
                addOns: variant.addOns.filter(
                  (_, i) => i !== action.payload.addOnIndex
                ),
              };
            }
            return variant;
          }),
        },
      };

    // Mark add-on for deletion without removing from state
    case ACTIONS.MARK_ADDON_FOR_DELETION:
      const addOnToMark =
        state.values.variants[action.payload.variantIndex].addOns[
          action.payload.addOnIndex
        ];

      return {
        ...state,
        addOnsToDelete: addOnToMark.relationId
          ? [...state.addOnsToDelete, addOnToMark.relationId]
          : state.addOnsToDelete,
      };

    // Update an add-on in a variant
    case ACTIONS.UPDATE_ADDON_IN_VARIANT:
      return {
        ...state,
        values: {
          ...state.values,
          variants: state.values.variants.map((variant, index) => {
            if (index === action.payload.variantIndex) {
              return {
                ...variant,
                addOns: variant.addOns.map((addOn, i) => {
                  if (i === action.payload.addOnIndex) {
                    return {
                      ...addOn,
                      ...action.payload.addOn,
                    };
                  }
                  return addOn;
                }),
              };
            }
            return variant;
          }),
        },
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
  // Initial state for PastryMaterial
  const initialState: PastryMaterialState = {
    values: {
      variants: pastryMaterial?.variants ?? [],
      otherCost: {
        additionalCost: pastryMaterial?.otherCost.additionalCost ?? 0,
        multiplier: pastryMaterial?.otherCost.multiplier ?? 2,
      },
    },
    variantsToDelete: [],
    ingredientsToDelete: [],
    addOnsToDelete: [],
  };
  // console.log("PM::");
  // console.log(pastryMaterial);

  const [pmState, dispatch] = useReducer(reducer, initialState);
  // console.log("STATE::");
  // console.log(pmState);

  const [tiers, setTiers] = useState<string[]>([]);
  const [sizeHeart, setSizeHeart] = useState<number>(8);
  const [rectangleX, setRectangleX] = useState(12);
  const [rectangleY, setRectangleY] = useState(8);
  const [isCustomPrice, setIsCustomPrice] = useState(
    pmState.values.otherCost.additionalCost ? true : false
  );

  const [fetchedIngredients, setFetchedIngredients] = useState<
    Pick<Ingredient, "id" | "name" | "type">[]
  >([]);
  const [fetchedAddOns, setFetchedAddOns] = useState<
    Pick<AddOn, "id" | "name">[]
  >([]);
  const [unitMapping, setUnitMapping] = useState<Record<string, string[]>>();

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

  const fetchIngredients = async () => {
    await api.get("ingredients").then((response) => {
      const parsedIngredients: Pick<Ingredient, "id" | "name" | "type">[] =
        response.data.map((ingredient: any) => ({
          id: ingredient.id,
          name: ingredient.name,
          type: ingredient.type,
        }));
      setFetchedIngredients(parsedIngredients);
    });
  };

  const fetchAddOns = async () => {
    await api.get("add-ons").then((response) => {
      const parsedAddOns: Pick<AddOn, "id" | "name">[] = response.data.map(
        (addOn: any) => ({
          id: String(addOn.id),
          name: addOn.addOnName,
        })
      );
      setFetchedAddOns(parsedAddOns);
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

  const onSubmit = async () => {
    // const payload = {
    //   ...values,
    //   ingredients: ingredients,
    //   addOns: addOns,
    // };
    // Make API request with the payload
  };

  // Sizing
  // const handleAddTier = () => {
  //   if (tiers.length < 6) {
  //     setTiers((prev) => [...prev, ""]); // Add empty string to tiers
  //   }
  // };

  // const handleChangeTier = (index: number, value: string) => {
  //   setTiers((prev) => {
  //     const newTiers = [...prev];
  //     newTiers[index] = value; // Update tier at the specific index

  //     // Convert the updated `newTiers` array to a CSV string
  //     const csvString = newTiers.join(", ");

  //     // Use the CSV string for `setFieldValue`
  //     setFieldValue("mainVariantName", csvString);
  //     return newTiers;
  //   });
  // };

  // const handleChangeHeart = (event: Event, value: number | number[]) => {
  //   setSizeHeart(value as number);
  //   setFieldValue("mainVariantName", String(value));
  // };

  // const handleChangeRectangle = (dir: string, value: number | number[]) => {
  //   if (typeof value === "number") {
  //     switch (dir) {
  //       case "x":
  //         setRectangleX(value);
  //         break;
  //       case "y":
  //         setRectangleY(value);
  //         break;
  //     }
  //   }
  //   setFieldValue("mainVariantName", `${rectangleX}\"x${rectangleY}\"x2.5"`);
  // };

  // Pricing
  const handleChangeSwitch = (event: ChangeEvent<HTMLInputElement>) => {
    setIsCustomPrice(event.target.checked);
    if (event.target.checked) {
      dispatch({
        type: ACTIONS.UPDATE_PASTRY_MATERIAL,
        payload: { otherCost: { additionalCost: 0, multiplier: 2 } },
      });
    }
  };

  // Ingredients
  const handleAddIngredient = (variantIndex: number) => {
    const availableIngredients = fetchedIngredients.filter(
      (ingredient) =>
        !pmState.values.variants[variantIndex].ingredients.some(
          (variantIngredient: PastryMaterialIngredient) =>
            variantIngredient.id === ingredient.id
        )
    );

    if (availableIngredients.length > 0) {
      const ingredientToAdd = availableIngredients[0];

      // Determine the default measurement based on the ingredient type
      let defaultMeasurement = "";
      if (ingredientToAdd.type === "solid") {
        defaultMeasurement = "Gram"; // Assign the first valid solid unit
      } else if (ingredientToAdd.type === "liquid") {
        defaultMeasurement = "Milliliter"; // Assign the first valid liquid unit
      } else if (ingredientToAdd.type === "count") {
        defaultMeasurement = "Piece"; // Assign the first valid count unit
      }

      dispatch({
        type: ACTIONS.ADD_INGREDIENT_TO_VARIANT,
        payload: {
          index: variantIndex,
          ingredient: {
            ...ingredientToAdd,
            amount: 0,
            measurement: defaultMeasurement, // Assign based on the type
            ingredientType: "INV",
          },
        },
      });
      console.log("NEW::");

      console.log({
        ...ingredientToAdd,
        amount: 0,
        measurement: defaultMeasurement, // Assign based on the type
        ingredientType: "INV",
      });
      console.log("OLD::");
      console.log(pmState.values.variants[variantIndex].ingredients);
    }
  };
  const handleUpdateIngredient = () => {};

  const handleRemoveIngredient = (
    variantIndex: number,
    ingredientIndex: number
  ) => {
    const ingredient =
      pmState.values.variants[variantIndex].ingredients[ingredientIndex];

    dispatch({
      type: ACTIONS.REMOVE_INGREDIENT_FROM_VARIANT,
      payload: { variantIndex, ingredientIndex },
    });

    if (ingredient.relationId) {
      dispatch({
        type: ACTIONS.MARK_INGREDIENT_FOR_DELETION,
        payload: { variantIndex, ingredientIndex },
      });
    }
    console.log(pmState.values.variants[variantIndex].ingredients);
  };

  // Add-Ons
  const handleAddAddOn = (variantIndex: number) => {
    const availableAddOns = fetchedAddOns.filter(
      (addOn) =>
        !pmState.values.variants[variantIndex].addOns.some(
          (variantAddOn: PastryMaterialAddOn) => variantAddOn.id === addOn.id
        )
    );

    if (availableAddOns.length > 0) {
      dispatch({
        type: ACTIONS.ADD_ADDON_TO_VARIANT,
        payload: { index: variantIndex, addOn: availableAddOns[0] },
      });
    }
  };

  const handleUpdateAddOn = () => {};

  const handleRemoveAddOn = (variantIndex: number, addOnIndex: number) => {
    const addOn = pmState.values.variants[variantIndex].addOns[addOnIndex];

    dispatch({
      type: ACTIONS.REMOVE_ADDON_FROM_VARIANT,
      payload: { variantIndex, addOnIndex },
    });

    if (addOn.relationId) {
      dispatch({
        type: ACTIONS.MARK_ADDON_FOR_DELETION,
        payload: { variantIndex, addOnIndex },
      });
    }
  };

  // Variants
  const handleAddVariant = () => {
    dispatch({
      type: ACTIONS.ADD_VARIANT,
      payload: {
        id: "", // Generate unique ID
        name: "",
        costEstimate: 0,
        costExactEstimate: 0,
        ingredients: [],
        addOns: [],
        inStock: true,
        created: new Date(),
        lastModified: new Date(),
      },
    });
  };

  const handleUpdateVariant = (
    variantIndex: number,
    updatedData: Partial<PastryMaterialVariant>
  ) => {
    dispatch({
      type: ACTIONS.UPDATE_VARIANT,
      payload: { index: variantIndex, variant: updatedData },
    });
  };

  const handleRemoveVariant = (variantIndex: number) => {
    const variant = pmState.values.variants[variantIndex];
    dispatch({
      type: ACTIONS.REMOVE_VARIANT,
      payload: variantIndex,
    });

    if (variant.id) {
      dispatch({
        type: ACTIONS.MARK_VARIANT_FOR_DELETION,
        payload: variantIndex,
      });
    }
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
                          // onChange={(e) =>
                          //   handleChangeTier(index, e.target.value)
                          // }
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
                    <ListItem
                      key="insertTier"
                      // onClick={handleAddTier}
                    >
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
                <Typography variant="h4">{`Size: ${pmState.values.variants[0].name}`}</Typography>
                <Slider
                  id="sizeHeart"
                  name="sizeHeart"
                  value={sizeHeart}
                  // onChange={handleChangeHeart}
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
                <Typography variant="h4">{`Size: ${pmState.values.variants[0].name}`}</Typography>
                <Slider
                  value={rectangleX}
                  // onChange={(event, value) => handleChangeRectangle("x", value)}
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
                  // onChange={(event, value) => handleChangeRectangle("y", value)}
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
                id="size"
                name="size"
                value={pmState.values.variants[0].name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  dispatch({
                    type: ACTIONS.UPDATE_VARIANT,
                    payload: { index: 0, variant: { name: e.target.value } },
                  });
                }}
                fullWidth
              />
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
            {pmState.values.otherCost &&
            pmState.values.variants[0].costExactEstimate ? (
              <>
                <Typography variant="h4">
                  {`Multiplier: ${
                    pmState.values.otherCost.multiplier
                  }x (${toCurrency(
                    pmState.values.variants[0].costExactEstimate *
                      pmState.values.otherCost.multiplier
                  )})`}
                </Typography>
                <Slider
                  disabled={isCustomPrice}
                  id="multiplier"
                  name="multiplier"
                  value={pmState.values.otherCost.multiplier}
                  onChange={(e: Event, v: number | number[]) => {
                    dispatch({
                      type: ACTIONS.UPDATE_PASTRY_MATERIAL,
                      payload: {
                        otherCost: {
                          additionalCost: 0,
                          multiplier: v as number,
                        },
                      },
                    });
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
                    value={pmState.values.otherCost.additionalCost}
                    onChange={(e) =>
                      dispatch({
                        type: ACTIONS.UPDATE_PASTRY_MATERIAL,
                        payload: {
                          otherCost: {
                            additionalCost: Number(e.target.value),
                            multiplier: 2,
                          },
                        },
                      })
                    }
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
                startIcon={<AddIcon />}
                onClick={() => handleAddIngredient(0)}
              >
                {"Add"}
              </Button>
            </Stack>
            <Stack spacing={1}>
              {pmState.values.variants[0].ingredients.map(
                (
                  ingredient: PastryMaterialIngredient,
                  ingredientIndex: number
                ) => {
                  const optionsIngredients = [
                    ingredient,
                    ...fetchedIngredients.filter(
                      (availableIngredient) =>
                        !pmState.values.variants[0].ingredients.some(
                          (variantIngredient: PastryMaterialIngredient) =>
                            variantIngredient.id === availableIngredient.id
                        )
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
                      key={`ingredient-stack-${ingredientIndex}`}
                    >
                      <FormControl
                        fullWidth
                        key={`select-ingredient-form-${ingredientIndex}`}
                        size="small"
                      >
                        <Select
                          labelId={`select-ingredient-${ingredientIndex}`}
                          id={`select-ingredient-${ingredientIndex}`}
                          value={ingredient.id} // Use the current ingredient ID directly
                          onChange={(e) =>
                            dispatch({
                              type: ACTIONS.UPDATE_INGREDIENT_IN_VARIANT,
                              payload: {
                                variantIndex: 0,
                                ingredientIndex: ingredientIndex,
                                ingredient: { id: e.target.value },
                              },
                            })
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
                        key={`select-ingredient-measurement-form-${ingredientIndex}`}
                        size="small"
                      >
                        <Select
                          labelId={`select-ingredient-measurement-${ingredientIndex}`}
                          id={`select-ingredient-measurement-${ingredientIndex}`}
                          value={ingredient.measurement}
                          onChange={(e) =>
                            dispatch({
                              type: ACTIONS.UPDATE_INGREDIENT_IN_VARIANT,
                              payload: {
                                variantIndex: 0,
                                ingredientIndex: ingredientIndex,
                                ingredient: { measurement: e.target.value },
                              },
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
                        id={`ingredient-amount-${ingredientIndex}`}
                        label="Amount"
                        type="number"
                        value={ingredient.amount} // Make sure you handle this value
                        onChange={(e) =>
                          dispatch({
                            type: ACTIONS.UPDATE_INGREDIENT_IN_VARIANT,
                            payload: {
                              variantIndex: 0,
                              ingredientIndex: ingredientIndex,
                              ingredient: { amount: Number(e.target.value) },
                            },
                          })
                        }
                        slotProps={{ htmlInput: { min: 0 } }}
                        size="small"
                      />

                      <IconButton
                        color="error"
                        onClick={() =>
                          handleRemoveIngredient(0, ingredientIndex)
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  );
                }
              )}
            </Stack>

            {/* Add-Ons */}
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h3">{"Main Add-Ons"}</Typography>
              <Button
                color="primary"
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => handleAddAddOn(0)}
              >
                Add
              </Button>
            </Stack>
            <Stack spacing={1}>
              {pmState.values.variants[0].addOns.map(
                (addOn: PastryMaterialAddOn, addOnIndex: number) => {
                  const optionsAddOns = [
                    addOn,
                    ...fetchedAddOns.filter(
                      (availableAddOn) =>
                        !pmState.values.variants[0].addOns.some(
                          (variantAddOn: PastryMaterialAddOn) =>
                            variantAddOn.id === availableAddOn.id
                        )
                    ),
                  ];

                  return (
                    <Stack
                      direction="row"
                      spacing={1}
                      key={`add-on-stack-${addOnIndex}`}
                    >
                      <FormControl
                        fullWidth
                        key={`select-add-on-form-${addOnIndex}`}
                        size="small"
                      >
                        <Select
                          labelId={`select-add-on-${addOnIndex}`}
                          id={`select-add-on-${addOnIndex}`}
                          value={addOn.id} // Use the current ingredient ID directly
                          onChange={(e) =>
                            dispatch({
                              type: ACTIONS.UPDATE_ADDON_IN_VARIANT,
                              payload: {
                                variantIndex: 0,
                                addOnIndex: addOnIndex,
                                addOn: { id: e.target.value },
                              },
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
                        id={`ingredient-amount-${addOnIndex}`}
                        label="Amount"
                        type="number"
                        value={addOn.amount} // Make sure you handle this value
                        onChange={(e) =>
                          dispatch({
                            type: ACTIONS.UPDATE_ADDON_IN_VARIANT,
                            payload: {
                              variantIndex: 0,
                              addOnIndex: addOnIndex,
                              addOn: { amount: Number(e.target.value) },
                            },
                          })
                        }
                        slotProps={{ htmlInput: { min: 0 } }}
                        size="small"
                      />

                      <IconButton
                        color="error"
                        onClick={() => handleRemoveAddOn(0, addOnIndex)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  );
                }
              )}
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
