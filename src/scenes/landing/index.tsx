import React from "react";
import { Link } from "react-router-dom";
import {
  Typography,
  Button,
  useTheme,
  Grid,
  Stack,
  Link as MuiLink,
  List,
  ListItem,
} from "@mui/material";
import { Tokens } from "../../theme";
import { Helmet } from "react-helmet-async";
import Panel from "./../../components/Panel.jsx";
import TagFilteredGallery from "./../../components/TagFilteredGallery.jsx";

const Landing = () => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);

  return (
    <Stack justifyContent="center" spacing={4} mt="0">
      <Helmet>
        <title>The Pink Butter Cake Studio</title>
      </Helmet>
      {/* Section 1: Hero */}
      <Panel elevation={1}>
        <Typography variant="h1" gutterBottom>
          Delicious Artistry in Every Bite
        </Typography>
        <Typography variant="h5" color="textSecondary" gutterBottom>
          Custom and Premade Cakes in Quezon City
        </Typography>
        <Link to="shop">
          <Button variant="contained">Browse Designs</Button>
        </Link>
        <Link to="custom">
          <Button variant="outlined">Custom Order</Button>
        </Link>
      </Panel>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={4}>
          {/* Section 2: About */}
          <Panel>
            <Typography variant="h4" gutterBottom>
              About The Pink Butter Cake Studio?
            </Typography>
            <Typography variant="body1" paragraph>
              Established in 2017, The Pink Butter Cake Studio has been crafting
              stunning and delicious cakes for all occasions.
            </Typography>
            <Typography variant="body1" paragraph>
              Located at 5 Masbate St. Brgy. Nayong Kanluran, Quezon City,
              Philippines.
            </Typography>
          </Panel>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          {/* Section 3: Premade Designs */}
          <Panel>
            <Typography variant="h4" gutterBottom>
              Browse Our Premade Cake Designs
            </Typography>

            <Typography variant="body1" paragraph>
              <TagFilteredGallery />
            </Typography>
            {/*<Button variant="contained">View More Designs</Button>*/}
          </Panel>
        </Grid>
        {/* Section 4: Custom Order */}
        {/*<Grid item xs={12} md={6} lg={4}>
          <Panel>
            <Typography variant="h4" gutterBottom>
              Request a Custom Cake
            </Typography>
            <Typography variant="body1" paragraph></Typography>
          </Panel>
        </Grid>*/}

        {/* Section 5: Testimonials */}
        <Grid item xs={12} md={6} lg={4}>
          <Panel>
            <Typography variant="h4" gutterBottom>
              What Our Customers Say
            </Typography>
            <List>
              <ListItem
                primary="Maria Gonzales"
                secondary="The custom cake I ordered for my daughter's birthday was absolutely stunning! The attention to detail and the delicious flavors exceeded all my expectations. The Pink Butter Cake Studio made our celebration truly special."
              />
              <ListItem
                primary="John Santos"
                secondary="I've ordered several cakes from The Pink Butter Cake Studio for different occasions, and they never disappoint. Their premade designs are beautiful and taste amazing. Highly recommended!"
              />
              <ListItem
                primary="Aileen Reyes"
                secondary="The team at The Pink Butter Cake Studio is incredibly talented. They turned my vague idea into a gorgeous custom cake that was the highlight of our event. The cake was not only beautiful but also incredibly delicious."
              />
              <ListItem
                primary="Mark Lim"
                secondary="I needed a cake on short notice, and The Pink Butter Cake Studio delivered an incredible premade design that everyone loved. Their service is top-notch, and the cake was a hit!"
              />
              <ListItem
                primary="Grace Tan"
                secondary="Ordering a custom cake from The Pink Butter Cake Studio was a breeze. They listened to all my requests and created a masterpiece that was both beautiful and tasty. I'll definitely be coming back for more!"
              />
            </List>
          </Panel>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          {/* Section 6: Contact  */}
          <Panel>
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
              Facebook{" "}
              <MuiLink href="https://www.facebook.com/TPBcakestudio/" />
            </Typography>
            <Typography variant="body1" paragraph>
              Tiktok <MuiLink href="https://www.tiktok.com/@thepinkbutter" />
            </Typography>
            <Typography variant="body1" paragraph>
              Instagram{" "}
              <MuiLink href="https://www.instagram.com/thepinkbutter/p/C40NUobK4VW/" />
            </Typography>
            <Typography variant="body1" paragraph>
              Pinterest{" "}
              <MuiLink href="https://ph.pinterest.com/thepinkbutter/" />
            </Typography>
          </Panel>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default Landing;
