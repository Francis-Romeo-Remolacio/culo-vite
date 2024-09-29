import { useEffect, useState } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import api from "../../api/axiosConfig";
import { Helmet } from "react-helmet-async";
import Header from "./../../components/Header.jsx";
import TagsCheckboxList from "./../../components/TagsCheckboxList.jsx";
import DesignGallery from "./../../components/DesignGallery.jsx";
import { Tag } from "../../utils/Schemas.js";

const Home = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDesignTags = async () => {
      try {
        await api
          .get("/tags?page=1&record_per_page=30&sortBy=popular&sortOrder=desc")
          .then((response) => {
            const parsedTags: Tag[] = response.data.map((addOn: any) => ({
              id: addOn.designTagId,
              name: addOn.designTagName,
            }));
            setTags(parsedTags);
          });
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
    <Grid container spacing={2}>
      <Helmet>
        <title>Shop - The Pink Butter Cake Studio</title>
      </Helmet>
      <Grid xs={2} sx={{ display: { xs: "none", lg: "block" } }}>
        <Paper>
          <Typography variant="h3">Popular Categories</Typography>
          <Typography>{selectedTags}</Typography>
          <TagsCheckboxList
            tags={tags}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />
        </Paper>
      </Grid>
      <Grid xs={12} lg={10} sx={{ p: 2 }}>
        <Paper>
          <Header
            title="The Pink Butter Cake Studio"
            subtitle="Take a look at our various offerings"
          />
          <DesignGallery selectedTags={selectedTags} />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Home;
