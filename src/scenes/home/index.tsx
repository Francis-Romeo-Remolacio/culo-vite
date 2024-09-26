import { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import api from "../../api/axiosConfig";
import { Helmet } from "react-helmet-async";
import Header from "./../../components/Header.jsx";
import CheckboxList from "./../../components/CheckboxList.jsx";
import TagFilteredGallery from "./../../components/TagFilteredGallery.jsx";
import { Tag } from "../../utils/Schemas.ts";

const Home = () => {
  const [designTags, setDesignTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchDesignTags = async () => {
      try {
        const response = await api.get(
          "/tags?page=1&record_per_page=20&sortBy=popular&sortOrder=desc"
        );
        setDesignTags(response.data);
      } catch (error) {
        console.error("Error fetching design tags:", error);
      }
    };

    fetchDesignTags();
  }, []);

  return (
    <Box p={{ xs: 1, sm: 2, md: 3 }}>
      <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
        <Helmet>
          <title>Home - The Pink Butter Cake Studio</title>
        </Helmet>
        <Grid item xs={2} sx={{ display: { xs: "none", lg: "block" } }}>
          <Box>
            <Typography variant="h3">Popular Categories</Typography>
            <CheckboxList
              designTags={designTags}
              selectedTags={selectedTagIds}
              setSelectedTags={setSelectedTagIds}
            />
          </Box>
        </Grid>
        <Grid container item xs={12} lg={10}>
          <Box>
            <Header
              title="The Pink Butter Cake Studio"
              subtitle="Take a look at our various offerings"
            />
            <Grid container spacing={2} justifyContent="center">
              <TagFilteredGallery
                designTags={designTags}
                selectedTags={selectedTagIds}
                setSelectedTags={setSelectedTagIds}
              />
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
