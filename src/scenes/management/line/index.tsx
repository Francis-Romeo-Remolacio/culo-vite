import { Box, useTheme } from "@mui/material";
import { Tokens } from "../../../Theme";
import Header from "../../../components/Header";
import LineChart from "../../../components/LineChart";

const Line = () => {
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
      <Header title="Line Chart" subtitle="Simple Line Chart" />
      <Box height="75vh">
        <LineChart />
      </Box>
    </Box>
  );
};

export default Line;
