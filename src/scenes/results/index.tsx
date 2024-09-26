import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import { Tokens } from "../../theme";
import api from "../../api/axiosConfig.js";
import DesignCard from "../../components/DesignCard";
import { useLocation, useNavigate } from "react-router-dom";

const Results = () => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);
  const [designs, setDesigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchDesigns = async () => {
      const queryParams = new URLSearchParams(location.search);
      const tagId = queryParams.get("tag-id");

      try {
        const response = await api.get(
          tagId ? `/designs/with-tags/${tagId}` : "/designs"
        );
        setDesigns(response.data);
        if (response.data.length === 0) {
          setError("No designs available for this tag.");
        } else {
          setError(null);
        }
      } catch (error) {
        console.error("Error fetching designs:", error);
        setError("The tag does not exist.");
      } finally {
        setIsLoading(false);
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
        Cake Gallery
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
            <DesignCard
              key={design.designId}
              id={design.designId}
              name={design.displayName}
              picture={design.displayPictureData}
              description={design.cakeDescription}
              tags={design.designTags}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Results;
