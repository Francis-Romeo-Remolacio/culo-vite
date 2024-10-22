import { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  IconButton,
} from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp, GridToolbar } from "@mui/x-data-grid";
import Header from "../../../components/Header.js";
import api from "../../../api/axiosConfig.js";
import DataGridStyler from "../../../components/DataGridStyler.tsx";
import { Edit as EditIcon, Delete as DeleteIcon, Restore as RestoreIcon } from "@mui/icons-material";
import { ManagementSuborder } from "../../../utils/Schemas.js";

const Suborders = () => {
  const [rows, setRows] = useState<ManagementSuborder[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>(""); // State for dropdown value
  const [error, setError] = useState<string | null>(null);

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

  // Function to handle dropdown status change and update status
  const handleStatusChange = async (event: SelectChangeEvent, id: string) => {
    const newStatus = event.target.value;
    setSelectedStatus(newStatus);

    try {
      await api.patch(`orders/suborders/${id}/update-status`, null, {
        params: { action: newStatus }, // Passing the new status as a query parameter
      });
      fetchData(); // Refetch data after status update
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update status.");
    }
  };

  // Delete suborder function
  const handleClickDelete = async (id: string) => {
    try {
      await api.delete(`suborders/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting suborder:", error);
    }
  };

  // Restore suborder function
  const handleClickRestore = async (id: string) => {
    try {
      await api.put("suborders", null, { params: { restore: id } });
      fetchData();
    } catch (error) {
      console.error("Error reactivating suborder:", error);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "action",
      type: "actions",
      minWidth: 200,
      renderCell: (params: any) => (
        <>
          {/* Dropdown for status update */}
          <FormControl variant="outlined" size="small" fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedStatus[params.row.id] || params.row.status} // Display current status or selected status
              onChange={(event) => handleStatusChange(event, params.row.id)} // Handle status change
              label="Status"
            >
              <MenuItem value="send">Send</MenuItem>
              <MenuItem value="done">Done</MenuItem>
            </Select>
          </FormControl>
          {/* Delete and Restore Icons */}
          {params.row.isActive ? (
            <IconButton color="error" onClick={() => handleClickDelete(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          ) : (
            <IconButton color="success" onClick={() => handleClickRestore(params.row.id)}>
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
    { field: "status", headerName: "Status" },
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
