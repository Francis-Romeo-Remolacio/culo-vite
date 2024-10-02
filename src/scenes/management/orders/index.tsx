import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Stack,
  Autocomplete,
  IconButton,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Edit, Delete, Restore } from "@mui/icons-material";
import { useFormik } from "formik";
import { managementOrderSchema } from "../../../utils/Validation.js"; // Define a schema for ManagementOrder validation
import Header from "../../../components/Header";
import api from "../../../api/axiosConfig";
import DataGridStyler from "./../../../components/DataGridStyler.jsx";
import { Dayjs } from "dayjs";

const ManagementOrders = () => {
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState<any>({});
  const [error, setError] = useState(null);

  const onSubmit = async () => {
    try {
      switch (mode) {
        case "add":
          await api.post(`orders`, values);
          break;
        case "edit":
          await api.patch(`orders/${values.id}`, values);
          break;
      }
      setOpen(false);
      fetchData();
    } catch (error) {
      console.error("Order error: ", error);
    }
  };

  const { values, isSubmitting, handleChange, setValues, resetForm } =
    useFormik({
      initialValues: {
        id: "",
        customerId: "",
        customerName: "",
        type: "normal",
        pickupDateTime: null,
        payment: "full",
      },
      validationSchema: managementOrderSchema,
      onSubmit,
    });

  const fetchData = async () => {
    try {
      const response = await api.get("management-orders");
      setRows(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddNew = () => {
    resetForm();
    setSelectedRow({});
    setOpen(true);
  };

  const handleClickEdit = (row: any) => {
    setSelectedRow(row);
    setValues(row);
    setOpen(true);
  };

  const handleClickDelete = async (id: string) => {
    try {
      await api.delete(`management-orders/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

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
          <IconButton
            color="error"
            onClick={() => handleClickDelete(params.row.id)}
          >
            <Delete />
          </IconButton>
        </>
      ),
    },
    { field: "id", headerName: "ID" },
    { field: "customerName", headerName: "Customer Name", minWidth: 200 },
    { field: "type", headerName: "Order Type" },
    {
      field: "pickupDateTime",
      headerName: "Pickup Date & Time",
      type: "dateTime",
    },
    { field: "payment", headerName: "Payment Status" },
  ];

  return (
    <>
      <Header
        title="MANAGEMENT ORDERS"
        subtitle="Order Management and Tracking"
      />
      <Button variant="contained" onClick={handleAddNew}>
        Add Order
      </Button>
      <DataGridStyler>
        <DataGrid
          rows={rows}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          initialState={{
            columns: { columnVisibilityModel: { id: false } },
          }}
        />
      </DataGridStyler>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedRow.id ? "Edit Order" : "Add New Order"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              autoFocus
              required
              id="customerName"
              name="customerName"
              label="Customer Name"
              fullWidth
              variant="filled"
              value={values.customerName}
              onChange={handleChange}
            />
            <TextField
              required
              id="pickupDateTime"
              name="pickupDateTime"
              label="Pickup Date & Time"
              type="datetime-local"
              fullWidth
              value={values.pickupDateTime}
              onChange={handleChange}
              variant="filled"
            />
            <FormControl fullWidth>
              <InputLabel id="type-label">Type</InputLabel>
              <Select
                labelId="type"
                id="type"
                value={values.type}
                label="Type"
                onChange={handleChange}
              >
                <MenuItem value={"normal"}>Normal</MenuItem>
                <MenuItem value={"rush"}>Rush</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="payment-label">Payment</InputLabel>
              <Select
                labelId="payment"
                id="payment"
                value={values.payment}
                label="Payment"
                onChange={handleChange}
              >
                <MenuItem value={"full"}>Full</MenuItem>
                <MenuItem value={"half"}>Half</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          {error && <Typography color="error">{error}</Typography>}
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

export default ManagementOrders;
