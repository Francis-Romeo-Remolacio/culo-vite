import React, { useState, useEffect } from "react";
import {
  Button,
  useTheme,
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
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../../../components/Header";
import api from "../../../api/axiosConfig";
import DataGridStyler from "./../../../components/DataGridStyler.jsx";
import { Edit, Delete, Restore } from "@mui/icons-material";

const Team = () => {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const [validUnits, setValidUnits] = useState([]);
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

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.type === "count") {
      setFormData((prevData) => ({
        ...prevData,
        measurements: "Piece",
      }));
    }
  }, [formData.type]);

  const fetchData = async () => {
    try {
      const response = await api.get("ingredients/active");
      setRows(response.data);
    } catch (error) {
      console.error("Error fetching active ingredients:", error);
    }
  };

  const handleAddNew = () => {
    setFormData({
      quantity: "",
      price: "",
      name: "",
      measurements: "",
      type: "",
      good: "",
      bad: "",
    });
    setSelectedRow({});
    setOpen(true);
  };

  const handleClickEdit = (row) => {
    setSelectedRow(row);
    setFormData({
      quantity: row.quantity,
      price: row.price,
      name: row.name,
      measurements: row.measurements,
      type: row.type,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      const requestData = {
        name: formData.name,
        quantity: formData.quantity,
        measurements: formData.measurements,
        price: formData.price,
        type: formData.type,
        good: formData.good,
        bad: formData.bad,
      };

      if (selectedRow.id) {
        const response = await api.patch(
          `ingredients/${selectedRow.id}`,
          requestData
        );
        console.log("Ingredient saved successfully:", response.data);
      } else {
        const response = await api.post("ingredients", requestData);
        console.log("Ingredient saved successfully:", response.data);
      }

      setOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error saving ingredient:", error);
    }
  };

  const handleClickDelete = async (id) => {
    try {
      // Sending a DELETE request to the server with the specified ingredient ID
      const response = await api.delete(`ingredients/${id}`);

      // Logging the response from the server
      console.log("Ingredient deleted successfully:", response.data);

      // Refreshing the data to reflect the deletion
      fetchData();
    } catch (error) {
      // Logging any errors that occur during the request
      console.error("Error deleting ingredient:", error);
    }
  };

  const handleClickRestore = async (id) => {
    try {
      const response = await api.put("ingredients", null, {
        params: { restore: id },
      });
      console.log("Ingredient reactivated successfully:", response.data);
      fetchData(); // Refresh the data after restoring
    } catch (error) {
      console.error("Error reactivating ingredient:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleMeasurementChange = (event, value) => {
    setFormData({
      ...formData,
      measurements: value,
    });
  };

  useEffect(() => {
    formData.measurements.length > 0
      ? setPriceLabel(`Price per ${formData.measurements}`)
      : setPriceLabel("Price");
  }, [formData]);

  const columns = [
    {
      field: "id",
      headerName: "ID",
      cellClassName: "name-column--cell",
      hide: true,
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
      renderCell: (params) => {
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
      renderCell: (params) => {
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
      renderCell: (params) => (
        <>
          <IconButton
            variant="outlined"
            color="primary"
            onClick={() => handleClickEdit(params.row)}
          >
            <Edit />
          </IconButton>
          <IconButton
            variant="outlined"
            color="error"
            onClick={() => handleClickDelete(params.row.id)}
          >
            <Delete />
          </IconButton>
          <IconButton
            variant="outlined"
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
      <Button variant="contained" color="primary" onClick={handleAddNew} mb={2}>
        Add Ingredient
      </Button>
      <DataGridStyler>
        <DataGrid
          rows={rows}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
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
              value={formData.name}
              onChange={handleInputChange}
            />
            <FormControl required variant="filled" fullWidth>
              <InputLabel id="typeLabel">Type</InputLabel>
              <Select
                labelId="typeLabel"
                id="type"
                name="type"
                label="Type"
                value={formData.type}
                onChange={handleInputChange}
              >
                <MenuItem value={"solid"}>Solid</MenuItem>
                <MenuItem value={"liquid"}>Liquid</MenuItem>
                <MenuItem value={"count"}>Count</MenuItem>
              </Select>
            </FormControl>
            {formData.type ? (
              formData.type == "count" ? (
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
                    onChange={handleInputChange}
                  >
                    <MenuItem value="Piece">Piece</MenuItem>
                  </Select>
                </FormControl>
              ) : (
                <Autocomplete
                  id="measurements"
                  name="measurements"
                  value={formData.measurements}
                  disablePortal
                  options={
                    formData.type === "solid"
                      ? validUnits.Mass
                      : validUnits.Volume
                  }
                  ListboxProps={{ style: { maxHeight: 128 } }}
                  onChange={handleMeasurementChange}
                  disableClearable
                  renderInput={(params) => (
                    <TextField
                      required
                      {...params}
                      label="Measurement"
                      variant="filled"
                      value={formData.measurements}
                    />
                  )}
                />
              )
            ) : (
              <></>
            )}
            <TextField
              required
              id="price"
              name="price"
              label={priceLabel}
              onChange={handleInputChange}
              type="number"
              fullWidth
              variant="filled"
              value={formData.price}
            />
            <TextField
              required
              id="quantity"
              name="quantity"
              label="Quantity"
              onChange={handleInputChange}
              type="number"
              fullWidth
              variant="filled"
              value={formData.quantity}
            />
            <TextField
              required
              label="Good Threshold"
              id="good"
              name="good"
              onChange={handleInputChange}
              type="number"
              fullWidth
              variant="filled"
              value={formData.good}
            />
            <TextField
              required
              label="Bad Threshold"
              id="bad"
              name="bad"
              onChange={handleInputChange}
              type="number"
              fullWidth
              variant="filled"
              value={formData.bad}
            />
          </Stack>
          {error ? <Typography color="error">{error}</Typography> : <></>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" onClick={handleSave}>
            {selectedRow.id ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Team;
