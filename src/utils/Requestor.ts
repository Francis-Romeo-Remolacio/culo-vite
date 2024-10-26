import api from "../api/axiosConfig";
import {
  PastryMaterialAddOnRequestFormat,
  PastryMaterialIngredientRequestFormat,
  PastryMaterialRequestFormat,
  PastryMaterialSubVariantRequestFormat,
} from "./Parser";

export async function postPastryMaterial(
  pastryMaterial: PastryMaterialRequestFormat
): Promise<string> {
  var response: string = "Something went wrong.";

  try {
    const postResponse = await api.post(`pastry-materials/`, pastryMaterial);
    response = postResponse.data.message;
  } catch {}
  return response;
}
export async function patchPastryMaterial(
  pastryMaterial: PastryMaterialRequestFormat,
  pastryMaterialId: string
): Promise<string> {
  var response: string = "Something went wrong.";
  const pastryMaterialRequestAddressBase: string = `pastry-materials/${pastryMaterialId}`;

  var originalPastryMaterial: any;

  const fetchOriginalPastryMaterial = async () => {
    try {
      const fetchedPastryMaterial = await api.get(
        `designs/${pastryMaterial?.designId}/pastry-material`
      );
      originalPastryMaterial = fetchedPastryMaterial.data;
    } catch {
      return response;
    }
  }

  await fetchOriginalPastryMaterial();

  //Update main variant
  var mainVariantPatchBody = {
    designId: pastryMaterial?.designId,
    mainVariantName: pastryMaterial?.mainVariantName,
  };
  try {
    const mainVariantPatchRequestResult = await api.patch(
      pastryMaterialRequestAddressBase + "/",
      mainVariantPatchBody
    );
  } catch {}

  //Update other costs
  var otherCostRequestBody = {
    additionalCost: pastryMaterial.otherCost.additionalCost,
    ingredientCostMultiplier: pastryMaterial.otherCost.ingredientCostMultiplier,
  };
  const otherCostRequestAddress: string =
    pastryMaterialRequestAddressBase + `/other-costs`;
  if (
    originalPastryMaterial.otherCost === undefined ||
    originalPastryMaterial.otherCost === null
  ) {
    try {
      const otherCostPostRequestResult = await api.post(
        otherCostRequestAddress,
        otherCostRequestBody
      );
    } catch {}
  } else {
    try {
      const otherCostPatchRequestResult = await api.patch(
        otherCostRequestAddress,
        otherCostRequestBody
      );
    } catch {}
  }

  //-------------------------------------------------------------------
  //MAIN VARIANT - INGREDIENTS
  //-------------------------------------------------------------------
  const mainVariantIngredientRequestAddress =
    pastryMaterialRequestAddressBase + `/ingredients`;
  const originalIngredientList: PastryMaterialIngredientRequestFormat[] =
    originalPastryMaterial.ingredients.map(
      ({ itemId, ingredientType, amount, amountMeasurement }) => ({
        itemId,
        amount,
        amountMeasurement,
        ingredientType,
      })
    );
  const newIngredientList: PastryMaterialIngredientRequestFormat[] =
    structuredClone(pastryMaterial.ingredients);

  const ingredientsToBeUpdated: PastryMaterialIngredientRequestFormat[] =
    newIngredientList.filter((x) =>
      originalIngredientList.some((y) => y.itemId === x.itemId)
    );
  const ingredientsToBeInserted: PastryMaterialIngredientRequestFormat[] =
    newIngredientList.filter((x) =>
      originalIngredientList.every((y) => y.itemId !== x.itemId)
    );
  const ingredientsToBeDeleted: PastryMaterialIngredientRequestFormat[] =
    originalIngredientList.filter((x) =>
      newIngredientList.every((y) => y.itemId !== x.itemId)
    );

  //Patch original ingredients
  for (const ingredientToBeUpdated of ingredientsToBeUpdated) {
    const ingredientRelationId: string | undefined =
      originalPastryMaterial.ingredients?.find(
        (x: { itemId: string; ingredientId: string }) =>
          x.itemId === ingredientToBeUpdated.itemId
      )?.ingredientId;

    if (ingredientRelationId === undefined) continue;

    try {
      const ingredientPatchRequestResponse = await api.patch(
        mainVariantIngredientRequestAddress + `/${ingredientRelationId}`,
        ingredientToBeUpdated
      );
    } catch {
      continue;
    }
  }
  //Post new ingredients
  for (const ingredientToBeInserted of ingredientsToBeInserted) {
    try {
      const ingredientPostRequestResponse = await api.post(
        mainVariantIngredientRequestAddress,
        ingredientToBeInserted
      );
    } catch {
      continue;
    }
  }
  //Delete missing ingredients in form
  for (const ingredientToBeDeleted of ingredientsToBeDeleted) {
    const ingredientRelationId: string | undefined =
      originalPastryMaterial.ingredients?.find(
        (x: { itemId: string; ingredientId: string }) =>
          x.itemId === ingredientToBeDeleted.itemId
      )?.ingredientId;

    if (ingredientRelationId === undefined) continue;

    try {
      const ingredientDeleteRequestResponse = await api.delete(
        mainVariantIngredientRequestAddress + `/${ingredientRelationId}`
      );
    } catch {
      continue;
    }
  }

  //-------------------------------------------------------------------
  //MAIN VARIANT - ADD ONS
  //-------------------------------------------------------------------
  const mainVariantAddOnsRequestAddress =
    pastryMaterialRequestAddressBase + `/add-ons`;
  const originalAddOnsList: PastryMaterialAddOnRequestFormat[] =
    originalPastryMaterial.addOns.map(({ addOnsId, amount }) => ({
      addOnsId,
      amount,
    }));
  const newAddOnList: PastryMaterialAddOnRequestFormat[] = structuredClone(
    pastryMaterial.addOns
  );

  const addOnsToBeUpdated: PastryMaterialAddOnRequestFormat[] =
    newAddOnList.filter((x) =>
      originalAddOnsList.some((y) => y.addOnsId === x.addOnsId)
    );
  const addOnsToBeInserted: PastryMaterialAddOnRequestFormat[] =
    newAddOnList.filter((x) =>
      originalAddOnsList.every((y) => y.addOnsId !== x.addOnsId)
    );
  const addOnsToBeDeleted: PastryMaterialAddOnRequestFormat[] =
    originalAddOnsList.filter((x) =>
      newAddOnList.every((y) => y.addOnsId !== x.addOnsId)
    );

  //Patch original add ons
  for (const addOnToBeUpdated of addOnsToBeUpdated) {
    const addOnRelationId: string | undefined =
      originalPastryMaterial.addOns?.find(
        (x: { pastryMaterialAddOnId: string; addOnsId: number }) =>
          x.addOnsId === addOnToBeUpdated.addOnsId
      )?.pastryMaterialAddOnId;

    if (addOnRelationId === undefined) continue;

    try {
      const addOnPatchRequestResponse = await api.patch(
        mainVariantAddOnsRequestAddress + `/${addOnRelationId}`,
        addOnToBeUpdated
      );
    } catch {
      continue;
    }
  }
  //Post new add ons
  for (const addOnToBeInserted of addOnsToBeInserted) {
    try {
      const addOnPostRequestResponse = await api.post(
        mainVariantAddOnsRequestAddress,
        addOnToBeInserted
      );
    } catch {
      continue;
    }
  }
  //Delete missing add ons in form
  for (const addOnToBeDeleted of addOnsToBeDeleted) {
    const addOnRelationId: string | undefined =
      originalPastryMaterial.addOns?.find(
        (x: { pastryMaterialAddOnId: string; addOnsId: number }) =>
          x.addOnsId === addOnToBeDeleted.addOnsId
      )?.pastryMaterialAddOnId;

    if (addOnRelationId === undefined) continue;

    try {
      const addOnDeleteRequestResponse = await api.delete(
        mainVariantAddOnsRequestAddress + `/${addOnRelationId}`
      );
    } catch {
      continue;
    }
  }

  const subVariantRequestAddressBase =
  pastryMaterialRequestAddressBase + `/sub-variants`;

  //Delete extra sub variants
  //This is so scuffed, consider updating this in the future
  const numberOfSubVariantsInForm :number = pastryMaterial.subVariants.length - 1; //Base 0
  const originalSubVariantsIdList : [{pastryMaterialSubVariantId: string}] = originalPastryMaterial.subVariants?.map(({pastryMaterialSubVariantId}) => ({pastryMaterialSubVariantId}));
  for (const originalSubVariantsIdListIndex in originalSubVariantsIdList){
    const currentIdIndex = Number(originalSubVariantsIdListIndex);
    if (currentIdIndex > numberOfSubVariantsInForm) {
      try {
        const subVariantDeleteResponse = await api.delete(subVariantRequestAddressBase + `/${originalSubVariantsIdList[currentIdIndex].pastryMaterialSubVariantId}`);
      }
      catch{}
    }
  }

  //Update sub variants
  await fetchOriginalPastryMaterial();
  for (const subVariant of pastryMaterial.subVariants) {
    //Get corresponding sub variant entry id from the original pastry material data
    //Using the index of the current sub variant data in the form
    //To be used to update the sub variant that exists in the database
    //Relying on indexes is very risky, consider changing this later

    const currentSubVariantIndexInForm: number =
      pastryMaterial.subVariants.indexOf(subVariant);
    const subVariantRelationId: string | undefined =
      originalPastryMaterial.subVariants[currentSubVariantIndexInForm]
        ?.pastryMaterialSubVariantId;

    if (subVariantRelationId === undefined) {
      //Insert new variant to db
      try {
        const subVariantPostRequestResponse = await api.post(
          subVariantRequestAddressBase,
          subVariant
        );
      } catch {}
    } else {
      const subVariantRequestAddress =
        subVariantRequestAddressBase + `/${subVariantRelationId}`;
      const currentSubVariant =
        originalPastryMaterial.subVariants[currentSubVariantIndexInForm];

      if (currentSubVariant === undefined) continue;

      //Update variant name
      var subVariantPatchRequestBody = {
        subVariantName: subVariant.subVariantName,
      };

      try {
        const subVariantPatchRequestResponse = await api.patch(
          subVariantRequestAddress,
          subVariantPatchRequestBody
        );
      } catch {}

      //-------------------------------------------------------------------
      //SUB VARIANT - INGREDIENTS
      //-------------------------------------------------------------------
      const subVariantIngredientRequestAddress =
        subVariantRequestAddress + `/ingredients`;
      const originalSubVariantIngredientList: PastryMaterialIngredientRequestFormat[] =
        currentSubVariant.subVariantIngredients.map(
          ({ itemId, ingredientType, amount, amountMeasurement }) => ({
            itemId,
            amount,
            amountMeasurement,
            ingredientType,
          })
        );
      const newSubVariantIngredientList: PastryMaterialIngredientRequestFormat[] =
        structuredClone(subVariant.subVariantIngredients);

      const subVariantIngredientsToBeUpdated: PastryMaterialIngredientRequestFormat[] =
        newSubVariantIngredientList.filter((x) =>
          originalSubVariantIngredientList.some((y) => y.itemId === x.itemId)
        );
      const subVariantIngredientsToBeInserted: PastryMaterialIngredientRequestFormat[] =
        newSubVariantIngredientList.filter((x) =>
          originalSubVariantIngredientList.every((y) => y.itemId !== x.itemId)
        );
      const subVariantIngredientsToBeDeleted: PastryMaterialIngredientRequestFormat[] =
        originalSubVariantIngredientList.filter((x) =>
          newSubVariantIngredientList.every((y) => y.itemId !== x.itemId)
        );

      //Patch original ingredients
      for (const subVariantIngredientToBeUpdated of subVariantIngredientsToBeUpdated) {
        const ingredientRelationId: string | undefined =
          currentSubVariant.subVariantIngredients?.find(
            (x: { itemId: string; pastryMaterialSubVariantIngredientId: string }) =>
              x.itemId === subVariantIngredientToBeUpdated.itemId
          )?.pastryMaterialSubVariantIngredientId;

        if (ingredientRelationId === undefined) continue;

        try {
          const ingredientPatchRequestResponse = await api.patch(
            subVariantIngredientRequestAddress + `/${ingredientRelationId}`,
            subVariantIngredientToBeUpdated
          );
        } catch {
          continue;
        }
      }
      //Post new ingredients
      for (const subVariantIngredientToBeInserted of subVariantIngredientsToBeInserted) {
        try {
          const ingredientPostRequestResponse = await api.post(
            subVariantIngredientRequestAddress,
            subVariantIngredientToBeInserted
          );
        } catch {
          continue;
        }
      }
      //Delete missing ingredients in form
      for (const subVariantIngredientToBeDeleted of subVariantIngredientsToBeDeleted) {
        const ingredientRelationId: string | undefined =
          currentSubVariant.subVariantIngredients?.find(
            (x: { itemId: string; pastryMaterialSubVariantIngredientId: string }) =>
              x.itemId === subVariantIngredientToBeDeleted.itemId
          )?.pastryMaterialSubVariantIngredientId;

        if (ingredientRelationId === undefined) continue;

        try {
          const ingredientDeleteRequestResponse = await api.delete(
            subVariantIngredientRequestAddress + `/${ingredientRelationId}`
          );
        } catch {
          continue;
        }
      }

      //-------------------------------------------------------------------
      //MAIN VARIANT - ADD ONS
      //-------------------------------------------------------------------
      const subVariantAddOnsRequestAddress =
        subVariantRequestAddress + `/add-ons`;
      const originalSubVariantAddOnsList: PastryMaterialAddOnRequestFormat[] =
        currentSubVariant.subVariantAddOns?.map(({ addOnsId, amount }) => ({
          addOnsId,
          amount,
        }));
      const newSubVariantAddOnList: PastryMaterialAddOnRequestFormat[] =
        structuredClone(subVariant.subVariantAddOns);

      const subVariantAddOnsToBeUpdated: PastryMaterialAddOnRequestFormat[] =
        newSubVariantAddOnList.filter((x) =>
          originalSubVariantAddOnsList.some((y) => y.addOnsId === x.addOnsId)
        );
      const subVariantAddOnsToBeInserted: PastryMaterialAddOnRequestFormat[] =
        newSubVariantAddOnList.filter((x) =>
          originalSubVariantAddOnsList.every((y) => y.addOnsId !== x.addOnsId)
        );
      const subVariantAddOnsToBeDeleted: PastryMaterialAddOnRequestFormat[] =
        originalSubVariantAddOnsList.filter((x) =>
          newSubVariantAddOnList.every((y) => y.addOnsId !== x.addOnsId)
        );

      //Patch original add ons
      for (const subVariantAddOnToBeUpdated of subVariantAddOnsToBeUpdated) {
        const addOnRelationId: string | undefined =
          currentSubVariant.subVariantAddOns?.find(
            (x: { pastryMaterialSubVariantAddOnId: string; addOnsId: number }) =>
              x.addOnsId === subVariantAddOnToBeUpdated.addOnsId
          )?.pastryMaterialSubVariantAddOnId;

        if (addOnRelationId === undefined) continue;

        try {
          const addOnPatchRequestResponse = await api.patch(
            subVariantAddOnsRequestAddress + `/${addOnRelationId}`,
            subVariantAddOnToBeUpdated
          );
        } catch {
          continue;
        }
      }
      //Post new add ons
      for (const subVariantAddOnToBeInserted of subVariantAddOnsToBeInserted) {
        try {
          const addOnPostRequestResponse = await api.post(
            subVariantAddOnsRequestAddress,
            subVariantAddOnToBeInserted
          );
        } catch {
          continue;
        }
      }
      //Delete missing add ons in form
      for (const subVariantAddOnToBeDeleted of subVariantAddOnsToBeDeleted) {
        const addOnRelationId: string | undefined =
          currentSubVariant.subVariantAddOns?.find(
            (x: { pastryMaterialSubVariantAddOnId: string; addOnsId: number }) =>
              x.addOnsId === subVariantAddOnToBeDeleted.addOnsId
          )?.pastryMaterialSubVariantAddOnId;

        if (addOnRelationId === undefined) continue;

        try {
          const addOnDeleteRequestResponse = await api.delete(
            subVariantAddOnsRequestAddress + `/${addOnRelationId}`
          );
        } catch {
          continue;
        }
      }
    }
  }

  return response;
}
