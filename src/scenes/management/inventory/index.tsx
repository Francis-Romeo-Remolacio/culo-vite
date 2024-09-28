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
import DataGridStyler from "./../../../components/DataGridStyler.jsx";
import { Edit, Delete, Restore } from "@mui/icons-material";
import { useFormik } from "formik";
import { ingredientSchema } from "../../../utils/Validation.js";
import { Units } from "../../../utils/Schemas.js";

const Team = () => {
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState<any>({});
  const [validUnits, setValidUnits] = useState<Units>();
  const [formData, setFormData] = useState({
    name: "",
    quantity: 0,
    measurements: "",
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
        case "edit":
          await api.patch(`ingredient/${values.id}`, values);
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
      const response = await api.get("ingredients/active");
      setRows(response.data);
    } catch (error) {
      console.error("Error fetching active ingredients:", error);
    }
    fetchData();
  };

  useEffect(() => {
    if (formData.type === "count") {
      setFormData((prevData) => ({
        ...prevData,
        measurements: "Piece",
      }));
    }
  }, [formData.type]);

  useEffect(() => {
    if (values.type === "count") {
      setFieldValue("measurements", "piece");
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
      field: "measurements",
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
      field: "createdAt",
      headerName: "Date Created",
      type: "date",
    },
    {
      field: "lastUpdatedBy",
      headerName: "Last Updated By",
    },
    {
      field: "lastUpdatedAt",
      headerName: "Last Updated Time",
      type: "date",
    },
    {
      field: "isActive",
      headerName: "Active",
      type: "boolean",
    },
    {
      field: "action",
      type: "actions",
      minWidth: 250,
      renderCell: (params: any) => (
        <>
          <IconButton
            color="primary"
            onClick={() => handleClickEdit(params.row)}
          >
            <Edit />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleClickDelete(params.row.id)}
          >
            <Delete />
          </IconButton>
          <IconButton
            color="success"
            onClick={() => handleClickRestore(params.row.id)}
          >
            <Restore />
          </IconButton>
        </>
      ),
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
                items: [{ field: "id", operator: "is", value: true }],
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
                  <InputLabel id="measurementsLabel">Measurement</InputLabel>
                  <Select
                    labelId="measurementsLabel"
                    id="measurements"
                    name="measurements"
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
                  id="measurements"
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

export default Team;
