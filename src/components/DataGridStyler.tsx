import { ReactNode } from "react";
import { Box } from "@mui/system";
import { useTheme } from "@mui/material";
import { Tokens } from "./../Theme.js";

type DataGridStylerProps = {
  children: ReactNode;
};

const DataGridStyler = ({ children }: DataGridStylerProps) => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);
  return (
    <Box
      sx={{
        "& .css-6n75ee-MuiDataGrid-root": {
          "--DataGrid-containerBackground": "rgba(0, 0, 0, 0)",
        },
        "& .css-1dezojn-MuiDataGrid-root": {
          "--DataGrid-containerBackground": "rgba(0, 0, 0, 0)",
        },
        "& .MuiDataGrid-root": { border: "none" },
        "& .MuiDataGrid-cell": { borderBottom: "none" },
        "& .name-column--cell": { color: colors.analogous1[500] },
        "& .MuiDataGrid-columnSeparator": { color: colors.primary[900] },
        "& .MuiDataGrid-columnHeaders": {
          color: colors.background,
          backgroundColor: colors.primary[500],
          borderBottom: "none",
          borderRadius: "8px 8px 0 0",
        },
        "& .MuiDataGrid-main": {
          backgroundColor: colors.primary[100],
          borderRadius: 2,
        },
        "& .MuiDataGrid-footerContainer": {
          borderTop: "none",
          backgroundColor: colors.primary[500],
          borderRadius: "0 0 8px 8px",
        },
        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
          color: `${colors.analogous1[900]} !important`,
        },
        mt: "40px",
        height: "70vh",
        width: "100%",
        flexGrow: 1,
        borderRadius: 2,
        backgroundColor: colors.analogous1[100],
      }}
    >
      {children}
    </Box>
  );
};

export default DataGridStyler;
