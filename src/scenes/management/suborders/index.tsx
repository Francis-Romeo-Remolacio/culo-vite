import { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
import { ManagementSuborder } from "../../../utils/Schemas.js";

const Suborders = () => {
  const [rows, setRows] = useState<ManagementSuborder[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>(""); // State for dropdown value
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false); // State for dialog
  const [selectedDescription, setSelectedDescription] = useState(""); // State for selected description

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
        pickupDate: new Date(suborder.pickupDate),
      }));
      setRows(suborderData);
    } catch (error) {
      console.error("Error fetching suborders:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id: string) => {
    try {
      await api.patch(`orders/suborders/${id}/update-status`, null, {
        params: { action: "send" }, // Always use "send" for action
      });
      fetchData(); // Refetch data after status update
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update status.");
    }
  };


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

  // Open dialog with the selected description
  const handleDescriptionClick = (description: string) => {
    setSelectedDescription(description);
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDescription("");
  };

  const columns: GridColDef[] = [
    {
      field: "action",
      type: "actions",
      minWidth: 200,
      renderCell: (params: any) => (
        <>
          <FormControl variant="outlined" size="small" fullWidth>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleStatusChange(params.row.id)} // Directly pass the ID to handleStatusChange
            >
              Send
            </Button>
          </FormControl>

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
    {
      field: "description",
      headerName: "Description",
      minWidth: 200,
      renderCell: (params) => (
        <Button
          onClick={() => handleDescriptionClick(params.row.description)}
          color="primary"
        >
          View Description
        </Button>
      ),
    },
    { field: "quantity", headerName: "Quantity" },
    { field: "designName", headerName: "Design", minWidth: 200 },
    { field: "size", headerName: "Size" },
    { field: "flavor", headerName: "Flavor", minWidth: 180 },
    { field: "color", headerName: "Color" },
    { field: "status", headerName: "Status" },
    { field: "pickupDate", headerName: "Pickup Date", minWidth: 380 },
    { field: "isActive", headerName: "Active", type: "boolean" },
  ];

  return (
    <>
      <Header title="TO-DO" subtitle="Employee updates" />
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

      {/* Dialog to show the full description */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Description</DialogTitle>
        <DialogContent>
          <div>{selectedDescription}</div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Suborders;
