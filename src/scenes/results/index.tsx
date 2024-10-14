import { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { Tokens } from "../../Theme";
import api from "../../api/axiosConfig.js";
import DesignCard from "../../components/DesignCard.tsx";
import { useLocation } from "react-router-dom";
import { Design } from "../../utils/Schemas.js";

const Results = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q");
  const tagId = queryParams.get("tag-id");

  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);

  const [designs, setDesigns] = useState<Design[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDesigns = async () => {
      if (searchQuery) {
        try {
          await api
            .get(
              `designs/search/by-name?name=${encodeURIComponent(searchQuery)}`
            )
            .then((response) => {
              const parsedDesigns: Design[] = response.data.map(
                (design: any) => ({
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
                })
              );
              setDesigns(parsedDesigns);
              setIsLoading(false);
            });
        } catch (error) {
          console.error(error);
        }
      } else {
        try {
          await api
            .get(tagId ? `/designs/with-tags/${tagId}` : "/designs")
            .then((response) => {
              const parsedDesigns: Design[] = response.data.map(
                (design: any) => ({
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
                })
              );
              setDesigns(parsedDesigns);
            });
        } catch (error) {
          console.error("Error fetching designs:", error);
          setError("The tag does not exist.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchDesigns();
  }, [location.search]);

  if (isLoading) {
    return <Typography variant="body2">Loading designs...</Typography>;
  }

  return (
    <Box
      mt={4}
      sx={{
        p: "1em",
        display: "inline-block",
        borderRadius: "1em",
        backgroundColor: colors.panel,
      }}
    >
      <Typography variant="h4" gutterBottom>
        {searchQuery
          ? `Search results for: "${searchQuery}"`
          : tagId
          ? `Search results for: "${
              designs[0].tags.find((tag) => tag.id === tagId)?.name
            }"`
          : "Cake Gallery"}
      </Typography>
      {error ? (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "1em",
          }}
        >
          {designs.map((design) => (
            <DesignCard key={design.id} design={design} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Results;
