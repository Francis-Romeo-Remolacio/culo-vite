import { Typography, Box } from "@mui/material";

type HeaderProps = {
  title: string;
  subtitle?: string;
};

const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <Box mb={subtitle ? "30px" : ""}>
      <Typography variant="h2" fontWeight="bold">
        {title}
      </Typography>
      {subtitle ? (
        <Typography variant="h5" color="secondary">
          {subtitle}
        </Typography>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default Header;
