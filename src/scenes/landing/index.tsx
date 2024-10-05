import { Link } from "react-router-dom";
import {
  Typography,
  Button,
  Stack,
  Link as MuiLink,
  List,
  ListItem,
  Paper,
  ListItemText,
  Box,
  Grid2 as Grid,
  useTheme,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import DesignGallery from "./../../components/DesignGallery.jsx";
import { Tokens } from "../../Theme.ts";

const Landing = () => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);

  return (
    <>
      <Box
        minHeight={1000}
        minWidth="100vw"
        sx={{
          position: "absolute",
          top: 0,
          zIndex: -1,
          opacity: 0.5,
          m: -2,
          backgroundColor: colors.primary[100],
          background: `url(banner.png) center/cover no-repeat`,
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%,  rgba(0,0,0,1) 90%, rgba(0,0,0,0) 100%)",
        }}
      />
      <Stack justifyContent="center" spacing={4} mt="0" sx={{ zIndex: 25 }}>
        <Helmet>
          <title>The Pink Butter Cake Studio</title>
        </Helmet>
        {/* Section 1: Hero */}
        <Stack alignItems="center" justifyContent="center" minHeight={400}>
          <Typography variant="h1" gutterBottom>
            The Pink Butter Cake Studio
          </Typography>
          <Typography variant="h3" gutterBottom>
            Delicious Artistry in Every Bite
          </Typography>
          <Typography variant="h5" color="textSecondary" gutterBottom>
            Custom and Premade Cakes in Quezon City
          </Typography>
          <Stack direction="row" spacing={1}>
            <Link to="shop">
              <Button variant="contained">Browse Designs</Button>
            </Link>
            <Link to="custom">
              <Button variant="outlined">Custom Order</Button>
            </Link>
          </Stack>
        </Stack>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            {/* Section 2: About */}
            <Paper sx={{ p: 2, height: "100%" }}>
              <Typography variant="h4" gutterBottom>
                About The Pink Butter Cake Studio
              </Typography>
              <Typography variant="body1">
                The Pink Butter Cake Studio, established in 2017, has quickly
                become a beloved destination for cake enthusiasts in Quezon
                City, Philippines. Specializing in custom orders, the studio
                prides itself on creating exquisite cakes tailored to suit any
                theme or occasion, from birthdays and weddings to corporate
                events. With a commitment to quality and creativity, each cake
                is meticulously crafted to ensure not only a visually stunning
                presentation but also exceptional flavor. The team at The Pink
                Butter Cake Studio works closely with clients to understand
                their vision, allowing for personalized touches that make every
                cake a unique centerpiece for any celebration.
              </Typography>
              <Typography variant="body1">
                In addition to custom creations, The Pink Butter Cake Studio
                offers a selection of premade designs that reflect the latest
                trends and seasonal themes. These beautifully designed cakes are
                perfect for those who want the same level of artistry and taste
                without the wait for a custom order. With a convenient location
                on Masbate Street in Brgy. Nayong Kanluran, the studio has
                established itself as a go-to spot for cake lovers looking for
                high-quality, handcrafted desserts. The Pink Butter Cake Studio
                continues to delight customers with its innovative designs and
                delicious flavors, ensuring that every occasion is celebrated
                with a slice of sweetness.
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            {/* Section 3: Premade Designs */}
            <Paper sx={{ p: 2, height: "100%" }}>
              <Typography variant="h4" gutterBottom>
                Browse Our Premade Cake Designs
              </Typography>

              <Typography variant="body1" paragraph>
                <DesignGallery />
              </Typography>
              {/*<Button variant="contained">View More Designs</Button>*/}
            </Paper>
          </Grid>
          {/* Section 4: Custom Order */}
          {/*
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Panel>
            <Typography variant="h4" gutterBottom>
              Request a Custom Cake
            </Typography>
            <Typography variant="body1" paragraph></Typography>
          </Panel>
        </Grid>*/}

          {/* Section 5: Testimonials */}
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <Paper sx={{ p: 2, height: "100%" }}>
              <Typography variant="h4" gutterBottom>
                What Our Customers Say
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Maria Gonzales"
                    secondary="The custom cake I ordered for my daughter's birthday was absolutely stunning! The attention to detail and the delicious flavors exceeded all my expectations. The Pink Butter Cake Studio made our celebration truly special."
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="John Santos"
                    secondary="I've ordered several cakes from The Pink Butter Cake Studio for different occasions, and they never disappoint. Their premade designs are beautiful and taste amazing. Highly recommended!"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Aileen Reyes"
                    secondary="The team at The Pink Butter Cake Studio is incredibly talented. They turned my vague idea into a gorgeous custom cake that was the highlight of our event. The cake was not only beautiful but also incredibly delicious."
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Mark Lim"
                    secondary="I needed a cake on short notice, and The Pink Butter Cake Studio delivered an incredible premade design that everyone loved. Their service is top-notch, and the cake was a hit!"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Grace Tan"
                    secondary="Ordering a custom cake from The Pink Butter Cake Studio was a breeze. They listened to all my requests and created a masterpiece that was both beautiful and tasty. I'll definitely be coming back for more!"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            {/* Section 6: Contact  */}
            <Paper sx={{ p: 2, height: "100%" }}>
              <Typography variant="h4" gutterBottom>
                Get in Touch
              </Typography>
              <Typography variant="body1" paragraph>
                Address: 5 Masbate St. Brgy. Nayong Kanluran, Quezon City,
                Philippines
              </Typography>
              <Typography variant="body1" paragraph>
                Phone: 0968-228-1963
              </Typography>
              <Typography variant="body1" paragraph>
                <MuiLink href="https://www.facebook.com/TPBcakestudio/">
                  Facebook
                </MuiLink>
              </Typography>
              <Typography variant="body1" paragraph>
                <MuiLink href="https://www.tiktok.com/@thepinkbutter">
                  Tiktok
                </MuiLink>
              </Typography>
              <Typography variant="body1" paragraph>
                <MuiLink href="https://www.instagram.com/thepinkbutter/p/C40NUobK4VW/">
                  Instagram
                </MuiLink>
              </Typography>
              <Typography variant="body1" paragraph>
                <MuiLink href="https://ph.pinterest.com/thepinkbutter/">
                  Pinterest
                </MuiLink>
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Stack>
    </>
  );
};

export default Landing;
