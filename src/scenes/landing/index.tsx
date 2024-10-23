import { Link } from "react-router-dom";
import {
  Typography,
  Button,
  Stack,
  Paper,
  Box,
  Grid,
  useTheme,
  Fade,
} from "@mui/material";
import DesignGallery from "./../../components/DesignGallery.tsx";
import { Tokens } from "../../Theme.ts";
import { useEffect, useState } from "react";

const Landing = () => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);

  // Scroll-triggered reveal sections
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      if (currentScrollY > 100) setShowAbout(true);
      if (currentScrollY > 200) setShowContact(true);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getOpacity = (threshold: number) => {
    if (scrollY < threshold) return 0; // Fully hidden
    if (scrollY > threshold + 300) return 1; // Fully visible
    return (scrollY - threshold) / 300; // Fade in effect
  };

  return (
    <>
      <Box
        sx={{
          position: "absolute",
          top: 20,
          left: -2,
          width: "100vw",
          height: "120vh",
          background: `url(banner.png) center/cover no-repeat`,
          zIndex: -1,
          overflow: "hidden",
        }}
      />
      <Box
        sx={{
          left: 0,
          position: "relative",
          minHeight: "70vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <Typography
            variant="h1"
            sx={{ fontWeight: "bold", textAlign: "center", color: "#fff" }}
          >
            Welcome to The Pink Butter Cake Studio
          </Typography>
          <Typography
            variant="h3"
            sx={{ textAlign: "center", color: "#fff", mb: 2 }}
          >
            Delicious Artistry in Every Bite
          </Typography>
          <Typography
            variant="h5"
            sx={{ textAlign: "center", color: "#ccc", mb: 4 }}
          >
            Custom and Premade Cakes in Quezon City
          </Typography>
          <Stack direction="row" spacing={2}>
            <Link to="/shop">
              <Button variant="contained" sx={{ backgroundColor: "#ff4081" }}>
                Design Collection
              </Button>
            </Link>
            <Link to="/custom">
              <Button
                variant="outlined"
                sx={{ color: "#fff", borderColor: "#fff" }}
              >
                Custom Order
              </Button>
            </Link>
          </Stack>
        </Stack>

        <Box
          sx={{
            py: 4,
            textAlign: "center",
            width: "100vw",
          }}
        >
          <Grid
            container
            spacing={2}
            sx={{
              opacity: 1, // Always visible
              transition: "opacity 1s ease-in-out",
            }}
          >
            <Grid item xs={12}>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ color: "white", mt: 4 }}
              >
                Browse Our Premade Cake Designs
              </Typography>
              <Typography variant="body1" paragraph sx={{ color: "white" }}>
                Check out our range of beautiful premade designs available for
                quick orders.
              </Typography>
              <DesignGallery landing />
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box
        sx={{
          py: 8,
          textAlign: "center",
          backgroundColor: colors.primary[100],
          width: "100vw",
          ml: -2,
        }}
      >
        {/* About Us Section */}
        <Grid
          container
          spacing={2}
          sx={{
            opacity: getOpacity(100),
            transition: "opacity 1s ease-in-out",
            width: "100vw",
          }}
        >
          <Grid item xs={12}>
            <Fade in={showAbout}>
              <Paper sx={{ padding: 3 }}>
                <Typography variant="h4" gutterBottom>
                  About The Pink Butter Cake Studio
                </Typography>
                <Typography variant="body1" paragraph>
                  Established in 2017, The Pink Butter Cake Studio has been
                  crafting stunning and delicious cakes for all occasions.
                </Typography>
                <Typography variant="body1" paragraph>
                  We are located at 5 Masbate St. Brgy. Nayong Kanluran, Quezon
                  City, Philippines.
                </Typography>
              </Paper>
            </Fade>
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          py: 8,
          textAlign: "center",
          backgroundColor: colors.primary[200],
          width: "100vw",
          ml: -2,
        }}
      >
        {/* Contact Us Section */}
        <Grid
          container
          spacing={2}
          sx={{
            opacity: getOpacity(200),
            transition: "opacity 1s ease-in-out",
            width: "100vw",
          }}
        >
          <Grid item xs={12}>
            <Fade in={showContact}>
              <Paper sx={{ padding: 3, textAlign: "center" }}>
                <Typography variant="h4" gutterBottom>
                  Contact Us
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="body1" paragraph>
                      Viber: +63 968 228 1963
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body1" paragraph>
                      Facebook:{" "}
                      <a
                        href="https://www.facebook.com/TPBcakestudio"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        TBP Cake Studio
                      </a>
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body1" paragraph>
                      Instagram:{" "}
                      <a
                        href="https://www.instagram.com/thepinkbutter?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        @thepinkbutter
                      </a>
                    </Typography>
                  </Grid>
                </Grid>
                <Typography variant="body1" paragraph sx={{ marginTop: 2 }}>
                  Operating Hours: 8 AM - 5 PM (Mon-Sat)
                </Typography>
              </Paper>
            </Fade>
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          textAlign: "center",
          py: 4,
          backgroundColor: colors.primary[300],
          width: "100vw",
          ml: -2,
        }}
      >
        <Typography variant="body2" sx={{ color: "white" }}>
          © {new Date().getFullYear()} The Pink Butter Cake Studio. All rights
          reserved.
        </Typography>
      </Box>
    </>
  );
};

export default Landing;
