import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import { renderTimeViewClock } from "@mui/x-date-pickers";
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
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import api from "../../../api/axiosConfig";
import DataGridStyler from "./../../../components/DataGridStyler.tsx";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Restore as RestoreIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  AddCircle as AddIcon,
  Warehouse as WarehouseIcon,
  ArrowDropDown,
} from "@mui/icons-material";
import { Batch, Ingredient } from "../../../utils/Schemas.js";
import { Tokens } from "../../../Theme.ts";
import { useAlert } from "../../../components/CuloAlert.tsx";
import { useFormik } from "formik";
import { Helmet } from "react-helmet-async";
import { toCurrency } from "../../../utils/Formatter.ts";

const Inventory = () => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);

  const { makeAlert } = useAlert();
  const apiRef = useGridApiRef();
  const [tempRows, setTempRows] = useState<Ingredient[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [unitMapping, setUnitMapping] = useState<Record<string, string[]>>();
  const [iterator, setIterator] = useState(0);

  const [batches, setBatches] = useState<Batch[]>([]);
  const [open, setOpen] = useState(false);
  const handleOpenBatchDialog = (
    id: string,
    name: string,
    price: number,
    measurement: string
  ) => {
    setValues({ id, name, price, measurement, quantity: 0 });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(function () {
      resetForm();
    }, 50);
  };

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
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    await api.get("ingredients/batches").then((response) => {
      const parsedBatches: Batch[] = response.data.map((batch: any) => ({
        id: batch.id,
        itemId: batch.itemId,
        price: batch.price,
        quantity: batch.quantity,
        expiration: batch.expiration,
        created: batch.created,
        lastModified: batch.lastModified,
        lastModifiedBy: batch.lastModifiedBy,
      }));
      setBatches(parsedBatches);
    });
  };

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
      quantity: 0,
      price: 0,
      measurements: "Piece",
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

    if (!hasChanged) {
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
        makeAlert("success", "Added new ingredient");
      } else {
        await api.patch(`ingredients/${updatedRow.id}`, changedFields); // Send only changed fields
        makeAlert("success", "Updated ingredient");
      }
      fetchData(); // Refresh data after update
    } catch (error) {
      console.error("Error updating ingredient:", error);
      makeAlert("error", "Error updating ingredient");
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
        makeAlert("success", "Deleted ingredient");
        fetchData(); // Refresh data after archive
      } catch (error) {
        console.error("Error deleting ingredient:", error);
        makeAlert("error", "Failed to delete ingredient");
      }
    }
  };

  const handleClickRestore = async (id: string) => {
    {
      try {
        await api.patch("ingredients", null, { params: { restore: id } });
        makeAlert("success", "Restored ingredient");
        fetchData(); // Refresh data after restore
      } catch (error) {
        console.error("Error restoring ingredient:", error);
        makeAlert("error", "Failed to restore ingredient");
      }
    }
  };

  // Batches

  const onSubmit = async () => {
    try {
      api.post(`ingredients/${values.id}/batches`, {
        price: values.price,
        quantity: values.quantity,
        expiration: values.expiration
      });
      makeAlert("success", "Successfully added batch");
    } catch (error) {
      console.error(error);
      makeAlert("error", "Failed to add batch");
    } finally {
      handleClose();
    }
  };

  const { values, errors, setValues, isSubmitting, handleChange, resetForm } =
    useFormik({
      initialValues: {
        id: "",
        name: "",
        price: 0,
        quantity: 0,
        measurement: "",
      },
      onSubmit,
    });

  const columns: GridColDef[] = [
    {
      field: "action",
      type: "actions",
      minWidth: 120,
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
              icon={<AddIcon />}
              label="Add"
              onClick={() =>
                handleOpenBatchDialog(
                  params.row.id,
                  params.row.name,
                  params.row.price,
                  params.row.measurement
                )
              }
              color="success"
            />,
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
        return toCurrency(params.value);
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
      <Helmet>
        <title>{"Inventory - The Pink Butter Cake Studio"}</title>
      </Helmet>
      <Header title="INVENTORY" subtitle="Manage your ingredients" />
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
          <Box sx={{ minWidth: 400, mt: 8, p: 2 }}>
            <Header title="Batches" />
            <Box sx={{ mb: 2 }}>
              {batches.map((batch) => {
                const matchedIngredient = ingredients.find(
                  (ingredient) => ingredient.id === batch.itemId
                );

                const details = Object.entries(batch).filter(
                  ([key, _]) => key !== "id"
                );

                return (
                  <Accordion
                    key={batch.id}
                    sx={{ backgroundColor: colors.primary[100] }}
                  >
                    <AccordionSummary expandIcon={<ArrowDropDown />}>
                      {matchedIngredient
                        ? `${
                            matchedIngredient.name
                          }: ${batch.created.toLocaleString("en-PH", {
                            timeZone: "UTC",
                          })}`
                        : `Unknown Ingredient (${batch.itemId})`}
                    </AccordionSummary>
                    <AccordionDetails>
                      {details.map(([key, value]) => (
                        <Box key={key} sx={{ marginBottom: 1 }}>
                          <Typography variant="body1">
                            <strong>{key}:</strong> {String(value)}
                          </Typography>
                        </Box>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Box>
          </Box>
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
                isActive: false,
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

      {/* Batch Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{`Add Batch: ${values.name}`}</DialogTitle>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                label="Price"
                id="price"
                name="price"
                value={values.price}
                onChange={handleChange}
                slotProps={{
                  htmlInput: {
                    type: "number",
                    min: 0,
                  },
                }}
                size="small"
              />
              <TextField
                label={`${values.measurement}s bought`}
                id="quantity"
                name="quantity"
                value={values.quantity}
                onChange={handleChange}
                slotProps={{
                  htmlInput: {
                    type: "number",
                    step: ".01",
                    min: 0,
                  },
                }}
                size="small"
              />
              <DateTimePicker
                label="Pickup Date & Time"
                name="pickupDateTime"
                value={values.expiration}
                minTime={dayjs("2018-01-01T09:00")}
                maxTime={dayjs("2018-01-01T16:00")}
                onChange={(date) => handleChange("pickupDateTime", date)}
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
                ampm={false}
              />

            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              OK
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default Inventory;
