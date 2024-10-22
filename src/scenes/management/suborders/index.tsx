import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Stack,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridToolbar,
} from "@mui/x-data-grid";
import Header from "../../../components/Header.js";
import api from "../../../api/axiosConfig.js";
import DataGridStyler from "../../../components/DataGridStyler.tsx";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Restore as RestoreIcon,
} from "@mui/icons-material";
import { useFormik } from "formik";
import { suborderSchema } from "../../../utils/Validation.js";
import { ManagementSuborder } from "../../../utils/Schemas.js";

const Suborders = () => {
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<ManagementSuborder[]>([]);
  const [selectedRow, setSelectedRow] = useState<Partial<ManagementSuborder>>(
    {}
  );
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    try {
      switch (mode) {
        case "add":
          await api.post(`suborder`, values);
          break;
        case "edit":
          await api.patch(`suborder/${values.id}`, values);
          break;
      }
      setOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error while submitting suborder:", error);
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
      description: "",
      quantity: 1,
      size: "",
      flavor: "",
      color: "",
      designId: "",
      pastryId: "",
      customerId: "",
      employeeId: "",
      employeeName: "",
      customerName: "",
      created: new Date(),
      lastModified: new Date(),
      lastModifiedBy: "",
      isActive: true,
    },
    validationSchema: suborderSchema,
    onSubmit,
  });

  const fetchData = async () => {
    try {
      const response = await api.get("current-user/artist/to-do");
      const suborderData = response.data.map((suborder: any) => ({
        id: suborder.suborderId,
        orderId: suborder.orderId,
        designId: suborder.designId,
        pastryId: suborder.pastryId,
        description: suborder.description,
        size: suborder.size,
        color: suborder.color,
        flavor: suborder.flavor,
        quantity: suborder.quantity,
        customerId: suborder.customerId,
        customerName: suborder.customerName,
        employeeId: suborder.employeeId,
        employeeName: suborder.employeeName,
        status: suborder.status,
        designName: suborder.designName,
        shape: suborder.shape,
        tier: suborder.tier,
        price: suborder.price,
        isActive: suborder.isActive,
        created: new Date(suborder.createdAt),
        lastModified: new Date(suborder.lastUpdatedAt),
        lastUpdatedBy: suborder.lastUpdatedBy,
      }));
      setRows(suborderData);
    } catch (error) {
      console.error("Error fetching suborders:", error);
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

  const handleClickDone = (row: ManagementSuborder) => {};

  const handleClickDelete = async (id: string) => {
    try {
      await api.delete(`suborders/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting suborder:", error);
    }
  };

  const handleClickRestore = async (id: string) => {
    try {
      await api.put("suborders", null, { params: { restore: id } });
      fetchData();
    } catch (error) {
      console.error("Error reactivating suborder:", error);
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
            onClick={() => handleClickDone(params.row.id)}
          >
            <EditIcon />
          </IconButton>
          {params.row.isActive ? (
            <IconButton
              color="error"
              onClick={() => handleClickDelete(params.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          ) : (
            <IconButton
              color="success"
              onClick={() => handleClickRestore(params.row.id)}
            >
              <RestoreIcon />
            </IconButton>
          )}
        </>
      ),
    },
    { field: "id", headerName: "ID" },
    { field: "description", headerName: "Description", minWidth: 200 },
    { field: "quantity", headerName: "Quantity" },
    { field: "designName", headerName: "Design", minWidth: 200 },
    { field: "size", headerName: "Size" },
    { field: "flavor", headerName: "Flavor" },
    { field: "color", headerName: "Color" },
    { field: "isActive", headerName: "Active", type: "boolean" },
  ];

  return (
    <>
      <Header title="To-Do" subtitle="Employee updates" />
      <DataGridStyler>
        <DataGrid
          rows={rows as GridRowsProp}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          initialState={{
            columns: {
              columnVisibilityModel: {
                id: false,
              },
            },
          }}
        />
      </DataGridStyler>
    </>
  );
};

export default Suborders;
