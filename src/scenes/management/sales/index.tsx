import { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import api from "../../../api/axiosConfig";
import Header from "../../../components/Header";
import DataGridStyler from "./../../../components/DataGridStyler.tsx";
import { Helmet } from "react-helmet-async";
import { toCurrency } from "../../../utils/Formatter.ts";
const columns = [
  { field: "name", headerName: "Product", width: 200 },
  { field: "number", headerName: "Contact" },
  { field: "email", headerName: "Email", width: 200 },
  {
    field: "price",
    headerName: "Cost",
    renderCell: (params: any) => {
      if (!params.value) return "";
      return toCurrency(params.value);
    },
  },
  {
    field: "total",
    headerName: "Total",
    renderCell: (params: any) => {
      if (!params.value) return "";
      return `₱${params.value.toFixed(2)}`;
    },
  },
  { field: "date", headerName: "Date", width: 140 },
];

const Sales = () => {
  const [rows, setRows] = useState([]);

  const fetchSalesData = async () => {
    try {
      const response = await api.get("sales");
      setRows(response.data);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  return (
    <>
      <Helmet>
        <title>{"Sales - Cake Studio"}</title>
      </Helmet>
      <Header title="SALES" subtitle="Detailed Sales Information" />
      <DataGridStyler>
        <DataGrid
          rows={rows}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
        />
      </DataGridStyler>
    </>
  );
};

export default Sales;
