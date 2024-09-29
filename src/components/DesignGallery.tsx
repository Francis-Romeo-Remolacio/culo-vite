import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Container, Grid, Typography } from "@mui/material";
import api from "./../api/axiosConfig.js";
import DesignCard from "./DesignCard.jsx";
import { Design } from "../utils/Schemas.js";

type TagFilteredGalleryProps = {
  tagFilter?: string[];
  selectedTags?: string[];
  setIsRefreshingDesigns: Dispatch<SetStateAction<boolean>>;
};
const TagFilteredGallery = ({
  tagFilter,
  selectedTags,
  setIsRefreshingDesigns,
}: TagFilteredGalleryProps) => {
  const [fetchedDesigns, setFetchedDesigns] = useState<Design[]>([]);
  const [filteredDesigns, setFilteredDesigns] = useState<Design[]>([]);
  const [outputDesigns, setOutputDesigns] = useState<Design[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDesigns = async () => {
      setIsLoading(true);
      try {
        const tagsQuery = tagFilter?.length
          ? `/designs/with-tags/${tagFilter.join(",")}`
          : "/designs?page=1&record_per_page=30";
        await api.get(tagsQuery).then((response) => {
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
          checkFilter();
        });
      } catch (error) {
        console.error("Error fetching designs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDesigns();
  }, []);

  const checkFilter = () => {
    setIsRefreshingDesigns(true);
    if (selectedTags && selectedTags.length > 0 && fetchedDesigns.length > 0) {
      setFilteredDesigns(
        fetchedDesigns.filter((design) =>
          design.tags.some((tag) => selectedTags.includes(tag.id))
        )
      );
      setOutputDesigns(filteredDesigns);
    } else {
      setOutputDesigns(fetchedDesigns);
    }
    setIsRefreshingDesigns(false);
  };

  useEffect(() => {
    checkFilter();
  }, [selectedTags]);

  if (isLoading) {
    return (
      <Container>
        <Typography variant="body2" maxWidth="auto">
          Loading designs...
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Grid container spacing={1} sx={{ p: 2 }}>
        <Typography>{tagFilter}</Typography>
        {outputDesigns.map((design) => (
          <Grid item>
            <DesignCard key={design.id} design={design} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TagFilteredGallery;
