import { useContext, useEffect, useState } from "react";
import { Container, Typography, Grid2 as Grid } from "@mui/material";
import api from "./../api/axiosConfig.js";
import DesignCard from "./DesignCard.tsx";
import { Design } from "../utils/Schemas.js";
import { RefreshContext } from "../scenes/shop/index.js";

type DesignGalleryProps = {
  tagFilter?: string[];
  selectedTags?: string[];
};

const DesignGallery = ({ tagFilter, selectedTags }: DesignGalleryProps) => {
  const [fetchedDesigns, setFetchedDesigns] = useState<Design[]>([]);
  const [outputDesigns, setOutputDesigns] = useState<Design[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { setIsRefreshing } = useContext(RefreshContext);

  useEffect(() => {
    const fetchDesigns = async () => {
      setIsLoading(true);
      try {
        const tagsQuery = tagFilter?.length
          ? `/designs/with-tags/${tagFilter.join(",")}`
          : "/designs?page=1&record_per_page=30";
        const response = await api.get(tagsQuery);
        const parsedDesigns: Design[] = response.data.map((design: any) => ({
          id: design.designId,
          name: design.displayName,
          description: design.cakeDescription,
          pictureUrl: design.designPictureUrl,
          pictureData: design.displayPictureData,
          tags: design.designTags.map((tag: any) => ({
            id: tag.designTagId,
            name: tag.designTagName,
          })),
          shapes: design.designShapes.map((shape: any) => ({
            id: shape.designShapeId,
            name: shape.shapeName,
          })),
        }));
        setFetchedDesigns(parsedDesigns);
        setOutputDesigns(parsedDesigns); // Set outputDesigns to all designs initially
        setIsRefreshing(false);
      } catch (error) {
        console.error("Error fetching designs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDesigns();
  }, [tagFilter]); // Re-fetch when tagFilter changes

  const checkFilter = () => {
    setIsRefreshing(true);
    if (selectedTags && selectedTags.length > 0) {
      setOutputDesigns(
        fetchedDesigns.filter((design) =>
          design.tags.some((tag) => selectedTags.includes(tag.id))
        )
      );
    } else {
      setOutputDesigns(fetchedDesigns); // Reset to all designs if no filter
    }
    setIsRefreshing(false);
  };

  useEffect(() => {
    checkFilter();
  }, [selectedTags, fetchedDesigns]); // Re-run filter whenever selectedTags or fetchedDesigns change

  if (isLoading) {
    return (
      <Container>
        <Typography variant="body2" sx={{ width: "100%" }}>
          Loading designs...
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Grid container spacing={1} sx={{ p: 2 }}>
        <Typography>{selectedTags}</Typography>
        {outputDesigns.map((design) => (
          <Grid key={design.id}>
            <DesignCard design={design} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DesignGallery;
