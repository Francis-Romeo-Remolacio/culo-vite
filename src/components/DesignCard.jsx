import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import TagChip from "./TagChip";

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

  // Function to get the image type by reading the base64 header
  const getImageType = (data) => {
    const firstChar = data.charAt(0);
    switch (firstChar) {
      case "/":
        return "jpeg";
      case "i":
        return "png";
      default:
        throw new Error("Unknown image type.");
    }
  };

  const handleClick = () => {
    editAction(data);
    setOpen(false);
  };

  return (
    <Card
      elevation={2}
      sx={
        manager
          ? { height: 300, display: "inline-block" }
          : { width: 200, height: 300, display: "inline-block" }
      }
    >
      <CardActionArea
        href={manager ? "" : `/view-design?q=${encodeURIComponent(id)}`}
        onClick={manager ? handleClick : ""}
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
              : "/assets/design.png"
          }
          title={name}
          onError={(e) => {
            e.target.onerror = null; // Remove the event listener to prevent infinite loop
            e.target.src = "/assets/design.png"; // Set the fallback image source
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
    </Card>
  );
};

export default DesignCard;
