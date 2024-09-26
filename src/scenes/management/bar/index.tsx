import { Box, useTheme } from "@mui/material";
import { Tokens } from "../../../theme";
import Header from "../../../components/Header";
import BarChart from "../../../components/BarChart";

const Bar = () => {
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
      <Header title="Bar Chart" subtitle="Simple Bar Chart" />
      <Box height="75vh">
        <BarChart />
      </Box>
    </Box>
  );
};

export default Bar;
