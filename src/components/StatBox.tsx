import { Box, Typography, useTheme } from "@mui/material";
import { Tokens } from "../theme";
import ProgressCircle from "./ProgressCircle";

type StatboxProps = {
  title: string;
  subtitle: string;
  icon: string;
  progress: number;
  increase: number;
};

const StatBox = ({
  title,
  subtitle,
  icon,
  progress,
  increase,
}: StatboxProps) => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);

  return (
    <Box width="100%" m="0 30px">
      <Box display="flex" justifyContent="space-between">
        <Box>
          {icon}
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            {title}
          </Typography>
        </Box>
        <Box>
          <ProgressCircle progress={progress} />
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" mt="2px">
        <Typography variant="h5" sx={{ color: colors.gween }}>
          {subtitle}
        </Typography>
        <Typography
          variant="h5"
          fontStyle="italic"
          sx={{ color: colors.gween }}
        >
          {increase}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox;
