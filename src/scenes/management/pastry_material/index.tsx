import { useEffect, useState } from "react";
import {
  Box,
  useTheme,
  CircularProgress,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import { Tokens } from "../../../Theme";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
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
import {
  VariantAddOn,
  PastryMaterial as PastryMaterialType,
} from "../../../utils/Schemas.js";

const PastryMaterial = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [pastryMaterials, setPastryMaterials] = useState<PastryMaterialType[]>(
    []
  );
  const [pastryMaterialRows, setPastryMaterialRows] = useState<any[]>([]);

  // const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  // const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  // const [openManualSubtractModal, setOpenManualSubtractModal] =
  //   useState<boolean>(false);
  // const [openDeleteConfirmationModal, setOpenDeleteConfirmationModal] =
  //   useState<boolean>(false);

  // const [selectedMaterial, setSelectedMaterial] =
  //   useState<PastryMaterial | null>(null);

  const columns: GridColDef[] = [
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
      field: "ingredients",
      headerName: "Ingredients",
      flex: 0.35,
    },
    {
      field: "subVariants",
      headerName: "Sub Variants",
      flex: 0.25,
    },
    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   renderCell: (params: any) => (
    //     <Box>
    //       <IconButton onClick={() => handleUpdate(params.row.pastryMaterialId)}>
    //         <EditIcon />
    //       </IconButton>
    //       <IconButton onClick={() => handleDelete(params.row.pastryMaterialId)}>
    //         <DeleteIcon />
    //       </IconButton>
    //       <IconButton
    //         onClick={() =>
    //           handleManualInventoryIngredientSubtraction(
    //             params.row.pastryMaterialId
    //           )
    //         }
    //       >
    //         <GridRemoveIcon />
    //       </IconButton>
    //     </Box>
    //   ),
    //   flex: 0.15,
    //   sortable: false,
    //   filterable: false,
    // },
  ];

  const fetchPastryMaterials = async (): Promise<void> => {
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

  const parseFetchedData = async (
    dataToBeParsed: PastryMaterialType[]
  ): Promise<void> => {
    const parsedTagUses: any[] = [];
    dataToBeParsed.forEach((element) => {
      const parsedIngredients: string[] = [];
      element.ingredients.forEach((ingredient) => {
        parsedIngredients.push(" " + ingredient.itemName);
      });
      const parsedSubVariants: string[] = [];
      parsedSubVariants.push(element.mainVariantName);
      element.subVariants.forEach((subVariant) => {
        parsedSubVariants.push(" " + subVariant.subVariantName);
      });
      parsedTagUses.push({
        pastryMaterialId: element.pastryMaterialId,
        designId: element.designId,
        designName: element.designName,
        dateAdded: new Date(element.dateAdded),
        lastModifiedDate: new Date(element.lastModifiedDate),
        costEstimate: element.costEstimate,
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

  // const handleUpdate = async (id: string): Promise<void> => {
  //   const material = pastryMaterials.find(
  //     (material) => material.pastryMaterialId === id
  //   );
  //   setSelectedMaterial(material || null);
  //   setOpenEditModal(true);
  // };

  // const handleUpdateSubmit = async (
  //   id: string,
  //   updatedData: any
  // ): Promise<void> => {
  //   const encodedId = encodeURIComponent(id);

  //   for (const element of updatedData.ingredients) {
  //     if (element.forDeletion === "on") {
  //       try {
  //         await api.delete(
  //           `/pastry-materials/${encodedId}/ingredients/${element.ingredientId}`
  //         );
  //       } catch (error) {
  //         console.error("Failed to delete pastry material ingredient:", error);
  //       }
  //     }
  //     if (element.forInsertion === "on") {
  //       try {
  //         await api.post(`/pastry-materials/${encodedId}/ingredients`, {
  //           itemId: element.itemId,
  //           ingredientType: element.ingredientType,
  //           amount: element.amount,
  //           amountMeasurement: element.amountMeasurement,
  //         });
  //       } catch (error) {
  //         console.error("Failed to add pastry material ingredient:", error);
  //       }
  //     }
  //     if (
  //       element.forInsertion === "off" &&
  //       element.forDeletion === "off" &&
  //       element.changed === "on"
  //     ) {
  //       try {
  //         await api.patch(
  //           `/pastry-materials/${encodedId}/ingredients/${element.ingredientId}`,
  //           {
  //             itemId: element.itemId,
  //             ingredientType: element.ingredientType,
  //             amount: element.amount,
  //             amountMeasurement: element.amountMeasurement,
  //           }
  //         );
  //       } catch (error) {
  //         console.error("Failed to update pastry material ingredient:", error);
  //       }
  //     }
  //   }

  //   for (const addOn of updatedData.addOns) {
  //     if (addOn.forDeletion === "on") {
  //       try {
  //         await api.delete(
  //           `/pastry-materials/${encodedId}/addOns/${addOn.pastryMaterialAddOnId}`
  //         );
  //       } catch (error) {
  //         console.error(
  //           "Failed to delete add on " + addOn.pastryMaterialAddOnId,
  //           error
  //         );
  //       }
  //     } else {
  //       if (addOn.forInsertion === "off" && addOn.changed === "on") {
  //         try {
  //           await api.patch(
  //             `/pastry-materials/${encodedId}/add-ons/${addOn.pastryMaterialAddOnId}`,
  //             {
  //               addOnsId: addOn.addOnsId,
  //               amount: addOn.amount,
  //             }
  //           );
  //         } catch (error) {
  //           console.error(
  //             "Failed to update add on " + addOn.pastryMaterialAddOnId,
  //             error
  //           );
  //         }
  //       }
  //       if (addOn.forInsertion === "on") {
  //         try {
  //           await api.post(`/pastry-materials/${encodedId}/add-ons/`, {
  //             addOnsId: addOn.addOnsId,
  //             amount: addOn.amount,
  //           });
  //         } catch (error) {
  //           console.error("Failed to add add on to " + encodedId, error);
  //         }
  //       }
  //     }
  //   }

  //   for (const element of updatedData.subVariants) {
  //     if (element.forDeletion === "on") {
  //       try {
  //         await api.delete(
  //           `/pastry-materials/${encodedId}/sub-variants/${element.pastryMaterialSubVariantId}`
  //         );
  //       } catch (error) {
  //         console.error(
  //           `Failed to delete variant ${element.pastryMaterialSubVariantId}`
  //         );
  //       }
  //       continue;
  //     } else {
  //       if (element.forInsertion === "off") {
  //         if (element.changed === "on") {
  //           try {
  //             await api.patch(
  //               `/pastry-materials/${encodedId}/sub-variants/${element.pastryMaterialSubVariantId}`,
  //               { subVariantName: element.subVariantName }
  //             );
  //           } catch (error) {
  //             console.error(
  //               `Failed to update sub variant ${element.pastryMaterialSubVariantId}`
  //             );
  //           }
  //         }
  //         for (const subVariantIngredient of element.subVariantIngredients) {
  //           if (
  //             subVariantIngredient.forDeletion !== undefined &&
  //             subVariantIngredient.forDeletion === "on"
  //           ) {
  //             try {
  //               await api.delete(
  //                 `/pastry-materials/${encodedId}/sub-variants/${element.pastryMaterialSubVariantId}/ingredients/${subVariantIngredient.pastryMaterialSubVariantIngredientId}`
  //               );
  //             } catch (error) {
  //               console.error(
  //                 `Failed to delete sub variant ingredient ${element.pastryMaterialSubVariantIngredientId}`
  //               );
  //             }
  //             continue;
  //           } else {
  //             if (
  //               subVariantIngredient.forInsertion === "off" &&
  //               subVariantIngredient.changed === "on"
  //             ) {
  //               try {
  //                 await api.patch(
  //                   `/pastry-materials/${encodedId}/sub-variants/${element.pastryMaterialSubVariantId}/ingredients/${subVariantIngredient.pastryMaterialSubVariantIngredientId}`,
  //                   {
  //                     itemId: subVariantIngredient.itemId,
  //                     ingredientType: subVariantIngredient.ingredientType,
  //                     amount: subVariantIngredient.amount,
  //                     amountMeasurement: subVariantIngredient.amountMeasurement,
  //                   }
  //                 );
  //               } catch (error) {
  //                 console.error(
  //                   `Failed to update sub variant ingredient ${subVariantIngredient.pastryMaterialSubVariantIngredientId}`
  //                 );
  //               }
  //             }
  //             if (subVariantIngredient.forInsertion === "on") {
  //               try {
  //                 await api.post(
  //                   `/pastry-materials/${encodedId}/sub-variants/${element.pastryMaterialSubVariantId}/ingredients`,
  //                   {
  //                     itemId: subVariantIngredient.itemId,
  //                     ingredientType: subVariantIngredient.ingredientType,
  //                     amount: subVariantIngredient.amount,
  //                     amountMeasurement: subVariantIngredient.amountMeasurement,
  //                   }
  //                 );
  //               } catch (error) {
  //                 console.error(
  //                   `Failed to add new sub variant ingredient for ${element.pastryMaterialSubVariantId}`
  //                 );
  //               }
  //             }
  //           }
  //         }

  //         for (const subVariantAddOn of element.subVariantAddOns) {
  //           if (
  //             subVariantAddOn.forDeletion !== undefined &&
  //             subVariantAddOn.forDeletion === "on"
  //           ) {
  //             try {
  //               await api.delete(
  //                 `/pastry-materials/${encodedId}/sub-variants/${element.pastryMaterialSubVariantId}/addOns/${subVariantAddOn.pastryMaterialSubVariantAddOnId}`
  //               );
  //             } catch (error) {
  //               console.error(
  //                 `Failed to delete  sub variant add on ${subVariantAddOn.pastryMaterialSubVariantAddOnId}`
  //               );
  //             }
  //             continue;
  //           } else {
  //             if (
  //               subVariantAddOn.forInsertion === "off" &&
  //               subVariantAddOn.changed === "on"
  //             ) {
  //               try {
  //                 await api.patch(
  //                   `/pastry-materials/${encodedId}/sub-variants/${element.pastryMaterialSubVariantId}/addOns/${subVariantAddOn.pastryMaterialSubVariantAddOnId}`,
  //                   {
  //                     addOnsId: subVariantAddOn.addOnsId,
  //                     amount: subVariantAddOn.amount,
  //                   }
  //                 );
  //               } catch (error) {
  //                 console.error(
  //                   `Failed to update sub variant add on ${subVariantAddOn.pastryMaterialSubVariantAddOnId}`
  //                 );
  //               }
  //             }
  //             if (subVariantAddOn.forInsertion === "on") {
  //               try {
  //                 await api.post(
  //                   `/pastry-materials/${encodedId}/sub-variants/${element.pastryMaterialSubVariantId}/addOns`,
  //                   {
  //                     addOnsId: subVariantAddOn.addOnsId,
  //                     amount: subVariantAddOn.amount,
  //                   }
  //                 );
  //               } catch (error) {
  //                 console.error(
  //                   `Failed to add sub variant add on for ${element.pastryMaterialSubVariantId}`
  //                 );
  //               }
  //             }
  //           }
  //         }
  //       } else if (element.forInsertion === "on") {
  //         const requestBody = {
  //           subVariantName: element.subVariantName,
  //           subVariantIngredients: [],
  //           subVariantAddOns: [],
  //         };
  //         element.subVariantIngredients.forEach((subVariantIngredient: any) => {
  //           requestBody.subVariantIngredients.push({
  //             itemId: subVariantIngredient.itemId,
  //             ingredientType: subVariantIngredient.ingredientType,
  //             amount: subVariantIngredient.amount,
  //             amountMeasurement: subVariantIngredient.amountMeasurement,
  //           });
  //         });
  //         element.subVariantAddOns.forEach((subVariantAddOn: VariantAddOn) => {
  //           requestBody.subVariantAddOns.push({
  //             addOnsId: subVariantAddOn.addOnsId,
  //             amount: subVariantAddOn.amount,
  //           });
  //         });

  //         try {
  //           await api.post(
  //             `/pastry-materials/${encodedId}/sub-variants`,
  //             requestBody
  //           );
  //         } catch (error) {
  //           console.error(
  //             "Failed to add new variant " + element.subVariantName
  //           );
  //         }
  //       }
  //     }
  //   }

  //   try {
  //     await api.patch(`/pastry-materials/${encodedId}`, {
  //       designId: updatedData.designId,
  //       mainVariantName: updatedData.mainVariantName,
  //     });
  //   } catch (error) {
  //     console.error(
  //       "Failed to change pastry material linked design id:",
  //       error
  //     );
  //   }

  //   await fetchPastryMaterials();
  //   await parseFetchedData(pastryMaterials);
  // };

  // const handleManualSubtractSubmit = async (data: any): Promise<void> => {
  //   try {
  //     await api.post(
  //       `/pastry-materials/${data.pastryMaterialId}/subtract-recipe-ingredients-on-inventory/${data.variant_id}`
  //     );
  //   } catch {
  //     console.log("Failed to subtract");
  //   }
  // };

  // const handleAddSubmit = async (
  //   e: string,
  //   dataToBeAdded: any
  // ): Promise<void> => {
  //   const encodedId = encodeURIComponent(e);
  //   const requestBody = {
  //     designId: dataToBeAdded.designId,
  //     mainVariantName: dataToBeAdded.mainVariantName,
  //     ingredients: [],
  //     addOns: [],
  //     subVariants: [],
  //   };
  //   dataToBeAdded.ingredients.forEach((x: any) => {
  //     requestBody.ingredients.push({
  //       itemId: x.itemId,
  //       ingredientType: x.ingredientType,
  //       amount: x.amount,
  //       amountMeasurement: x.amountMeasurement,
  //     });
  //   });
  //   dataToBeAdded.addOns.forEach((y: any) => {
  //     requestBody.addOns.push({ addOnsId: y.addOnsId, amount: y.amount });
  //   });
  //   dataToBeAdded.subVariants.forEach((x: any) => {
  //     const newSubVariantBodyEntry = {
  //       subVariantName: x.subVariantName,
  //       subVariantIngredients: [],
  //       subVariantAddOns: [],
  //     };
  //     x.subVariantIngredients.forEach((y: any) => {
  //       newSubVariantBodyEntry.subVariantIngredients.push({
  //         itemId: y.itemId,
  //         ingredientType: y.ingredientType,
  //         amount: y.amount,
  //         amountMeasurement: y.amountMeasurement,
  //       });
  //     });
  //     x.subVariantAddOns.forEach((z: any) => {
  //       newSubVariantBodyEntry.subVariantAddOns.push({
  //         addOnsId: z.addOnsId,
  //         amount: z.amount,
  //       });
  //     });
  //     requestBody.subVariants.push(newSubVariantBodyEntry);
  //   });

  //   try {
  //     await api.post(`/pastry-materials/`, requestBody);
  //   } catch (error) {
  //     console.error("Failed to add pastry material:", error);
  //   }

  //   await fetchPastryMaterials();
  //   await parseFetchedData(pastryMaterials);
  // };

  // const handleAddButtonClick = (): void => {
  //   setOpenAddModal(true);
  // };

  // const handleManualInventoryIngredientSubtraction = (id: string): void => {
  //   const material = pastryMaterials.find(
  //     (material) => material.pastryMaterialId === id
  //   );
  //   setSelectedMaterial(material || null);
  //   setOpenManualSubtractModal(true);
  // };

  // const handleDelete = async (id: string): Promise<void> => {
  //   const material = pastryMaterials.find(
  //     (material) => material.pastryMaterialId === id
  //   );
  //   setSelectedMaterial(material || null);
  //   setOpenDeleteConfirmationModal(true);
  // };

  // const handleDeleteSubmit = async (data: any): Promise<void> => {
  //   try {
  //     await api.delete(`/pastry-materials/${data.pastryMaterialId}`);
  //     setPastryMaterials((prev) =>
  //       prev.filter(
  //         (material) => material.pastryMaterialId !== data.pastryMaterialId
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Failed to delete pastry material:", error);
  //   }
  // };

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
      {/* <Button
        onClick={handleAddButtonClick}
        variant="contained"
        color="primary"
      >
        Add new Pastry Material
      </Button> */}
      <DataGridStyler>
        <DataGrid
          rows={pastryMaterialRows}
          columns={columns}
          getRowId={(row) => row.pastryMaterialId}
          slots={{ toolbar: GridToolbar }}
        />
      </DataGridStyler>
      {/* <UpdatePastryMaterialModal
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
      /> */}
    </Box>
  );
};
export default PastryMaterial;
