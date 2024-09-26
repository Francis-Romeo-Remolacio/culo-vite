import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Tokens } from "../../../theme";
import { mockDataInvoices } from "../../../data/mockData";
import Header from "../../../components/Header";
import DataGridStyler from "./../../../components/DataGridStyler.jsx";

const Invoices = () => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
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
      field: "cost",
      headerName: "Cost",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.gween}>₱{params.row.cost}</Typography>
      ),
    },
    {
      field: "date",
      headerName: "Date",
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
      <Header title="INVOICES" subtitle="List of Invoice Balances" />
      <DataGridStyler>
        <DataGrid checkboxSelection rows={mockDataInvoices} columns={columns} />
      </DataGridStyler>
    </Box>
  );
};

export default Invoices;
