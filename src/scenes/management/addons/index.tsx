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
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../../../components/Header";
import api from "../../../api/axiosConfig"; // Assuming api encapsulates Axios methods
import DataGridStyler from "./../../../components/DataGridStyler.jsx";
import EditIcon from "@mui/icons-material/Edit";
import { useFormik } from "formik";

const AddOns = () => {
  const [currentEvents, setCurrentEvents] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAddOnId, setSelectedAddOnId] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    fetchAddOns();
  }, []);

  const fetchAddOns = async () => {
    try {
      const response = await api.get("/add-ons");
      setCurrentEvents(response.data);
    } catch (error) {
      console.error("Error fetching add-ons:", error);
    }
  };

  const handleEditClick = (row) => {
    setSelectedAddOnId(row.addOnsId);
    formik.setValues({
      addOnName: row.addOnName,
      pricePerUnit: row.pricePerUnit,
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedAddOnId(null);
  };


  const handleSubmit = async (values) => {
    console.log("Submitting values:", values); // Debug: check values being submitted
    try {
      const response = await api.patch(
        `/add-ons/${selectedAddOnId}`,
        {
          addOnName: values.addOnName,
          pricePerUnit: values.pricePerUnit,
        }
      );
      console.log("Add-On updated successfully:", response.data);
      fetchAddOns(); // Refresh the list after update
      handleCloseDialog(); // Close the dialog after update
    } catch (error) {
      console.error("Error updating add-on:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      addOnName: "",
      pricePerUnit: 0,
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

  const handleSubmitAdd = async (values) => {
    try {
      const response = await api.post("/add-ons", {
        name: values.addOnName,
        pricePerUnit: values.pricePerUnit,
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



  const columns = [
    { field: "addOnsId", headerName: "ID", hide: true },
    { field: "addOnName", headerName: "Name" },
    { field: "measurement", headerName: "Measurement" },
    { field: "pricePerUnit", headerName: "Price" },
    { field: "size", headerName: "Size" },
    { field: "dateAdded", headerName: "Date Added", type: "date" },
    { field: "lastModifiedDate", headerName: "Last Modified", type: "date" },
    {
      field: "action",
      headerName: "Actions",
      sortable: false,
      renderCell: (params) => (
        <IconButton
          variant="contained"
          color="primary"
          onClick={() => handleEditClick(params.row)}
        >
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <Header title="ADD-ONS" subtitle="Manage Add-Ons" />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddClick}
        style={{ margin: "16px" }}
      >
        Add New Add-On
      </Button>
      <DataGridStyler>
        <DataGrid
          rows={currentEvents}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.addOnsId}
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
              id="addOnName"
              name="addOnName"
              label="Add-On Name"
              fullWidth
              variant="standard"
              value={formik.values.addOnName}
              onChange={formik.handleChange}
              error={formik.touched.addOnName && Boolean(formik.errors.addOnName)}
              helperText={formik.touched.addOnName && formik.errors.addOnName}
            />
            <TextField
              margin="dense"
              id="pricePerUnit"
              name="pricePerUnit"
              label="Price"
              type="number"
              fullWidth
              variant="standard"
              value={formik.values.pricePerUnit}
              onChange={formik.handleChange}
              error={formik.touched.pricePerUnit && Boolean(formik.errors.pricePerUnit)}
              helperText={formik.touched.pricePerUnit && formik.errors.pricePerUnit}
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
       error={formikAdd.touched.addOnName && Boolean(formikAdd.errors.addOnName)}
       helperText={formikAdd.touched.addOnName && formikAdd.errors.addOnName}
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
       error={formikAdd.touched.pricePerUnit && Boolean(formikAdd.errors.pricePerUnit)}
       helperText={formikAdd.touched.pricePerUnit && formikAdd.errors.pricePerUnit}
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
