import { Box, useTheme } from "@mui/material";
import { Tokens } from "../../../theme";
import Header from "../../../components/Header";
import PieChart from "../../../components/PieChart";

const Pie = () => {
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
      <Header title="Pie Chart" subtitle="Simple Pie Chart" />
      <Box height="75vh">
        <PieChart />
      </Box>
    </Box>
  );
};

export default Pie;
