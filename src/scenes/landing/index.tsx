import { Link as RouterLink } from "react-router-dom";
import {
  Typography,
  Button,
  Stack,
  Link,
  Paper,
  Box,
  Grid2 as Grid,
  useTheme,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import DesignGallery from "./../../components/DesignGallery.tsx";
import { Tokens } from "../../Theme.ts";
import Carousel from "react-material-ui-carousel";

const Landing = () => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);

  return (
    <Box
      sx={{
        m: -2,
        zIndex: -2,
      }}
    >
      <Box
        minHeight={1000}
        minWidth="100vw"
        sx={{
          position: "absolute",
          top: 0,
          zIndex: -1,
          backgroundColor: colors.primary[100],
          background: `url(banner.png) center/cover no-repeat`,
          filter: "opacity(50%)",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%,  rgba(0,0,0,1) 90%, rgba(0,0,0,0) 100%)",
        }}
      />
      <Stack justifyContent="center" spacing={4} sx={{ zIndex: 25 }}>
        <Helmet>
          <title>{"The Pink Butter Cake Studio"}</title>
        </Helmet>
        {/* Section: Hero */}
        <Stack alignItems="center" justifyContent="center" minHeight={400}>
          <Typography variant="h1" gutterBottom>
            {"The Pink Butter Cake Studio"}
          </Typography>
          <Typography variant="h3" gutterBottom>
            {"Delicious Artistry in Every Bite"}
          </Typography>
          <Typography variant="h5" color="textSecondary" gutterBottom>
            {"Custom and Premade Cakes in Quezon City"}
          </Typography>
          <Stack direction="row" spacing={2} sx={{ pt: 8 }}>
            <RouterLink to="shop">
              <Button
                variant="contained"
                size="large"
                sx={{ fontSize: "2rem", fontWeight: "bolder" }}
              >
                {"Browse Now"}
              </Button>
            </RouterLink>
            <RouterLink to="custom">
              <Button
                variant="outlined"
                size="large"
                sx={{ fontSize: "2rem", fontWeight: "bold" }}
              >
                {"Customize"}
              </Button>
            </RouterLink>
          </Stack>
        </Stack>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            {/* Section: Premade Designs */}
            <Grid container justifyContent="center">
              <Grid sx={{ maxWidth: "lg" }}>
                <Paper sx={{ p: 2, height: "100%" }}>
                  <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ textAlign: "center" }}
                  >
                    {"Browse Our Popular Premade Cake Designs"}
                  </Typography>

                  <Typography variant="body1">
                    <DesignGallery landing />
                  </Typography>
                  {/*<Button variant="contained">View More Designs</Button>*/}
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          {/* About Us Section */}
          <Grid
            container
            spacing={2}
            sx={{
              width: "100vw",
            }}
          >
            <Grid size={12}>
              <Paper sx={{ m: 4, p: 4 }}>
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {/* Carousel Column */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Carousel>
                      <iframe
                        width="100%"
                        height="500"
                        src="https://www.youtube.com/embed/-diIiPnmN58"
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      <img
                        src="culo chef picture.png"
                        alt="Description of Image"
                        style={{
                          width: "auto",
                          height: "auto",
                          maxHeight: "500px",
                        }}
                      />
                      <img
                        src="culo chinese picture.png"
                        alt="Description of Image"
                        style={{
                          width: "auto",
                          height: "auto",
                          maxHeight: "500px",
                        }}
                      />
                      <img
                        src="culo pokemon picture.png"
                        alt="Description of Image"
                        style={{
                          width: "auto",
                          height: "auto",
                          maxHeight: "500px",
                        }}
                      />
                    </Carousel>
                  </Grid>

                  {/* Text Column */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h1" gutterBottom>
                      {"About The Pink Butter Cake Studio"}
                    </Typography>
                    <Typography variant="h5">
                      {
                        "Established in 2017, The Pink Butter Cake Studio has been crafting stunning and delicious cakes for all occasions."
                      }
                    </Typography>
                    <Typography variant="h5">
                      {
                        "We are located at 5 Masbate St. Brgy. Nayong Kanluran, Quezon City, Philippines."
                      }
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>

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
                width: "100vw",
              }}
            >
              <Grid size={12}>
                <Paper sx={{ padding: 3, textAlign: "center" }}>
                  <Typography variant="h4" gutterBottom>
                    {"Contact Us"}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={4}>
                      <Typography variant="h4">
                        {"Viber: "}
                        <Link href="viber://chat/?number=%2B639682281963">
                          {"+63 968 228 1963"}
                        </Link>
                      </Typography>
                    </Grid>
                    <Grid size={4}>
                      <Typography variant="h4">
                        {"Facebook: "}
                        <Link
                          href="https://www.facebook.com/TPBcakestudio"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"TBP Cake Studio"}
                        </Link>
                      </Typography>
                    </Grid>
                    <Grid size={4}>
                      <Typography variant="h4">
                        {"Instagram: "}
                        <Link
                          href="https://www.instagram.com/thepinkbutter?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"@thepinkbutter"}
                        </Link>
                      </Typography>
                    </Grid>
                  </Grid>
                  <Typography variant="h4" sx={{ marginTop: 2 }}>
                    {"Operating Hours: 8 AM to 5 PM (Mon-Sat GMT+8)"}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          {/* Footer: Rights Info */}
          <Grid size={{ xs: 12 }} sx={{ minHeight: 100 }}>
            <Typography
              variant="body1"
              color="textSecondary"
              align="center"
              sx={{ mt: 4 }}
            >
              {`© ${new Date().getFullYear()} The Pink Butter Cake Studio. All rights reserved.`}
            </Typography>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default Landing;
