import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme, Button, Grid } from "@mui/material";
import { Tokens } from "../../../theme";
import Header from "../../../components/Header";
import DesignCard from "./../../../components/DesignCard.jsx";
import api from "../../../api/axiosConfig";
import AddDesignModal from "./addModal";
import UpdateDesignModal from "./updateModal";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddPastryMaterialModal from "./addModalPastryMaterial.jsx";
import UpdatePastryMaterialModal from "./updateModalPastryMaterial.jsx";

const Designs = () => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);

  const [designs, setDesigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // Add state for error handling

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openAddPastryMaterialModal, setOpenAddPastryMaterialModal] =
    useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openUpdatePastryMaterialModal, setOpenUpdatePastryMaterialModal] =
    useState(false);

  const [selectedDesign, setSelectedDesign] = useState([]);
  const [currentDesignPastryMaterialData, setCurrentDesignPastryMaterialData] =
    useState([]);

  const fetchDesigns = async () => {
    try {
      const response = await api.get("/designs");
      setDesigns(response.data);
    } catch (error) {
      console.error("Error fetching designs:", error);
      setError(error); // Set error state if request fails
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchDesigns();
  }, []);
  //useEffect(()=> {setOpenUpdateModal(true);}, [selectedDesign]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="body2">Loading designs...</Typography>
      </Box>
    );
  }
  if (error) {
    // Handle error or empty data
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="body2">
          Error fetching designs. Please try again later.
        </Typography>
      </Box>
    );
  }
  const handleAddDesignButtonClick = () => {
    setOpenAddModal(true);
  };
  const handleUpdateDesignClick = (formData) => {
    setSelectedDesign(formData);
    setOpenUpdateModal(true);
  };
  const handleAddDesignModalClose = () => {
    setOpenAddModal(false);
    setCurrentDesignPastryMaterialData([]);
  };
  const handleUpdateDesignModalClose = () => {
    setOpenUpdateModal(false);
    setCurrentDesignPastryMaterialData([]);
  };

  const handleAddDesignSubmit = async (formData) => {
    try {
      const formattedDesignShapeNames = [];

      if (
        formData.designShapes !== undefined &&
        formData.designShapes !== null &&
        formData.designShapes.length > 0
      ) {
        for (const shapeName of formData.designShapes) {
          formattedDesignShapeNames.push(shapeName);
        }
      }
      const formattedRequestBody = {
        displayName: formData.displayName,
        displayPictureUrl: formData.displayPictureUrl,
        cakeDescription: formData.cakeDescription,
        designTagIds: formData.designTagIds,
        designShapeNames: formattedDesignShapeNames,
        displayPictureData: formData.displayPictureDataEncoded,
      };
      const response = await api.post("/designs/", formattedRequestBody);
      const responseId = response.data.id;
      if (
        currentDesignPastryMaterialData != undefined &&
        currentDesignPastryMaterialData != null &&
        currentDesignPastryMaterialData.length !== 0 &&
        responseId != undefined &&
        responseId != null
      ) {
        const encodedId = responseId;
        var requestBody = {
          designId: responseId,
          mainVariantName: currentDesignPastryMaterialData.mainVariantName,
          ingredients: [],
          addOns: [],
          subVariants: [],
        };
        currentDesignPastryMaterialData.ingredients.forEach((x) => {
          requestBody.ingredients.push({
            itemId: x.itemId,
            ingredientType: x.ingredientType,
            amount: x.amount,
            amountMeasurement: x.amountMeasurement,
          });
        });
        currentDesignPastryMaterialData.addOns.forEach((y) => {
          requestBody.addOns.push({
            addOnsId: y.addOnsId,
            amount: y.amount,
          });
        });
        currentDesignPastryMaterialData.subVariants.forEach((x) => {
          var newSubVariantBodyEntry = {
            subVariantName: x.subVariantName,
            subVariantIngredients: [],
            subVariantAddOns: [],
          };
          x.subVariantIngredients.forEach((y) => {
            newSubVariantBodyEntry.subVariantIngredients.push({
              itemId: y.itemId,
              ingredientType: y.ingredientType,
              amount: y.amount,
              amountMeasurement: y.amountMeasurement,
            });
          });
          x.subVariantAddOns.forEach((z) => {
            newSubVariantBodyEntry.subVariantAddOns.push({
              addOnsId: z.addOnsId,
              amount: z.amount,
            });
          });
          requestBody.subVariants.push(newSubVariantBodyEntry);
        });
        try {
          const response = await api.post(`/pastry-materials/`, requestBody);
        } catch (error) {
          console.error("Failed to add pastry material:", error);
        }
      }
    } catch (error) {
      setError("Failed to add new design");
      console.error("Failed to add new design:", error);
    }
    setCurrentDesignPastryMaterialData([]);
    await fetchDesigns();
  };
  const handleUpdateDesignSubmit = async (formData) => {
    const encodedId = encodeURIComponent(formData.designId);

    //First step: Update the design
    const bodyForPatchRequest = {
      displayName: formData.displayName,
      displayPictureUrl: formData.designPictureUrl,
      cakeDescription: formData.cakeDescription,
      designTagIds: formData.designTags.map((item) => item.designTagId),
      designShapeNames: formData.designShapes.map((item) => item.shapeName),
      displayPictureData: formData.displayPictureData,
    };
    try {
      const response = await api.patch(
        `/designs/${encodedId}`,
        bodyForPatchRequest
      );
    } catch {
      console.error("Failed to update design:", error);
    }
    //Second step: delete all initial tags marked for deletion
    if (formData.designTags !== undefined && formData.designTags !== null) {
      const tagsForDeletion = [];
      formData.designTags.forEach((element) => {
        if (
          element.forDeletion !== undefined &&
          element.forDeletion !== null &&
          element.forDeletion === "on"
        ) {
          tagsForDeletion.push(element.designTagId);
        }
      });
      if (tagsForDeletion.length > 0) {
        for (const designTagId of tagsForDeletion) {
          try {
            const response = await api.delete(
              `/designs/${encodedId}/tags/${designTagId}`
            );
          } catch {
            console.error("Failed to delete tags for design:", error);
          }
        }
      }
      //Third step: delete all shapes marked for deletion
      if (
        formData.designShapes !== undefined &&
        formData.designShapes !== null
      ) {
        const shapesForDeletion = [];
        formData.designShapes.forEach((shape) => {
          if (
            shape.forDeletion !== undefined &&
            shape.forDeletion !== null &&
            shape.forDeletion === "on"
          ) {
            shapesForDeletion.push(shape.designShapeId);
          }
        });
        if (shapesForDeletion.length > 0) {
          for (const shapeId of shapesForDeletion) {
            try {
              const response = await api.delete(
                `/designs/${encodedId}/shapes/${shapeId}`
              );
            } catch {
              console.error("Failed to delete shape for design:", error);
            }
          }
        }
      }

      //Fourth step: update pastry material if changed
      if (
        currentDesignPastryMaterialData &&
        currentDesignPastryMaterialData.pastryMaterialId != undefined &&
        currentDesignPastryMaterialData.pastryMaterialId != null
      ) {
        try {
          const encodedId = encodeURIComponent(
            currentDesignPastryMaterialData.pastryMaterialId
          );

          for (const element of currentDesignPastryMaterialData.ingredients) {
            //First Step : Delete all ingredients marked for deletion
            if (element.forDeletion == "on") {
              try {
                const response = await api.delete(
                  `/pastry-materials/${encodedId}/ingredients/${element.ingredientId}`
                );
              } catch (error) {
                console.error(
                  "Failed to delete pastry material ingredient:",
                  error
                );
              }
            }
            //Second Step: Append all ingredients marked for insertion
            if (element.forInsertion == "on") {
              try {
                const response = await api.post(
                  `/pastry-materials/${encodedId}/ingredients`,
                  {
                    itemId: element.itemId,
                    ingredientType: element.ingredientType,
                    amount: element.amount,
                    amountMeasurement: element.amountMeasurement,
                  }
                );
              } catch (error) {
                console.error(
                  "Failed to add pastry material ingredient:",
                  error
                );
              }
            }
            //Third Step: Update all pastry ingredients marked for change
            if (
              element.forInsertion == "off" &&
              element.forDeletion == "off" &&
              element.changed == "on"
            ) {
              try {
                const response = await api.patch(
                  `/pastry-materials/${encodedId}/ingredients/${element.ingredientId}`,
                  {
                    itemId: element.itemId,
                    ingredientType: element.ingredientType,
                    amount: element.amount,
                    amountMeasurement: element.amountMeasurement,
                  }
                );
              } catch (error) {
                console.error(
                  "Failed to update pastry material ingredient:",
                  error
                );
              }
            }
          }
          for (const addOn of currentDesignPastryMaterialData.addOns) {
            //Fourth step: delete all add ons marked for deletion
            if (addOn.forDeletion == "on") {
              try {
                const response = await api.delete(
                  `/pastry-materials/${encodedId}/add-ons/${addOn.pastryMaterialAddOnId}`
                );
              } catch {
                console.error(
                  "Failed to delete add on " + addOn.pastryMaterialAddOnId,
                  error
                );
              }
            } else {
              //Fifth step: update add ons marked for update
              if (addOn.forInsertion == "off" && addOn.changed == "on") {
                try {
                  const response = await api.patch(
                    `/pastry-materials/${encodedId}/add-ons/${addOn.pastryMaterialAddOnId}`,
                    {
                      addOnsId: addOn.addOnsId,
                      amount: addOn.amount,
                    }
                  );
                } catch {
                  console.error(
                    "Failed to update add on " + addOn.pastryMaterialAddOnId,
                    error
                  );
                }
              }
              //Sixth step: add all add ons marked for insertion
              if (addOn.forInsertion == "on") {
                try {
                  const response = await api.post(
                    `/pastry-materials/${encodedId}/add-ons/`,
                    {
                      addOnsId: addOn.addOnsId,
                      amount: addOn.amount,
                    }
                  );
                } catch {
                  console.error("Failed to add add on to " + encodedId, error);
                }
              }
            }
          }
          for (const element of currentDesignPastryMaterialData.subVariants) {
            //Fourth Step: Delete all variants marked for deletion
            if (element.forDeletion == "on") {
              try {
                const response = await api.delete(
                  `/pastry-materials/${encodedId}/sub-variants/${element.pastryMaterialSubVariantId}`
                );
              } catch {
                console.error(
                  `Failed to delete variant ${element.pastryMaterialSubVariantId}`
                );
              }
              continue;
            } else {
              if (element.forInsertion == "off") {
                //Fifth Step: Update sub variant's name
                if (element.changed == "on") {
                  try {
                    const response = await api.patch(
                      `/pastry-materials/${encodedId}/sub-variants/${element.pastryMaterialSubVariantId}`,
                      { subVariantName: element.subVariantName }
                    );
                  } catch {
                    console.error(
                      `Failed to update sub variant ${element.pastryMaterialSubVariantId}`
                    );
                  }
                }
                for (const subVariantIngredient of element.subVariantIngredients) {
                  //Sixth Step: Delete sub variant ingredients marked for deletion
                  if (
                    subVariantIngredient.forDeletion != undefined &&
                    subVariantIngredient.forDeletion == "on"
                  ) {
                    try {
                      const response = await api.delete(
                        `/pastry-materials/${encodedId}/sub-variants/${element.pastryMaterialSubVariantId}/ingredients/${subVariantIngredient.pastryMaterialSubVariantIngredientId}`
                      );
                    } catch {
                      console.error(
                        `Failed to delete sub variant ingredient ${element.pastryMaterialSubVariantIngredientId}`
                      );
                    }
                    continue;
                  } else {
                    //Seventh Step: Update sub variant ingredients marked for change
                    if (
                      subVariantIngredient.forInsertion == "off" &&
                      subVariantIngredient.changed == "on"
                    ) {
                      try {
                        const response = await api.patch(
                          `/pastry-materials/${encodedId}/sub-variants/${element.pastryMaterialSubVariantId}/ingredients/${subVariantIngredient.pastryMaterialSubVariantIngredientId}`,
                          {
                            itemId: subVariantIngredient.itemId,
                            ingredientType: subVariantIngredient.ingredientType,
                            amount: subVariantIngredient.amount,
                            amountMeasurement:
                              subVariantIngredient.amountMeasurement,
                          }
                        );
                      } catch {
                        console.error(
                          `Failed to update sub variant ingredient ${subVariantIngredient.pastryMaterialSubVariantIngredientId}`
                        );
                      }
                    }
                    //Eight Step: Insert sub variant ingredients marked for insertion
                    if (subVariantIngredient.forInsertion == "on") {
                      try {
                        const response = await api.post(
                          `/pastry-materials/${encodedId}/sub-variants/${element.pastryMaterialSubVariantId}/ingredients`,
                          {
                            itemId: subVariantIngredient.itemId,
                            ingredientType: subVariantIngredient.ingredientType,
                            amount: subVariantIngredient.amount,
                            amountMeasurement:
                              subVariantIngredient.amountMeasurement,
                          }
                        );
                      } catch {
                        console.error(
                          `Failed to add new sub variant ingredient for ${element.pastryMaterialSubVariantId}`
                        );
                      }
                    }
                  }
                }

                for (const subVariantAddOn of element.subVariantAddOns) {
                  //Ninth Step: Delete sub variant add ons marked for deletion
                  if (
                    subVariantAddOn.forDeletion != undefined &&
                    subVariantAddOn.forDeletion == "on"
                  ) {
                    try {
                      const response = await api.delete(
                        `/pastry-materials/${encodedId}/sub-variants/${element.pastryMaterialSubVariantId}/add-ons/${subVariantAddOn.pastryMaterialSubVariantAddOnId}`
                      );
                    } catch {
                      console.error(
                        `Failed to delete  sub variant add on ${subVariantAddOn.pastryMaterialSubVariantAddOnId}`
                      );
                    }
                    continue;
                  } else {
                    //Tenth Step: Update all sub variant add add ons marked for change
                    if (
                      subVariantAddOn.forInsertion == "off" &&
                      subVariantAddOn.changed == "on"
                    ) {
                      try {
                        const response = await api.patch(
                          `/pastry-materials/${encodedId}/sub-variants/${element.pastryMaterialSubVariantId}/addOns/${subVariantAddOn.pastryMaterialSubVariantAddOnId}`,
                          {
                            addOnsId: subVariantAddOn.addOnsId,
                            amount: subVariantAddOn.amount,
                          }
                        );
                      } catch {
                        console.error(
                          `Failed to update sub variant add on ${subVariantAddOn.pastryMaterialSubVariantAddOnId}`
                        );
                      }
                    }
                    //Eleventh Step: Insert all sub variant add on marked for insertion
                    if (subVariantAddOn.forInsertion == "on") {
                      try {
                        const response = await api.post(
                          `/pastry-materials/${encodedId}/sub-variants/${element.pastryMaterialSubVariantId}/addOns`,
                          {
                            addOnsId: subVariantAddOn.addOnsId,
                            amount: subVariantAddOn.amount,
                          }
                        );
                      } catch {
                        console.error(
                          `Failed to add sub variant add on for ${element.pastryMaterialSubVariantId}`
                        );
                      }
                    }
                  }
                }
              } else if (element.forInsertion == "on") {
                //Ninth Step: Insert new sub variants
                var requestBody = {
                  subVariantName: element.subVariantName,
                  subVariantIngredients: [],
                  subVariantAddOns: [],
                };
                element.subVariantIngredients.forEach(
                  (subVariantIngredient, index) => {
                    requestBody.subVariantIngredients.push({
                      itemId: subVariantIngredient.itemId,
                      ingredientType: subVariantIngredient.ingredientType,
                      amount: subVariantIngredient.amount,
                      amountMeasurement: subVariantIngredient.amountMeasurement,
                    });
                  }
                );
                element.subVariantAddOns.forEach((subVariantAddOn, index) => {
                  requestBody.subVariantAddOns.push({
                    addOnsId: subVariantAddOn.addOnsId,
                    amount: subVariantAddOn.amount,
                  });
                });

                try {
                  const response = await api.post(
                    `/pastry-materials/${encodedId}/sub-variants`,
                    requestBody
                  );
                } catch {
                  console.error(
                    "Failed to add new variant " + element.subVariantName
                  );
                }
              }
            }
          }
          //Final Step: Change the linked design and main variant name for the pastry material
          try {
            const response = await api.patch(`/pastry-materials/${encodedId}`, {
              designId: currentDesignPastryMaterialData.designId,
              mainVariantName: currentDesignPastryMaterialData.mainVariantName,
            });
          } catch (error) {
            console.error(
              "Failed to change pastry material linked design id:",
              error
            );
          }
        } catch {
          console.error("Failed somewhere in updating pastry material");
        }
      } else if (
        currentDesignPastryMaterialData &&
        currentDesignPastryMaterialData.noPastryMaterial != undefined &&
        currentDesignPastryMaterialData.noPastryMaterial == true
      ) {
        try {
          const encodedId = selectedDesign.designId;
          var requestBody = {
            designId: encodedId,
            mainVariantName: currentDesignPastryMaterialData.mainVariantName,
            ingredients: [],
            addOns: [],
            subVariants: [],
          };
          currentDesignPastryMaterialData.ingredients.forEach((x) => {
            requestBody.ingredients.push({
              itemId: x.itemId,
              ingredientType: x.ingredientType,
              amount: x.amount,
              amountMeasurement: x.amountMeasurement,
            });
          });
          currentDesignPastryMaterialData.addOns.forEach((y) => {
            requestBody.addOns.push({
              addOnsId: y.addOnsId,
              amount: y.amount,
            });
          });
          currentDesignPastryMaterialData.subVariants.forEach((x) => {
            var newSubVariantBodyEntry = {
              subVariantName: x.subVariantName,
              subVariantIngredients: [],
              subVariantAddOns: [],
            };
            x.subVariantIngredients.forEach((y) => {
              newSubVariantBodyEntry.subVariantIngredients.push({
                itemId: y.itemId,
                ingredientType: y.ingredientType,
                amount: y.amount,
                amountMeasurement: y.amountMeasurement,
              });
            });
            x.subVariantAddOns.forEach((z) => {
              newSubVariantBodyEntry.subVariantAddOns.push({
                addOnsId: z.addOnsId,
                amount: z.amount,
              });
            });
            requestBody.subVariants.push(newSubVariantBodyEntry);
          });
          try {
            const response = await api.post(`/pastry-materials/`, requestBody);
          } catch (error) {
            console.error("Failed to add pastry material:", error);
          }
        } catch {
          console.error("Failed to add pastry material:", error);
        }
      }
    }

    setCurrentDesignPastryMaterialData([]);
    await fetchDesigns();
  };
  const handleDeleteDesignSubmit = async (id) => {
    const encodedId = encodeURIComponent(id);
    try {
      const response = await api.delete(`/designs/${encodedId}`);
    } catch {
      console.error("Failed to delete design:", error);
    }
    await fetchDesigns();
  };
  return (
    <Box p={2}>
      <Header title="Designs" subtitle="Gallery of all designs" />
      <Grid container spacing={2}>
        <Grid item xs={6} sm={4} md={2} lg={1.5}>
          <Button
            onClick={handleAddDesignButtonClick}
            variant="contained"
            color="primary"
            sx={{
              width: "100%",
              height: 300,
            }}
          >
            <AddCircleIcon />
          </Button>
        </Grid>
        {designs.map((design) => (
          <Grid item xs={6} sm={4} md={2} lg={1.5}>
            <DesignCard
              manager
              id={design.designId}
              name={design.displayName}
              picture={design.displayPictureData}
              description={design.cakeDescription}
              tags={design.designTags}
              editAction={(data) => {
                handleUpdateDesignClick(data);
              }}
              deleteAction={(id) => handleDeleteDesignSubmit(id)}
            />
          </Grid>
        ))}
      </Grid>
      <AddDesignModal
        open={openAddModal}
        handleClose={handleAddDesignModalClose}
        handleAddSubmit={handleAddDesignSubmit}
        addPastryMaterialOpen={() => setOpenAddPastryMaterialModal(true)}
      />
      <UpdateDesignModal
        open={openUpdateModal}
        handleClose={handleUpdateDesignModalClose}
        handleUpdateSubmit={handleUpdateDesignSubmit}
        designData={selectedDesign}
        updatePastryMaterialOpen={() => setOpenUpdatePastryMaterialModal(true)}
      />

      <AddPastryMaterialModal
        open={openAddPastryMaterialModal}
        addDesignModalOpen={openAddModal}
        handleClose={() => setOpenAddPastryMaterialModal(false)}
        handleAdd={(formData) => setCurrentDesignPastryMaterialData(formData)}
      />
      <UpdatePastryMaterialModal
        open={openUpdatePastryMaterialModal}
        updateDesignModalOpen={openUpdateModal}
        selectedDesign={selectedDesign}
        handleClose={() => setOpenUpdatePastryMaterialModal(false)}
        handleUpdate={(formData) =>
          setCurrentDesignPastryMaterialData(formData)
        }
      />
    </Box>
  );
};

export default Designs;
