import { Typography, Box } from "@mui/material";

type HeaderProps = {
  title: string;
  subtitle?: string;
};

const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <Box mb="30px">
      <Typography variant="h2" fontWeight="bold" sx={{ m: "0 0 5px 0" }}>
        {title}
      </Typography>
      <Typography variant="h5" color="complementary">
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
