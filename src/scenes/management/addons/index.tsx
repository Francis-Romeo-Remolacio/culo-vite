import { useState, useEffect } from "react";
import { Button, Stack } from "@mui/material";
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
import {
  Edit,
  Delete,
  Save,
  Cancel,
  Refresh,
  Add,
  Restore,
} from "@mui/icons-material";
import { ManagementAddOn } from "../../../utils/Schemas.js";
import { Helmet } from "react-helmet-async";
import { toCurrency } from "../../../utils/Formatter.ts";

const AddOns = () => {
  const apiRef = useGridApiRef();
  const [tempRows, setTempRows] = useState<ManagementAddOn[]>([]);
  const [addOns, setAddOns] = useState<ManagementAddOn[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
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
      const response = await api.get("add-ons");
      const parsedAddOns: ManagementAddOn[] = response.data.map(
        (addOn: any) => ({
          id: addOn.id,
          name: addOn.addOnName,
          price: addOn.price,
          measurement: addOn.measurement,
          created: new Date(addOn.dateAdded),
          lastModified: new Date(addOn.lastModifiedDate),
        })
      );
      setAddOns(parsedAddOns);
      setRows([...tempRows, ...parsedAddOns]);
    } catch (error) {
      console.error("Error fetching add-ons:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClickAdd = () => {
    const newRow = {
      id: `tempId-${iterator}`,
      name: "New Add-On",
      price: 0,
      measurement: "Piece",
      created: new Date(),
      lastModified: new Date(),
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
    updatedRow: ManagementAddOn,
    originalRow: ManagementAddOn
  ) => {
    // Set the mode to view
    setRowModesModel((prev) => ({
      ...prev,
      [updatedRow.id]: { mode: GridRowModes.View },
    }));

    // Check if any fields have changed
    const hasChanged =
      originalRow.name !== updatedRow.name ||
      originalRow.price !== updatedRow.price ||
      originalRow.measurement !== updatedRow.measurement;

    if (!hasChanged) {
      return updatedRow; // Return the original row since no changes are made
    }

    // Create an object to hold only the changed fields
    const changedFields: any = {};

    if (originalRow.name !== updatedRow.name) {
      changedFields.name = updatedRow.name;
    }
    if (originalRow.price !== updatedRow.price) {
      changedFields.price = updatedRow.price;
    }
    if (originalRow.measurement !== updatedRow.measurement) {
      changedFields.measurement = updatedRow.measurement;
    }

    // Handle temporary IDs and API calls
    try {
      if (String(updatedRow.id).includes("tempId")) {
        setRows((prevRows) =>
          prevRows.filter((row) => row.id !== updatedRow.id)
        );
        await api.post("add-ons", updatedRow); // For new add-ons, send the entire updatedRow
      } else {
        await api.patch(`add-ons/${updatedRow.id}`, changedFields); // Send only changed fields
      }
      fetchData(); // Refresh data after update
    } catch (error) {
      console.error("Error updating add-on:", error);
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
      setRows([...newRows, ...addOns]);
    } else {
      try {
        await api.delete(`add-ons/${id}`);
        fetchData();
      } catch (error) {
        console.error("Error deleting add-on:", error);
      }
    }
  };

  const handleClickRestore = async (id: string) => {
    try {
      await api.patch("add-ons", null, { params: { restore: id } });
      fetchData();
    } catch (error) {
      console.error("Error restoring add-on:", error);
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
        // const secondAction = params.row.isActive ? (
        //   <GridActionsCellItem
        //     icon={<Delete />}
        //     label="Delete"
        //     onClick={() => handleClickDelete(params.row.id)}
        //     color="error"
        //   />
        // ) : (
        //   <GridActionsCellItem
        //     icon={<Restore />}
        //     label="Restore"
        //     onClick={() => handleClickRestore(params.row.id)}
        //     color="success"
        //   />
        // );
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<Save />}
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
              icon={<Cancel />}
              label="Cancel"
              onClick={() => handleClickCancel(params.row.id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<Edit />}
            label="Edit"
            onClick={() => handleClickEdit(params.row.id)}
            color="primary"
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label="Delete"
            onClick={() => handleClickDelete(params.row.id)}
            color="error"
          />,
        ];
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
      field: "price",
      headerName: "Price",
      type: "number",
      renderCell: (params: any) => {
        if (!params.value) return "";
        return toCurrency(params.value);
      },
      editable: true,
      width: 80,
    },
    {
      field: "measurement",
      headerName: "Measurement",
      editable: true,
      width: 150,
    },
    {
      field: "created",
      headerName: "Created",
      type: "date",
    },
    {
      field: "lastModified",
      headerName: "Last Modified",
      type: "date",
    },
  ];

  return (
    <>
      <Helmet>
        <title>{"Add-Ons - Cake Studio"}</title>
      </Helmet>
      <Header title="ADD-ONS" subtitle="Manage your add-ons" />
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleClickAdd}
        >
          Add
        </Button>
        <Button variant="contained" startIcon={<Refresh />} onClick={fetchData}>
          Refresh
        </Button>
      </Stack>

      <DataGridStyler>
        <DataGrid
          apiRef={apiRef}
          rows={rows}
          columns={columns}
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

export default AddOns;
