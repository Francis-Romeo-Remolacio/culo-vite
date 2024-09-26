import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import api from "./../api/axiosConfig.js";
import DesignCard from "./DesignCard.jsx";
import { Design, Tag } from "../utils/Schemas.js";

type TagFilteredGallery = {
  designTags?: Tag[];
  selectedTags?: string[];
  setSelectedTags?: Dispatch<SetStateAction<string[]>>;
};
const TagFilteredGallery = ({
  designTags,
  selectedTags,
  setSelectedTags,
}: TagFilteredGallery) => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDesigns = async () => {
      setIsLoading(true);
      try {
        const tagsQuery = selectedTags?.length
          ? `/designs/with-tags/${selectedTags.join(",")}`
          : "/designs?page=1&record_per_page=30";
        const response = await api.get(tagsQuery);
        setDesigns(response.data);
      } catch (error) {
        console.error("Error fetching designs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDesigns();
  }, [selectedTags]);

  if (isLoading) {
    return <Typography variant="body2">Loading designs...</Typography>;
  }

  return (
    <Grid container>
      {designs.map((design) => (
        <Grid item>
          <DesignCard key={design.designId} design={design} />
        </Grid>
      ))}
    </Grid>
  );
};

export default TagFilteredGallery;
