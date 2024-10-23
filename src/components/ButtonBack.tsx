import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";

const ButtonBack = () => {
  const navigate = useNavigate();

  return (
    <IconButton
      size="large"
      onClick={() => navigate(-1)}
      aria-label="go back"
      sx={{ left: -64 }}
    >
      <ArrowBackIcon />
    </IconButton>
  );
};

export default ButtonBack;
