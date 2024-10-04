import { useEffect, useState } from "react";
import { Paper, Typography, Grid2 as Grid } from "@mui/material";
import api from "../../api/axiosConfig";
import { Helmet } from "react-helmet-async";
import Header from "./../../components/Header.jsx";
import TagsCheckboxList from "./../../components/TagsCheckboxList.jsx";
import DesignGallery from "./../../components/DesignGallery.jsx";
import { Tag } from "../../utils/Schemas.js";
import { createContext } from "react";

const Shop = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(true);

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

      <Grid size={{ xs: 2 }} sx={{ display: { xs: "none", lg: "block" } }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h3">Popular Categories</Typography>
          <TagsCheckboxList
            tags={tags}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            isRefreshing={isRefreshing}
          />
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, lg: 10 }}>
        <Paper sx={{ p: 2 }}>
          <Header
            title="The Pink Butter Cake Studio"
            subtitle="Take a look at our various offerings"
          />
          <DesignGallery
            selectedTags={selectedTags}
            setIsRefreshing={setIsRefreshing}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Shop;
