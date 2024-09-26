import { Box, useTheme } from "@mui/material";
import GeographyChart from "../../../components/GeographyChart";
import Header from "../../../components/Header";
import { Tokens } from "../../../theme";

const Geography = () => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);
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
      <Header title="Geography" subtitle="Simple Geography Chart" />

      <Box
        height="75vh"
        border={`1px solid ${colors.grey[100]}`}
        borderRadius="4px"
      >
        <GeographyChart />
      </Box>
    </Box>
  );
};

export default Geography;
