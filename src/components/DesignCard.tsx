import { useState, useEffect, MouseEvent } from "react";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import TagChip from "./TagChip";
import { Design, Tag } from "../utils/Schemas";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";
import { getImageType } from "./Base64Image";

type DesignCardProps = {
  design: Design;
  manager?: boolean;
  onClick?: () => void;
};

const DesignCard = ({ design, manager, onClick }: DesignCardProps) => {
  const [imageType, setImageType] = useState("");

  useEffect(() => {
    const determineImageType = async () => {
      try {
        const type = getImageType(design.pictureData);
        setImageType(type);
      } catch (err) {
        console.error("Error determining image type:", err);
      }
    };

    determineImageType();
  }, []);

  return (
    <Card
      elevation={2}
      sx={
        manager
          ? { width: "100%", height: 360, display: "inline-block" }
          : { width: 160, height: 240, display: "inline-block" }
      }
    >
      <Link
        component={RouterLink}
        to={!manager ? `/view-design?q=${encodeURIComponent(design.id)}` : ""}
        sx={{ textDecoration: "none", color: "inherit" }}
      >
        <CardActionArea onClick={onClick}>
          <CardMedia
            sx={
              manager
                ? { height: 160, width: "100%" }
                : { height: 140, width: "100%" }
            }
            image={
              design.pictureData
                ? `data:image/${imageType};base64,${design.pictureData}`
                : design.pictureUrl
                ? design.pictureUrl.toString()
                : "design.png"
            }
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {design.name}
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
              {manager ? design.description : ""}
            </Typography>
            <div style={{ marginTop: "8px" }}>
              {design.tags.map((tag: Tag) => (
                <TagChip id={tag.id} name={tag.name} />
              ))}
            </div>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
};

export default DesignCard;
