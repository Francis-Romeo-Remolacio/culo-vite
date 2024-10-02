import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton, useTheme } from "@mui/material";
import { Tokens } from "../Theme.js";

const ButtonBack = () => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);
  const navigate = useNavigate();

  return (
    <IconButton size="large" onClick={() => navigate(-1)} aria-label="go back">
      <ArrowBackIcon />
    </IconButton>
  );
};

export default ButtonBack;
