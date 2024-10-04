import { SetStateAction, useEffect, useState } from "react";
import { Container, Typography, Grid2 as Grid } from "@mui/material";
import api from "./../api/axiosConfig.js";
import DesignCard from "./DesignCard.tsx";
import { Design } from "../utils/Schemas.js";
import { AxiosResponse } from "axios";

type DesignGalleryProps = {
  tagFilter?: string[];
  selectedTags?: string[];
  searchQuery?: string;
  setIsRefreshing?: React.Dispatch<SetStateAction<boolean>>;
};

const DesignGallery = ({
  tagFilter,
  selectedTags,
  searchQuery,
  setIsRefreshing,
}: DesignGalleryProps) => {
  const [fetchedDesigns, setFetchedDesigns] = useState<Design[]>([]);
  const [outputDesigns, setOutputDesigns] = useState<Design[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  function parseDesigns(response: AxiosResponse): Design[] {
    return response.data.map((design: any) => ({
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
  }

  useEffect(() => {
    const fetchDesigns = async () => {
      setIsLoading(true);
      if (setIsRefreshing) {
        setIsRefreshing(true);
      }
      if (searchQuery) {
        try {
          api
            .get("designs/search/by-name", {
              params: {
                name: searchQuery,
              },
            })
            .then((response) => {
              const parsedDesigns: Design[] = parseDesigns(response);
              setFetchedDesigns(parsedDesigns);
              setOutputDesigns(parsedDesigns);
            });
          if (setIsRefreshing) {
            setIsRefreshing(false);
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        try {
          const tagsQuery = tagFilter?.length
            ? `/designs/with-tags/${tagFilter.join(",")}`
            : "/designs?page=1&record_per_page=30";
          await api.get(tagsQuery).then((response) => {
            const parsedDesigns: Design[] = parseDesigns(response);
            setFetchedDesigns(parsedDesigns);
            setOutputDesigns(parsedDesigns);
          });
          if (setIsRefreshing) {
            setIsRefreshing(false);
          }
        } catch (error) {
          console.error("Error fetching designs:", error);
        }
      }
      setIsLoading(false);
    };

    fetchDesigns();
  }, [tagFilter]); // Re-fetch when tagFilter changes

  const checkFilter = () => {
    if (setIsRefreshing) {
      setIsRefreshing(true);
    }
    if (selectedTags && selectedTags.length > 0) {
      setOutputDesigns(
        fetchedDesigns.filter((design) =>
          design.tags.some((tag) => selectedTags.includes(tag.id))
        )
      );
      if (setIsRefreshing) {
        setIsRefreshing(false);
      }
    } else {
      setOutputDesigns(fetchedDesigns); // Reset to all designs if no filter
      if (setIsRefreshing) {
        setIsRefreshing(false);
      }
    }
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
      <Grid container spacing={1} justifyContent="center" sx={{ p: 2 }}>
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
