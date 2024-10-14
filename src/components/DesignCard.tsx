import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import TagChip from "./TagChip";
import { Design, Tag } from "../utils/Schemas";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";
import api from "../api/axiosConfig";
import { getImageType } from "./Base64Image";

type DesignCardProps = {
  design: Design;
  manager?: boolean;
};

const DesignCard = ({ design, manager }: DesignCardProps) => {
  const [image, setImage] = useState("");
  const [imageType, setImageType] = useState("");

  useEffect(() => {
    const fetchImage = async () => {
      const response = await api.get(
        `designs/${design.id}/display-picture-data`
      );
      setImage(response.data.displayPictureData);
      console.log(response.data.displayPictureData);
    };
    fetchImage();
  }, []);

  useEffect(() => {
    try {
      const type = getImageType(image);
      setImageType(type);
    } catch (err) {
      console.error("Error determining image type:", err);
    }
  }, [image]);

  return (
    <Card
      elevation={2}
      sx={
        manager
          ? { height: 300, display: "inline-block" }
          : { width: 160, height: 240, display: "inline-block" }
      }
    >
      <Link
        component={RouterLink}
        to={`/view-design?q=${encodeURIComponent(design.id)}`}
        sx={{ textDecoration: "none", color: "inherit" }}
      >
        <CardActionArea>
          <CardMedia
            sx={
              manager
                ? { height: 140, width: "100%" }
                : { height: 140, width: "100%" }
            }
            component="img"
            loading="lazy"
            image={image ? `data:${imageType};base64,${image}` : ""}
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
