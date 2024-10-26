//Parser for api requests
import { Design, PastryMaterial, PastryMaterialVariant } from "./Schemas";

export interface DesignBodyRequestFormat {
  displayName: string;
  displayPictureUrl: string;
  cakeDescription: string;
  designTagIds: string[];
  designShapeNames: string[];
  designAddOns: [
    {
      addOnsId: number;
      quantity: number;
      price: number;
    }?
  ];
  displayPictureData: string;
}
export interface PastryMaterialRequestFormat {
  designId: string;
  mainVariantName: string;
  ingredients: PastryMaterialIngredientRequestFormat[];
  otherCost: {
    additionalCost: number;
    ingredientCostMultiplier: number;
  };
  ingredientImportance: [
    {
      itemId: string;
      ingredientType: string;
      importance: number;
    }?
  ];
  addOns: PastryMaterialAddOnRequestFormat[];
  subVariants: PastryMaterialSubVariantRequestFormat[];
}
export interface PastryMaterialSubVariantRequestFormat {
  subVariantName: string;
  subVariantIngredients: PastryMaterialIngredientRequestFormat[];
  subVariantAddOns: PastryMaterialAddOnRequestFormat[];
}

export interface PastryMaterialIngredientRequestFormat {
  itemId: string;
  ingredientType: string;
  amount: number;
  amountMeasurement: string;
}
export interface PastryMaterialAddOnRequestFormat {
  addOnsId: number;
  amount: number;
}

export function parseDesignDataForSubmission(
  design: Design,
  designImage: string
): DesignBodyRequestFormat {
  var response: DesignBodyRequestFormat = {
    displayName: design.name,
    displayPictureUrl: "",
    cakeDescription: design.description,
    designTagIds: [],
    designShapeNames: [],
    designAddOns: [],
    displayPictureData: designImage,
  };

  //Check if design shape is custom,
  //If it is push the value inside of the customShape property
  //Else push the value in shape property
  response.designShapeNames.push(
    design.shape === "custom"
      ? design.customShape !== undefined
        ? design.customShape
        : ""
      : design.shape
  ); //One line magic

  design.tags.forEach((element) => {
    response.designTagIds.push(element.id);
  });
  return response;
}

export function parsePastryMaterialForSubmission(
  pastryMaterial: PastryMaterial
): PastryMaterialRequestFormat {
  var response: PastryMaterialRequestFormat = {
    designId:
      pastryMaterial.designId === undefined ? "" : pastryMaterial.designId,
    mainVariantName: "N/A",
    otherCost: {
      additionalCost: pastryMaterial.otherCost.additionalCost,
      ingredientCostMultiplier: pastryMaterial.otherCost.multiplier,
    },
    ingredientImportance: [],
    ingredients: [],
    addOns: [],
    subVariants: [],
  };

  pastryMaterial.variants.map(
    (variant: PastryMaterialVariant, variantIndex: number) => {
      if (variantIndex <= 0) {
        response.mainVariantName = variant.name;

        variant.ingredients.forEach((element) => {
          response.ingredients.push({
            itemId: element.id === undefined ? "1" : element.id, //Risky
            ingredientType: element.ingredientType,
            amount: element.amount,
            amountMeasurement:
              element.measurement === undefined ? "Piece" : element.measurement, //Risky
          });
        });

        variant.addOns.forEach((element) => {
          response.addOns.push({
            addOnsId: element.id === undefined ? 1 : Number(element.id), //Extra Risky
            amount: element.amount,
          });
        });
      } else {
        var newVariantEntry: PastryMaterialSubVariantRequestFormat = {
          subVariantName: variant.name,
          subVariantIngredients: [],
          subVariantAddOns: [],
        };

        variant.ingredients.forEach((element) => {
          newVariantEntry.subVariantIngredients.push({
            itemId: element.id === undefined ? "1" : element.id, //Risky
            ingredientType: element.ingredientType,
            amount: element.amount,
            amountMeasurement:
              element.measurement === undefined ? "Piece" : element.measurement, //Risky
          });
        });

        variant.addOns.forEach((element) => {
          newVariantEntry.subVariantAddOns.push({
            addOnsId: element.id === undefined ? 1 : Number(element.id), //Extra Risky
            amount: element.amount,
          });
        });
        response.subVariants.push(newVariantEntry);
      }
    }
  );

  return response;
}
