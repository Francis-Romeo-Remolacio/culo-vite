import React, { useState, useEffect } from "react";
import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import {
  DataGrid,
  GridToolbar,
  GridActionsCellItem,
  GridColDef,
} from "@mui/x-data-grid";
import Header from "../../../components/Header";
import api from "../../../api/axiosConfig";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import ManualAddDialog from "./ManualAddDialog";
import UpdateTagModal from "./updateModal";
import BulkAddDialog from "./BulkAddDialog";
import DataGridStyler from "./../../../components/DataGridStyler.tsx";
import { Tag } from "../../../utils/Schemas.js";
import { Helmet } from "react-helmet-async";

const Tags = () => {
  const [rows, setRows] = useState([]);
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [openBulkAddModal, setOpenBulkAddModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [currentTagSelected, setCurrentTagSelected] = useState("");

  const fetchData = async () => {
    try {
      await api.get("/tags").then((response) => {
        const parsedTags: Tag[] = response.data.map((tag: any) => ({
          id: tag.designTagId,
          name: tag.designTagName,
        }));
        setRows(parsedTags as any);
      });
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

  const handleAddTagModalSubmit = async (data: any) => {
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

  const handleUpdateTagSubmit = async (data: any) => {
    try {
      await api.patch(`/tags/${data.designTagId}`, {
        designTagName: data.designTagName,
      });
    } catch {
      console.error("Error updating record:");
    }
    await fetchData();
  };

  const handleEditClick = (id: string) => async () => {
    setCurrentTagSelected(id);
    setOpenEditModal(true);
  };

  const handleDeleteClick = async (id: string) => {
    try {
      await api.delete(`/tags/${id}`);
    } catch {
      console.error("Error deleting record:");
    }
    await fetchData();
  };

  const columns: GridColDef[] = [
    {
      field: "action",
      type: "actions",
      width: 100,
      renderCell: (params: any) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(params.row.id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteClick(params.row.id)}
            color="inherit"
          />,
        ];
      },
    },
    { field: "id", headerName: "ID", width: 180 },
    { field: "name", headerName: "Name", flex: 1, editable: true },
  ];

  return (
    <>
      <Helmet>
        <title>{"Tags - The Pink Butter Cake Studio"}</title>
      </Helmet>
      <Header title="TAGS" subtitle="Tags for categorizing designs" />
      <Stack direction="row" spacing={2}>
        <Button
          onClick={() => {
            handleAddTagButtonClick();
          }}
          variant="contained"
          color="primary"
        >
          Add new tag
        </Button>
        <Button
          onClick={() => {
            handleBulkAddTagButtonClick();
          }}
          variant="contained"
          color="secondary"
        >
          Bulk add tags
        </Button>
      </Stack>
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
      <ManualAddDialog
        open={openAddModal}
        setOpenAddModal={() => setOpenAddModal(false)}
        handleSubmit={handleAddTagModalSubmit}
      />
      <BulkAddDialog
        open={openBulkAddModal}
        setOpenBulkAddModal={() => setOpenBulkAddModal(false)}
        handleSubmit={handleBulkAddTagModalSubmit}
      />
      <UpdateTagModal
        open={openEditModal}
        setOpenEditModal={() => setOpenEditModal(false)}
        handleSubmit={handleUpdateTagSubmit}
        tagId={currentTagSelected}
      />
    </>
  );
};

export default Tags;
