import { Box, useTheme } from "@mui/material";
import { Tokens } from "../Theme";

const ProgressCircle = ({ progress = 0.75, size = 40 }) => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);
  const angle = progress * 360;
  return (
    <Box
      sx={{
        background: `radial-gradient(transparent 55%, transparent 56%),
            conic-gradient(transparent 0deg ${angle}deg, ${colors.blu} ${angle}deg 360deg),
            ${colors.pink}`,
        borderRadius: "50%",
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
};

export default ProgressCircle;
