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
  //Grid,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2.js";
import { Helmet } from "react-helmet-async";
import DesignGallery from "./../../components/DesignGallery.jsx";

const Landing = () => {
  return (
    <>
      <Box
        minHeight={1000}
        minWidth="100vw"
        sx={{
          position: "absolute",
          top: 0,
          zIndex: -1,
          opacity: 0.3,
          margin: -2,
          background: `url(/src/assets/banner.png) center/cover no-repeat`,
        }}
      />
      <Stack justifyContent="center" spacing={4} mt="0">
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
          <Grid xs={12} md={6} lg={4}>
            {/* Section 2: About */}
            <Paper sx={{ p: 2, height: "100%" }}>
              <Typography variant="h4" gutterBottom>
                About The Pink Butter Cake Studio?
              </Typography>
              <Typography variant="body1" paragraph>
                Established in 2017, The Pink Butter Cake Studio has been
                crafting stunning and delicious cakes for all occasions.
              </Typography>
              <Typography variant="body1" paragraph>
                Located at 5 Masbate St. Brgy. Nayong Kanluran, Quezon City,
                Philippines.
              </Typography>
            </Paper>
          </Grid>
          <Grid xs={12} md={6} lg={4}>
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
          {/*<Grid xs={12} md={6} lg={4}>
          <Panel>
            <Typography variant="h4" gutterBottom>
              Request a Custom Cake
            </Typography>
            <Typography variant="body1" paragraph></Typography>
          </Panel>
        </Grid>*/}

          {/* Section 5: Testimonials */}
          <Grid xs={12} md={6} lg={4}>
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
          <Grid xs={12} md={6} lg={4}>
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
