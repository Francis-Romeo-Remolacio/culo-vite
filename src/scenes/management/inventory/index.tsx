import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Autocomplete,
  Chip,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import Header from "../../../components/Header";
import api from "../../../api/axiosConfig";
import DataGridStyler from "./../../../components/DataGridStyler.tsx";
import { Edit, Delete, Restore } from "@mui/icons-material";
import { useFormik } from "formik";
import { ingredientSchema } from "../../../utils/Validation.js";
import { Units } from "../../../utils/Schemas.js";
import { Dayjs } from "dayjs";

const Inventory = () => {
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState<any>({});
  const [validUnits, setValidUnits] = useState<Units>();
  const [formData, setFormData] = useState({
    name: "",
    quantity: 0,
    measurement: "",
    price: 0,
    type: "",
    good: 0,
    bad: 0,
  });
  const [priceLabel, setPriceLabel] = useState("Price");
  const [error, setError] = useState(null);

  const onSubmit = async () => {
    try {
      switch (mode) {
        case "add":
          await api.post(`ingredient`, values);
          break;
        case "edit":
          await api.patch(`ingredient/${values.id}`, values);
          break;
      }
      setOpen(false);
      fetchData();
    } catch (error) {
      console.error("Registration error: ", error);
    }
  };

  const {
    values,
    isSubmitting,
    handleChange,
    setValues,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues: {
      id: "",
      name: "",
      quantity: null,
      measurement: "",
      price: null,
      type: "",
      good: null,
      bad: null,
    },
    validationSchema: ingredientSchema,
    onSubmit,
  });

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await api.get("/ui-helpers/valid-measurement-values");
        setValidUnits(response.data);
      } catch (error) {
        console.error("Error fetching valid measurement units:", error);
      }
    };
    fetchUnits();
  }, []);

  const fetchData = async () => {
    try {
      await api.get("ingredients").then((response) => {
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
        setRows(parsedIngredients as any);
      });
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.type === "count") {
      setFormData((prevData) => ({
        ...prevData,
        measurement: "Piece",
      }));
    }
  }, [formData.type]);

  useEffect(() => {
    if (values.type === "count") {
      setFieldValue("measurement", "piece");
    }
  }, [values.type]);

  const handleAddNew = () => {
    resetForm;
    setSelectedRow([]);
    setOpen(true);
  };

  const handleClickEdit = (row: any) => {
    setSelectedRow(row);
    setValues(row);
    setOpen(true);
  };

  const handleClickDelete = async (id: string) => {
    try {
      await api.delete(`ingredients/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting ingredient:", error);
    }
  };

  const handleClickRestore = async (id: string) => {
    try {
      await api.put("ingredients", null, { params: { restore: id } });
      fetchData();
    } catch (error) {
      console.error("Error reactivating ingredient:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    values.measurement.length > 0
      ? setPriceLabel(`Price per ${values.measurement}`)
      : setPriceLabel("Price");
  }, [values]);

  const columns: GridColDef[] = [
    {
      field: "action",
      type: "actions",
      minWidth: 100,
      renderCell: (params: any) => (
        <>
          <IconButton
            color="primary"
            onClick={() => handleClickEdit(params.row)}
          >
            <Edit />
          </IconButton>
          {params.row.isActive ? (
            <IconButton
              color="error"
              onClick={() => handleClickDelete(params.row.id)}
            >
              <Delete />
            </IconButton>
          ) : (
            <IconButton
              color="success"
              onClick={() => handleClickRestore(params.row.id)}
            >
              <Restore />
            </IconButton>
          )}
        </>
      ),
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
    },
    {
      field: "type",
      headerName: "Type",
    },
    {
      field: "quantity",
      headerName: "Quantity",
    },
    {
      field: "price",
      headerName: "Price",
      renderCell: (params: any) => {
        if (!params.value) return "";
        const finalFormat = `₱ ${params.value}`;
        return finalFormat;
      },
    },
    {
      field: "measurement",
      headerName: "Measurement",
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
            return <Chip label="Running Out" color="error"></Chip>;
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
      headerName: "Last Updated By",
    },
    {
      field: "lastUpdated",
      headerName: "Last Updated",
      type: "date",
    },
    {
      field: "isActive",
      headerName: "Active",
      type: "boolean",
    },
  ];

  return (
    <>
      <Header title="INVENTORY" subtitle="Items and Updates" />
      <Button
        variant="contained"
        onClick={() => {
          handleAddNew;
        }}
      >
        Add Ingredient
      </Button>
      <DataGridStyler>
        <DataGrid
          rows={rows}
          columns={columns}
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
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {selectedRow.id ? "Edit Ingredient" : "Add New Ingredient"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              autoFocus
              required
              id="name"
              name="name"
              label="Name"
              fullWidth
              variant="filled"
              value={values.name}
              onChange={handleChange}
            />
            <FormControl required variant="filled" fullWidth>
              <InputLabel id="typeLabel">Type</InputLabel>
              <Select
                labelId="typeLabel"
                id="type"
                name="type"
                label="Type"
                value={values.type}
                onChange={handleChange}
              >
                <MenuItem value={"solid"}>Solid</MenuItem>
                <MenuItem value={"liquid"}>Liquid</MenuItem>
                <MenuItem value={"count"}>Count</MenuItem>
              </Select>
            </FormControl>
            {values.type ? (
              values.type == "count" ? (
                <FormControl required variant="filled" fullWidth>
                  <InputLabel id="measurementLabel">Measurement</InputLabel>
                  <Select
                    labelId="measurementLabel"
                    id="measurement"
                    name="measurement"
                    label="Measurement"
                    value="Piece"
                    defaultValue="Piece"
                    disabled
                    onChange={handleChange}
                  >
                    <MenuItem value="Piece">Piece</MenuItem>
                  </Select>
                </FormControl>
              ) : (
                <Autocomplete
                  id="measurement"
                  value={values.measurement}
                  disablePortal
                  options={
                    validUnits
                      ? values.type === "solid"
                        ? validUnits?.Mass
                        : validUnits?.Volume
                      : []
                  }
                  ListboxProps={{ style: { maxHeight: 128 } }}
                  onChange={handleChange}
                  disableClearable
                  renderInput={(params) => (
                    <TextField
                      required
                      {...params}
                      label="Measurement"
                      variant="filled"
                      value={values.measurement}
                    />
                  )}
                />
              )
            ) : (
              <></>
            )}
            <TextField
              required
              label={priceLabel}
              id="price"
              name="price"
              value={values.price}
              onChange={handleChange}
              type="number"
              fullWidth
              variant="filled"
            />
            <TextField
              required
              label="Quantity"
              id="quantity"
              name="quantity"
              value={values.quantity}
              onChange={handleChange}
              type="number"
              fullWidth
              variant="filled"
            />
            <TextField
              required
              label="Good Threshold"
              id="good"
              name="good"
              value={values.good}
              onChange={handleChange}
              type="number"
              fullWidth
              variant="filled"
            />
            <TextField
              required
              label="Bad Threshold"
              id="bad"
              name="bad"
              value={values.bad}
              onChange={handleChange}
              type="number"
              fullWidth
              variant="filled"
            />
          </Stack>
          {error ? <Typography color="error">{error}</Typography> : <></>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {!isSubmitting ? (
              selectedRow.id ? (
                "Save"
              ) : (
                "Add"
              )
            ) : (
              <CircularProgress size={21} />
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Inventory;
