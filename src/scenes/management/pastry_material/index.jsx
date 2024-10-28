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
import DataGridStyler from "./../../../components/DataGridStyler.tsx";

const PastryMaterial = () => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);

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
      await fetchPastryMaterials();
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
        additionalCost: dataToBeAdded.otherCost.additionalCost,
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

  return (
    <>
      <Header
        title="PASTRY MATERIALS"
        subtitle="Compiled lists of ingredients for designs"
      ></Header>
      {/* <Button
        onClick={handleAddButtonClick}
        hidden={true}
        variant="contained"
        color="primary"
      >
        {"Add new Pastry Material"}
      </Button> */}
      <DataGridStyler>
        <DataGrid
          rows={pastryMaterialRows}
          columns={columns}
          getRowId={(row) => row.pastryMaterialId}
          slots={{ toolbar: GridToolbar }}
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
    </>
  );
};
export default PastryMaterial;
