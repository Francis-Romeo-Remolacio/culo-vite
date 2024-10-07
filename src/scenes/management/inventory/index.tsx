import { useState, useEffect } from "react";
import { Button, Chip } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
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
import { Edit, Delete, Restore, Save, Cancel } from "@mui/icons-material";
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
      const parsedIngredients = response.data.map((ingredient: any) => ({
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
      }));
      setIngredients(parsedIngredients as any);
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

  const handleEditClick = (id: GridRowId) => {
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.Edit },
    }));
  };

  const handleSaveClick = async (ingredient: Ingredient) => {
    setRowModesModel((prev) => ({
      ...prev,
      [ingredient.id]: { mode: GridRowModes.View },
    }));
    if (String(ingredient.id).includes("tempId")) {
      setRows((prevRows) => prevRows.filter((row) => row.id !== ingredient.id));
      await api.post("ingredients", ingredient);
    } else {
      try {
        await api.patch(`ingredients/${ingredient.id}`, {
          name: ingredient.name,
          quantity: ingredient.quantity,
          measurements: ingredient.measurement,
          price: ingredient.price,
          type: ingredient.type,
        });
        fetchData(); // Refresh data after update
      } catch (error) {
        console.error("Error updating ingredient:", error);
      }
    }
  };

  const handleCancelClick = (id: GridRowId) => {
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
              icon={<Save />}
              label="Save"
              onClick={(event) => {
                event.stopPropagation(); // Prevent row click event
                handleSaveClick(params.row);
              }}
              color="success"
            />,
            <GridActionsCellItem
              icon={<Cancel />}
              label="Cancel"
              onClick={() => handleCancelClick(params.row.id)}
              color="inherit"
            />,
          ];
        }

        if (params.row.isActive) {
          return [
            <GridActionsCellItem
              icon={<Edit />}
              label="Edit"
              onClick={() => handleEditClick(params.row.id)}
              color="primary"
            />,
            <GridActionsCellItem
              icon={<Delete />}
              label="Delete"
              onClick={() => handleClickDelete(params.row.id)}
              color="error"
            />,
          ];
        } else {
          return [
            <GridActionsCellItem
              icon={<Edit />}
              label="Edit"
              onClick={() => handleEditClick(params.row.id)}
              color="primary"
            />,
            <GridActionsCellItem
              icon={<Restore />}
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
      cellClassName: "name-column--cell",
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
            return <Chip label="Good" color="success"></Chip>;
          case "mid":
            return <Chip label="Caution" color="warning"></Chip>;
          case "critical":
            return <Chip label="Critical" color="error"></Chip>;
          default:
            return <Chip label={params.value}></Chip>;
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
      editable: true,
      width: 100,
    },
    {
      field: "bad",
      headerName: "Critical Threshold",
      editable: true,
      width: 100,
    },
  ];

  return (
    <>
      <Header title="Inventory" subtitle="Manage your ingredients" />
      <Button onClick={handleClickAdd} variant="contained" sx={{ mb: 2 }}>
        Add Ingredient
      </Button>
      <DataGridStyler>
        <DataGrid
          apiRef={apiRef}
          rows={rows}
          columns={columns}
          editMode="row"
          rowHeight={60}
          getRowId={(row) => row.id}
          rowModesModel={rowModesModel}
          onRowEditStop={handleRowEditStop}
          slots={{ toolbar: GridToolbar }}
          processRowUpdate={(newRow, oldRow) => {
            if (newRow.type !== oldRow.type) {
              newRow.measurement = undefined; // Reset measurement if type changes
            }
            return newRow;
          }}
        />
      </DataGridStyler>
    </>
  );
};

export default Inventory;
