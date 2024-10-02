import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";
import { Tokens } from "../Theme.js";
import { useTheme } from "@emotion/react";

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
