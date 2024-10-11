import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridToolbar,
} from "@mui/x-data-grid";
import Header from "../../../components/Header";
import api from "../../../api/axiosConfig"; // Assuming api encapsulates Axios methods
import DataGridStyler from "./../../../components/DataGridStyler.tsx";
import EditIcon from "@mui/icons-material/Edit";
import { useFormik } from "formik";
import { ManagementAddOn } from "../../../utils/Schemas.js";

const AddOns = () => {
  const [rows, setRows] = useState<ManagementAddOn[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAddOnId, setSelectedAddOnId] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    fetchAddOns();
  }, []);

  const fetchAddOns = async () => {
    try {
      await api.get("/add-ons").then((response) => {
        const parsedAddOns: ManagementAddOn[] = response.data.map(
          (addOn: any) => ({
            id: addOn.id,
            name: addOn.addOnName,
            price: addOn.price,
            size: addOn.size,
            measurement: addOn.measurement,
            created: new Date(addOn.dateAdded),
            lastModified: new Date(addOn.lastModifiedDate),
          })
        );
        setRows(parsedAddOns);
      });
    } catch (error) {
      console.error("Error fetching add-ons:", error);
    }
  };

  const handleEditClick = (row: any) => {
    setSelectedAddOnId(row.id);
    formik.setValues({
      name: row.name,
      price: row.price,
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedAddOnId(null);
  };

  const handleSubmit = async (values: any) => {
    console.log("Submitting values:", values); // Debug: check values being submitted
    try {
      const response = await api.patch(`/add-ons/${selectedAddOnId}`, {
        name: values.name,
        price: values.price,
      });
      console.log("Add-On updated successfully:", response.data);
      fetchAddOns(); // Refresh the list after update
      handleCloseDialog(); // Close the dialog after update
    } catch (error) {
      console.error("Error updating add-on:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      price: 0,
    },
    onSubmit: handleSubmit,
  });

  const handleAddClick = () => {
    formikAdd.resetForm(); // Reset form values for new add-on
    setIsAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setIsAddDialogOpen(false);
  };

  const handleSubmitAdd = async (values: any) => {
    try {
      const response = await api.post("/add-ons", {
        name: values.addOnName,
        price: values.pricePerUnit,
        size: values.size,
      });
      console.log("Add-On added successfully:", response.data);
      fetchAddOns(); // Refresh the list after add
      handleCloseAddDialog(); // Close the add dialog after adding
    } catch (error) {
      console.error("Error adding add-on:", error);
    }
  };

  const formikAdd = useFormik({
    initialValues: {
      addOnName: "",
      pricePerUnit: 0,
      size: 0, // Include size if needed
    },
    onSubmit: handleSubmitAdd,
  });

  const columns: readonly GridColDef[] = [
    {
      field: "action",
      headerName: "Actions",
      renderCell: (params: any) => (
        <IconButton color="primary" onClick={() => handleEditClick(params.row)}>
          <EditIcon />
        </IconButton>
      ),
    },
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name" },
    { field: "measurement", headerName: "Measurement" },
    { field: "price", headerName: "Price" },
    { field: "size", headerName: "Size" },
    { field: "created", headerName: "Date Created", type: "date" },
    { field: "lastModified", headerName: "Last Modified", type: "date" },
  ];

  return (
    <>
      <Header title="ADD-ONS" subtitle="Manage Add-Ons" />
      <Button variant="contained" color="primary" onClick={handleAddClick}>
        {"Add New Add-On"}
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

      {/* Edit Add-On Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="edit-add-on-dialog-title"
      >
        <DialogTitle id="edit-add-on-dialog-title">Edit Add-On</DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="name"
              label="Name"
              fullWidth
              variant="standard"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              margin="dense"
              id="price"
              name="price"
              label="Price"
              type="number"
              fullWidth
              variant="standard"
              value={formik.values.price}
              onChange={formik.handleChange}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
            />
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      {/* Add New Add-On Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onClose={handleCloseAddDialog}
        aria-labelledby="add-add-on-dialog-title"
      >
        <DialogTitle id="add-add-on-dialog-title">Add New Add-On</DialogTitle>
        <DialogContent>
          <form onSubmit={formikAdd.handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              id="addOnName"
              name="addOnName"
              label="Add-On Name"
              fullWidth
              variant="standard"
              value={formikAdd.values.addOnName}
              onChange={formikAdd.handleChange}
              error={
                formikAdd.touched.addOnName &&
                Boolean(formikAdd.errors.addOnName)
              }
              helperText={
                formikAdd.touched.addOnName && formikAdd.errors.addOnName
              }
            />
            <TextField
              margin="dense"
              id="pricePerUnit"
              name="pricePerUnit"
              label="Price"
              type="number"
              fullWidth
              variant="standard"
              value={formikAdd.values.pricePerUnit}
              onChange={formikAdd.handleChange}
              error={
                formikAdd.touched.pricePerUnit &&
                Boolean(formikAdd.errors.pricePerUnit)
              }
              helperText={
                formikAdd.touched.pricePerUnit && formikAdd.errors.pricePerUnit
              }
            />
            <TextField
              margin="dense"
              id="size"
              name="size"
              label="Size"
              type="number"
              fullWidth
              variant="standard"
              value={formikAdd.values.size}
              onChange={formikAdd.handleChange}
              error={formikAdd.touched.size && Boolean(formikAdd.errors.size)}
              helperText={formikAdd.touched.size && formikAdd.errors.size}
            />
            <DialogActions>
              <Button onClick={handleCloseAddDialog}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddOns;
