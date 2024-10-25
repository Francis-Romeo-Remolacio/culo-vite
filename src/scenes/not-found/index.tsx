import { Link, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const NotFound = () => {
  return (
    <Stack
      spacing={2}
      sx={{
        width: "100%",
        height: "90vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h1">404 NOT FOUND</Typography>
      <Link to="/" component={RouterLink}>
        {"Back to Home page"}
      </Link>
    </Stack>
  );
};

export default NotFound;
