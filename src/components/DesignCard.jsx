import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import TagChip from "./TagChip";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";
import { getImageType } from "../components/Base64Image";

const DesignCard = ({
  id,
  name,
  picture,
  tags,
  description,
  manager,
  editAction,
}) => {
  const [open, setOpen] = useState(false);
  const [imageType, setImageType] = useState(null);
  const data = {
    designId: id,
    displayName: name,
    cakeDescription: description,
    designTags: tags,
    displayPictureData: picture,
  };

  useEffect(() => {
    if (picture) {
      const determineImageType = async () => {
        try {
          const type = getImageType(picture);
          setImageType(type);
        } catch (err) {
          console.error("Error determining image type:", err);
        }
      };
      determineImageType();
    }
  }, [picture]);

  return (
    <Card
      elevation={2}
      sx={
        manager
          ? { height: 300, display: "inline-block" }
          : { width: 200, height: 300, display: "inline-block" }
      }
    >
      <Link
        component={RouterLink}
        //to={`/view-design?q=${encodeURIComponent(id)}`}
        sx={{ textDecoration: "none", color: "inherit" }}
      >
        <CardActionArea
          onClick={handleClick}
          sx={{
            height: "inherit",
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
          }}
        >
          <CardMedia
            sx={
              manager
                ? { height: 140, width: "100%" }
                : { height: 200, width: "100%" }
            }
            image={
              picture
                ? `data:image/${imageType};base64,${picture}`
                : "design.png"
            }
            title={name}
            onError={(e) => {
              e.target.onerror = null; // Remove the event listener to prevent infinite loop
              e.target.src = "design.png"; // Set the fallback image source
            }}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {name}
            </Typography>
            <Typography
              variant="body2"
              align="left"
              sx={{
                display: "-webkit-box",
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
              }}
            >
              {manager ? description : ""}
            </Typography>
            <div style={{ marginTop: "8px" }}>
              {tags.map((tag) => (
                <TagChip id={tag.designTagId} name={tag.designTagName} />
              ))}
            </div>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
};

export default DesignCard;
