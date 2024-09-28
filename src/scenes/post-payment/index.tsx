import { Tokens } from "../../theme";
import { Container, useTheme } from "@mui/material";

const PostPayment = () => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);

  return <Container sx={{ backgroundColor: colors.complementary }}></Container>;
};

export default PostPayment;
