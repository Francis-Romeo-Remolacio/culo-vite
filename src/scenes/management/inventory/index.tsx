import { useState, useEffect } from "react";
import { Box, Button, Chip, Drawer, Stack } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEditInputCell,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridToolbar,
  useGridApiRef,
} from "@mui/x-data-grid";
import Header from "../../../components/Header";
import api from "../../../api/axiosConfig";
import DataGridStyler from "./../../../components/DataGridStyler.tsx";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Restore as RestoreIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Warehouse as WarehouseIcon,
} from "@mui/icons-material";
import { Ingredient } from "../../../utils/Schemas.js";

const Inventory = () => {
  const apiRef = useGridApiRef();
  const [tempRows, setTempRows] = useState<Ingredient[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [unitMapping, setUnitMapping] = useState<Record<string, string[]>>();
  const [iterator, setIterator] = useState(0);

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const fetchData = async () => {
    try {
      const response = await api.get("ingredients");
      const parsedIngredients: Ingredient[] = response.data.map(
        (ingredient: any) => ({
          id: ingredient.id,
          name: ingredient.name,
          quantity: ingredient.quantity,
          measurement: ingredient.measurements,
          price: ingredient.price,
          status: ingredient.status,
          type: ingredient.type,
          created: new Date(ingredient.createdAt),
          lastUpdatedBy: ingredient.lastUpdatedBy,
          lastUpdated: new Date(ingredient.lastUpdatedAt),
          isActive: ingredient.isActive,
          good: ingredient.goodThreshold,
          bad: ingredient.criticalThreshold,
        })
      );
      setIngredients(parsedIngredients);
      setRows([...tempRows, ...parsedIngredients]);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await api.get("ui-helpers/valid-measurement-values");
        setUnitMapping({
          solid: response.data.Mass,
          liquid: response.data.Volume,
          count: response.data.Count,
        });
      } catch (error) {
        console.error("Error fetching valid measurement units:", error);
      }
    };
    fetchUnits();
  }, []);

  const handleClickAdd = () => {
    const newRow = {
      id: `tempId-${iterator}`,
      name: "New Item",
      type: "count",
      quantity: 1,
      price: 1,
      measurement: "Piece",
      good: 0,
      bad: 0,
      isActive: true,
    };
    setTempRows((prev) => [newRow, ...prev]);
    setRows((prev) => [newRow, ...prev]);
    setIterator(iterator + 1);

    setRowModesModel((prev) => ({
      ...prev,
      [newRow.id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  const handleClickEdit = (id: GridRowId) => {
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.Edit },
    }));
  };

  const handleClickSave = async (
    updatedRow: Ingredient,
    originalRow: Ingredient
  ) => {
    // Set the mode to view
    setRowModesModel((prev) => ({
      ...prev,
      [updatedRow.id as string]: { mode: GridRowModes.View },
    }));

    // Check if any fields have changed
    const hasChanged =
      originalRow.name !== updatedRow.name ||
      originalRow.quantity !== updatedRow.quantity ||
      originalRow.measurement !== updatedRow.measurement ||
      originalRow.price !== updatedRow.price ||
      originalRow.type !== updatedRow.type;

    console.log("Has Changed:", hasChanged);

    if (!hasChanged) {
      console.log("No changes detected. Skipping API call.");
      return updatedRow; // Return the original row since no changes are made
    }

    // Create an object to hold only the changed fields
    const changedFields: any = {};

    if (originalRow.name !== updatedRow.name) {
      changedFields.name = updatedRow.name;
    }
    if (originalRow.quantity !== updatedRow.quantity) {
      changedFields.quantity = updatedRow.quantity;
    }
    if (originalRow.measurement !== updatedRow.measurement) {
      changedFields.measurements = updatedRow.measurement;
    }
    if (originalRow.price !== updatedRow.price) {
      changedFields.price = updatedRow.price;
    }
    if (originalRow.type !== updatedRow.type) {
      changedFields.type = updatedRow.type;
    }

    // Handle temporary IDs and API calls
    try {
      if (String(updatedRow.id).includes("tempId")) {
        setRows((prevRows) =>
          prevRows.filter((row) => row.id !== updatedRow.id)
        );
        await api.post("ingredients", updatedRow); // For new items, send the entire updatedRow
      } else {
        await api.patch(`ingredients/${updatedRow.id}`, changedFields); // Send only changed fields
      }
      fetchData(); // Refresh data after update
    } catch (error) {
      console.error("Error updating ingredient:", error);
      // You might want to handle the error accordingly
    }

    return updatedRow; // Return the updated row to the DataGrid
  };

  const handleClickCancel = (id: GridRowId) => {
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    }));

    const isInTempRows = tempRows.some((row) => row.id === id);
    if (isInTempRows) {
      setTempRows((prev) => prev.filter((row) => row.id !== id));
      setRows((prev) => prev.filter((row) => row.id !== id));
    }
  };

  const handleClickDelete = async (id: string) => {
    if (String(id).includes("tempId")) {
      const newRows = tempRows.filter((row) => row.id !== id);
      setTempRows(newRows);
      setRows([...newRows, ...ingredients]);
    } else {
      try {
        await api.delete(`ingredients/${id}`);
        fetchData(); // Refresh data after archive
      } catch (error) {
        console.error("Error deleting ingredient:", error);
      }
    }
  };

  const handleClickRestore = async (id: string) => {
    {
      try {
        await api.patch("ingredients", null, { params: { restore: id } });
        fetchData(); // Refresh data after restore
      } catch (error) {
        console.error("Error restoring ingredient:", error);
      }
    }
  };

  const columns: GridColDef[] = [
    {
      field: "action",
      type: "actions",
      minWidth: 100,
      getActions: (params) => {
        const isInEditMode =
          rowModesModel[params.id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={(event) => {
                event.stopPropagation(); // Prevent row click event
                setRowModesModel((prev) => ({
                  ...prev,
                  [params.row.id as string]: { mode: GridRowModes.View },
                }));
              }}
              color="success"
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              onClick={() => handleClickCancel(params.row.id)}
              color="inherit"
            />,
          ];
        }

        if (params.row.isActive) {
          return [
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              onClick={() => handleClickEdit(params.row.id)}
              color="primary"
            />,
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() => handleClickDelete(params.row.id)}
              color="error"
            />,
          ];
        } else {
          return [
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              onClick={() => handleClickEdit(params.row.id)}
              color="primary"
            />,
            <GridActionsCellItem
              icon={<RestoreIcon />}
              label="Restore"
              onClick={() => handleClickRestore(params.row.id)}
              color="success"
            />,
          ];
        }
      },
    },
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "name",
      headerName: "Name",
      cellClassName: "name-column--cell",
      minWidth: 200,
      editable: true,
    },
    {
      field: "type",
      headerName: "Type",
      editable: true,
      type: "singleSelect",
      valueOptions: [
        { value: "solid", label: "Dry Mats." },
        { value: "liquid", label: "Wet Mats." },
        { value: "count", label: "Count" },
      ],
    },
    {
      field: "quantity",
      headerName: "Quantity",
      editable: true,
      type: "number",
      width: 80,
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      renderCell: (params: any) => {
        if (!params.value) return "";
        return `₱${params.value.toFixed(2)}`;
      },
      editable: true,
      width: 80,
    },
    {
      field: "measurement",
      headerName: "Measurement",
      editable: true,
      type: "singleSelect",
      valueOptions: (params: any) => {
        const type = params.row.type; // `solid`, `liquid`, or `count`
        return unitMapping ? unitMapping[type] : [];
      },
    },
    {
      field: "status",
      headerName: "Status",
      renderCell: (params: any) => {
        switch (params.value) {
          case "good":
            return <Chip label="Good" color="success" />;
          case "mid":
            return <Chip label="Caution" color="warning" />;
          case "critical":
            return <Chip label="Critical" color="error" />;
          default:
            return <Chip label={`${params.value}`}></Chip>;
        }
      },
    },
    {
      field: "created",
      headerName: "Created",
      type: "date",
    },
    {
      field: "lastUpdatedBy",
      headerName: "Updated By",
    },
    {
      field: "lastUpdated",
      headerName: "Last Updated",
      type: "date",
    },
    {
      field: "good",
      headerName: "Good Threshold",
      type: "number",
      editable: true,
      renderEditCell: (params) => (
        <GridEditInputCell
          {...params}
          inputProps={{
            max: 999,
            min: 0,
          }}
        />
      ),
      width: 100,
    },
    {
      field: "bad",
      headerName: "Critical Threshold",
      type: "number",
      editable: true,
      renderEditCell: (params) => (
        <GridEditInputCell
          {...params}
          inputProps={{
            max: 999,
            min: 0,
          }}
        />
      ),
      width: 100,
    },
    {
      field: "isActive",
      headerName: "Active",
      type: "boolean",
    },
  ];

  const [batchesOpen, setBatchesOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setBatchesOpen(newOpen);
  };

  return (
    <>
      <Header title="Inventory" subtitle="Manage your ingredients" />
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleClickAdd}
        >
          Add
        </Button>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchData}
        >
          Refresh
        </Button>
        <Button
          variant="contained"
          startIcon={<WarehouseIcon />}
          onClick={toggleDrawer(true)}
        >
          {"View Batches"}
        </Button>
        <Drawer open={batchesOpen} onClose={toggleDrawer(false)} anchor="right">
          <Box sx={{ minWidth: 400 }}></Box>
        </Drawer>
      </Stack>
      <DataGridStyler>
        <DataGrid
          apiRef={apiRef}
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={async (updatedRow, originalRow) => {
            const result = await handleClickSave(updatedRow, originalRow);
            return result; // Return the updated row to the DataGrid
          }}
          onProcessRowUpdateError={(error) => console.error(error)}
          slots={{ toolbar: GridToolbar }}
          initialState={{
            columns: {
              columnVisibilityModel: {
                id: false,
              },
            },
            filter: {
              filterModel: {
                items: [{ field: "isActive", operator: "is", value: true }],
              },
            },
          }}
        />
      </DataGridStyler>
    </>
  );
};

export default Inventory;
