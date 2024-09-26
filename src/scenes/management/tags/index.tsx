import React, { useState, useEffect } from "react";
import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import {
  GridRowModes,
  DataGrid,
  GridToolbar,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import { Tokens } from "../../../theme";
import Header from "../../../components/Header";
import api from "../../../api/axiosConfig";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import ManualAddDialog from "./ManualAddDialog";
import UpdateTagModal from "./updateModal";
import BulkAddDialog from "./BulkAddDialog";
import DataGridStyler from "./../../../components/DataGridStyler.jsx";

const Tags = () => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);

  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openBulkAddModal, setOpenBulkAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [currentTagSelected, setCurrentTagSelected] = useState("");

  const fetchData = async () => {
    try {
      const response = await api.get("/tags");
      setRows(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [true]);

  const handleAddTagButtonClick = () => {
    setOpenAddModal(true);
  };

  const handleBulkAddTagButtonClick = () => {
    setOpenBulkAddModal(true);
  };

  const handleAddTagModalSubmit = async (data) => {
    try {
      await api.post("/tags", {
        designTagName: data.designTagName,
      });
    } catch (error) {
      console.error("Error creating tag:", error);
    }
    fetchData();
  };

  const handleBulkAddTagModalSubmit = async () => {
    fetchData();
  };

  const handleUpdateTagSubmit = async (data) => {
    try {
      await api.patch(`/tags/${data.designTagId}`, {
        designTagName: data.designTagName, // Assuming the name field is updated
      });
    } catch {
      console.error("Error updating record:");
    }
    await fetchData();
  };

  const handleEditClick = (id) => async () => {
    setCurrentTagSelected(id);
    setOpenEditModal(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      await api.delete(`/tags/${id}`);
    } catch {
      console.error("Error deleting record:");
    }
    await fetchData();
  };

  const columns = [
    { field: "designTagId", headerName: "ID", width: 180 },
    { field: "designTagName", headerName: "Name", flex: 1, editable: true },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box p={2}>
      <Header title="Tags" subtitle="Tags for categorizing designs" />
      <Stack direction="row" spacing={2}>
        <Button
          onClick={handleAddTagButtonClick}
          variant="contained"
          color="primary"
          mb={2}
        >
          Add new tag
        </Button>
        <Button
          onClick={handleBulkAddTagButtonClick}
          variant="contained"
          color="secondary"
          mb={2}
        >
          Bulk add tags
        </Button>
      </Stack>
      <DataGridStyler>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.designTagId}
          editMode="row"
          rowModesModel={rowModesModel}
          components={{ Toolbar: GridToolbar }}
        />
      </DataGridStyler>
      <ManualAddDialog
        open={openAddModal}
        handleClose={() => setOpenAddModal(false)}
        handleSubmit={handleAddTagModalSubmit}
      />
      <BulkAddDialog
        open={openBulkAddModal}
        handleClose={() => setOpenBulkAddModal(false)}
        handleSubmit={handleBulkAddTagModalSubmit}
      />
      <UpdateTagModal
        open={openEditModal}
        handleClose={() => setOpenEditModal(false)}
        handleSubmit={handleUpdateTagSubmit}
        tag_id={currentTagSelected}
      />
    </Box>
  );
};

export default Tags;
