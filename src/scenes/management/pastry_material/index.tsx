import { useEffect, useState } from "react";
import {
  Box,
  useTheme,
  CircularProgress,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import { tokens } from "../../../theme";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../../../components/Header";
import api from "../../../api/axiosConfig";
import EditIcon from "@mui/icons-material/Edit";
import { GridRemoveIcon } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdatePastryMaterialModal from "./updateModal";
import AddPastryMaterialModal from "./addModal";
import ManualSubtractionModal from "./manualSubtractionModal";
import DeleteConfirmationModal from "./deleteConfirmationModal";
import DataGridStyler from "./../../../components/DataGridStyler.jsx";

const PastryMaterial = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pastryMaterials, setPastryMaterials] = useState([]);
  const [pastryMaterialRows, setPastryMaterialRows] = useState([]);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openManualSubtractModal, setOpenManualSubtractModal] = useState(false);
  const [openDeleteConfirmationModal, setOpenDeleteConfirmationModal] =
    useState(false);

  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const columns = [
    {
      field: "pastryMaterialId",
      headerName: "Id",
      cellClassName: "name-column--cell",
      flex: 0.15,
    },
    {
      field: "designId",
      headerName: "Design Linked To",
      flex: 0.15,
    },
    {
      field: "designName",
      headerName: "Name of Design",
      flex: 0.2,
    },
    {
      field: "dateAdded",
      headerName: "Date Added",
      type: "dateTime",
    },
    {
      field: "lastModifiedDate",
      headerName: "Last Modified Date",
      type: "dateTime",
    },
    {
      field: "costEstimate",
      headerName: "Cost Estimate",
    },
    {
      field: "costExactEstimate",
      headerName: "Exact Price Calculated",
    },
    {
      field: "ingredients",
      headerName: "Ingredients",
      flex: 0.35,
    },
    {
      field: "subVariants",
      headerName: "Sub Variants",
      flex: 0.25,
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleUpdate(params.row.pastryMaterialId)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.pastryMaterialId)}>
            <DeleteIcon />
          </IconButton>
          <IconButton
            onClick={() =>
              handleManualInventoryIngredientSubtraction(
                params.row.pastryMaterialId
              )
            }
          >
            <GridRemoveIcon />
          </IconButton>
        </Box>
      ),
      flex: 0.15,
      sortable: false,
      filterable: false,
    },
  ];

  const fetchPastryMaterials = async () => {
    try {
      const response = await api.get("/pastry-materials");
      setPastryMaterials(response.data);
    } catch (error) {
      setError("Failed to fetch pastry materials");
      console.error("Failed to fetch fetch pastry materials:", error);
    } finally {
      setLoading(false);
    }
  };
  const parseFetchedData = async (dataToBeParsed) => {
    const parsedTagUses = [];
    dataToBeParsed.forEach((element) => {
      const parsedIngredients = [];
      element.ingredients.forEach((ingredient) => {
        parsedIngredients.push(" " + ingredient.itemName);
      });
      const parsedSubVariants = [];
      parsedSubVariants.push(element.mainVariantName);
      element.subVariants.forEach((subVariant) => {
        parsedSubVariants.push(" " + subVariant.subVariantName);
      });
      parsedTagUses.push({
        pastryMaterialId: element.pastryMaterialId,
        designId: element.designId,
        designName: element.designName,
        dateAdded: element.dateAdded,
        lastModifiedDate: element.lastModifiedDate,
        costEstimate: element.costEstimate,
        costExactEstimate: element.costExactEstimate,
        ingredients: parsedIngredients,
        subVariants: parsedSubVariants,
      });
    });
    setPastryMaterialRows(parsedTagUses);
  };
  useEffect(() => {
    fetchPastryMaterials();
  }, []);
  useEffect(() => {
    parseFetchedData(pastryMaterials);
  }, [pastryMaterials]);

  const handleUpdate = async (id) => {
    const material = pastryMaterials.find(
      (material) => material.pastryMaterialId === id
    );
    setSelectedMaterial(material);
    setOpenEditModal(true);
  };
  const handleUpdateSubmit = async (id, updatedData) => {
    const encodedId = encodeURIComponent(id);

    if (updatedData.otherCost !== undefined && updatedData.otherCost !== null) {
      //Check if no record of other cost exist
      if (
        updatedData.otherCost.pastryMaterialAdditionalCostId !== undefined &&
        updatedData.otherCost.pastryMaterialAdditionalCostId !== null &&
        updatedData.otherCost.pastryMaterialAdditionalCostId ===
          "00000000-0000-0000-0000-000000000000"
      ) {
        try {
          const response = await api.post(`/pastry-materials/${encodedId}/other-costs/`, 
            {"additionalCost" : updatedData.otherCost.additionalCost}
          );
        }
        catch (error) {
          console.error("Failed to add pastry material other cost:", error);
        }
      }
      else {
        try {
          const response = await api.patch(`/pastry-materials/${encodedId}/other-costs/`, 
            {"additionalCost" : updatedData.otherCost.additionalCost}
          );
        }
        catch (error) {
          console.error("Failed to add pastry material other cost:", error);
        }
      }
    }
    for (const element of updatedData.ingredients) {
      //First Step : Delete all ingredients marked for deletion
      if (element.forDeletion == "on") {
        try {
          const response = await api.delete(
            `/pastry-materials/${encodedId}/ingredients/${element.ingredientId}`
          );
        } catch (error) {
          console.error("Failed to delete pastry material ingredient:", error);
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
          console.error("Failed to add pastry material ingredient:", error);
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
          console.error("Failed to update pastry material ingredient:", error);
        }
      }
    }
    for (const addOn of updatedData.addOns) {
      //Fourth step: delete all add ons marked for deletion
      if (addOn.forDeletion == "on") {
        try {
          const response = await api.delete(
            `/pastry-materials/${encodedId}/addOns/${addOn.pastryMaterialAddOnId}`
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
    for (const element of updatedData.subVariants) {
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
                      amountMeasurement: subVariantIngredient.amountMeasurement,
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
                      amountMeasurement: subVariantIngredient.amountMeasurement,
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
                  `/pastry-materials/${encodedId}/sub-variants/${element.pastryMaterialSubVariantId}/addOns/${subVariantAddOn.pastryMaterialSubVariantAddOnId}`
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
        designId: updatedData.designId,
        mainVariantName: updatedData.mainVariantName,
      });
    } catch (error) {
      console.error(
        "Failed to change pastry material linked design id:",
        error
      );
    }

    await fetchPastryMaterials();
    await parseFetchedData(pastryMaterials);
  };
  const handleManualSubtractSubmit = async (data) => {
    try {
      const response = await api.post(
        `/pastry-materials/${data.pastryMaterialId}/subtract-recipe-ingredients-on-inventory/${data.variant_id}`
      );
    } catch {
      console.log("Failed to subtract");
    }
  };
  const handleAddSubmit = async (e, dataToBeAdded) => {
    const encodedId = encodeURIComponent(e);
    var requestBody = {
      designId: dataToBeAdded.designId,
      mainVariantName: dataToBeAdded.mainVariantName,
      otherCost: {
        additionalCost: dataToBeAdded.otherCost.additionalCost
      },
      ingredients: [],
      addOns: [],
      subVariants: [],
    };
    dataToBeAdded.ingredients.forEach((x) => {
      requestBody.ingredients.push({
        itemId: x.itemId,
        ingredientType: x.ingredientType,
        amount: x.amount,
        amountMeasurement: x.amountMeasurement,
      });
    });
    dataToBeAdded.addOns.forEach((y) => {
      requestBody.addOns.push({ addOnsId: y.addOnsId, amount: y.amount });
    });
    dataToBeAdded.subVariants.forEach((x) => {
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

    await fetchPastryMaterials();
    await parseFetchedData(pastryMaterials);
  };
  const handleAddButtonClick = () => {
    setOpenAddModal(true);
  };
  const handleManualInventoryIngredientSubtraction = (id) => {
    const material = pastryMaterials.find(
      (material) => material.pastryMaterialId === id
    );
    setSelectedMaterial(material);
    setOpenManualSubtractModal(true);
  };
  const handleDelete = async (id) => {
    const material = pastryMaterials.find(
      (material) => material.pastryMaterialId === id
    );
    setSelectedMaterial(material);
    setOpenDeleteConfirmationModal(true);
  };
  const handleDeleteSubmit = async (data) => {
    try {
      await api.delete(`/pastry-materials/${data.pastryMaterialId}`);
      setPastryMaterials((prev) =>
        prev.filter(
          (material) => material.pastryMaterialId !== data.pastryMaterialId
        )
      );
    } catch (error) {
      console.error("Failed to delete pastry material:", error);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Header
        title="Pastry Materials"
        subtitle="The ingredients of something"
      ></Header>
      <Button
        onClick={handleAddButtonClick}
        variant="contained"
        color="primary"
      >
        Add new Pastry Material
      </Button>
      <DataGridStyler>
        <DataGrid
          rows={pastryMaterialRows}
          columns={columns}
          getRowId={(row) => row.pastryMaterialId}
          components={{ Toolbar: GridToolbar }}
        />
      </DataGridStyler>
      <UpdatePastryMaterialModal
        open={openEditModal}
        handleClose={() => setOpenEditModal(false)}
        material={selectedMaterial}
        handleUpdate={handleUpdateSubmit}
      />
      <AddPastryMaterialModal
        open={openAddModal}
        handleClose={() => setOpenAddModal(false)}
        handleAdd={handleAddSubmit}
      />
      <ManualSubtractionModal
        open={openManualSubtractModal}
        handleClose={() => setOpenManualSubtractModal(false)}
        material={selectedMaterial}
        handleDelete={(data) => handleManualSubtractSubmit(data)}
      />
      <DeleteConfirmationModal
        open={openDeleteConfirmationModal}
        handleClose={() => setOpenDeleteConfirmationModal(false)}
        material={selectedMaterial}
        handleDelete={handleDeleteSubmit}
      />
    </Box>
  );
};
export default PastryMaterial;
