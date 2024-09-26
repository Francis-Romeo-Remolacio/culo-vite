import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Tokens } from "../../../theme";
import { mockDataContacts } from "../../../data/mockData";
import Header from "../../../components/Header";
import { useTheme } from "@mui/material";
import DataGridStyler from "./../../../components/DataGridStyler.jsx";

const Contacts = () => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "registrarId", headerName: "Registrar ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
    },
    {
      field: "city",
      headerName: "City",
      flex: 1,
    },
    {
      field: "zipCode",
      headerName: "Zip Code",
      flex: 1,
    },
  ];

  return (
    <Box
      m="1rem"
      backgroundColor={colors.panel}
      p="1rem"
      borderRadius="1rem"
      sx={{
        backdropFilter: "blur(24px)",
      }}
    >
      <Header
        title="CONTACTS"
        subtitle="List of Contacts for Future Reference"
      />
      <DataGridStyler>
        <DataGrid
          rows={mockDataContacts}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </DataGridStyler>
    </Box>
  );
};

export default Contacts;
