import { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import api from "../../api/axiosConfig";
import { Helmet } from "react-helmet-async";
import Header from "./../../components/Header.jsx";
import CheckboxList from "./../../components/CheckboxList.jsx";
import TagFilteredGalleryProps from "./../../components/TagFilteredGallery.jsx";

const Shop = () => {
  const [designTags, setDesignTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDesignTags = async () => {
      try {
        const response = await api.get(
          "/tags?page=1&record_per_page=30&sortBy=popular&sortOrder=desc"
        );
        setDesignTags(response.data);
      } catch (error) {
        console.error("Error fetching design tags:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDesignTags();
  }, []);

  if (isLoading) {
    return <Typography variant="body2">Loading tags...</Typography>;
  }

  return (
    <Box p={{ xs: 1, sm: 2, md: 3 }}>
      <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
        <Helmet>
          <title>Home - The Pink Butter Cake Studio</title>
        </Helmet>
        <Grid item xs={2} sx={{ display: { xs: "none", lg: "block" } }}>
          <Paper>
            <Typography variant="h3">Popular Categories</Typography>
            <CheckboxList
              designTags={designTags}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />
          </Paper>
        </Grid>
        <Grid container item xs={12} lg={10}>
          <Paper>
            <Header
              title="The Pink Butter Cake Studio"
              subtitle="Take a look at our various offerings"
            />
            <Grid container spacing={2} justifyContent="center">
              <TagFilteredGallery designTags={designTags} />
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Shop;
