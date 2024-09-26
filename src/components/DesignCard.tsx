import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import TagChip from "./TagChip";
import { Design, Tag } from "../utils/Schemas";

type DesignCardProps = {
  design: Design;
  manager?: boolean;
};

const DesignCard = ({ design, manager }: DesignCardProps) => {
  const [imageType, setImageType] = useState("");

  useEffect(() => {
    const determineImageType = async () => {
      try {
        const type = getImageType(design.displayPictureData);
        setImageType(type);
      } catch (err) {
        console.error("Error determining image type:", err);
      }
    };

    determineImageType();
  }, []);

  // Function to get the image type by reading the base64 header
  const getImageType = (blob: Blob) => {
    const firstChar = blob.text.toString().charAt(0);
    switch (firstChar) {
      case "/":
        return "jpeg";
      case "i":
        return "png";
      default:
        throw new Error("Unknown image type.");
    }
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
        href={
          manager ? "" : `/view-design?q=${encodeURIComponent(design.designId)}`
        }
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
            design.designPictureUrl
              ? `data:image/${imageType};base64,${design.designPictureUrl}`
              : "/assets/design.png"
          }
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {design.displayName}
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
            {manager ? design.cakeDescription : ""}
          </Typography>
          <div style={{ marginTop: "8px" }}>
            {design.designTags.map((tag: Tag) => (
              <TagChip id={tag.designTagId} name={tag.designTagName} />
            ))}
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default DesignCard;
