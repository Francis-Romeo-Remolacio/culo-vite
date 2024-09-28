import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import api from "./../api/axiosConfig.js";
import DesignCard from "./DesignCard.jsx";
import { Design, Tag } from "../utils/Schemas.js";

type TagFilteredGalleryProps = {
  designTags?: Tag[];
  selectedTags?: string[];
  setSelectedTags?: Dispatch<SetStateAction<string[]>>;
};
const TagFilteredGallery = ({
  designTags,
  selectedTags,
  setSelectedTags,
}: TagFilteredGalleryProps) => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDesigns = async () => {
      setIsLoading(true);
      try {
        const tagsQuery = selectedTags?.length
          ? `/designs/with-tags/${selectedTags.join(",")}`
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
          setDesigns(parsedDesigns);
          console.log(parsedDesigns);
        });
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
          <DesignCard key={design.id} design={design} />
        </Grid>
      ))}
    </Grid>
  );
};

export default TagFilteredGallery;
