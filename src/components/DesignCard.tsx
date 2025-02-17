import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import TagChip from "./TagChip";
import { Design, Tag } from "../utils/Schemas";
import { Link as RouterLink } from "react-router-dom";
import { Link, Skeleton } from "@mui/material";
import { getImageType } from "./Base64Image";
import api from "../api/axiosConfig";

type DesignCardProps = {
  design: Design;
  manager?: boolean;
  onClick?: () => void;
};

const DesignCard = ({ design, manager, onClick }: DesignCardProps) => {
  const [picture, setPicture] = useState();
  const [imageType, setImageType] = useState("");

  const fetchImage = async () => {
    const response = await api.get(`designs/${design.id}/display-picture-data`);
    setPicture(response.data.displayPictureData);
  };
  useEffect(() => {
    fetchImage();
  }, []);

  useEffect(() => {
    if (picture) {
      setImageType(getImageType(picture));
    }
  }, [picture]);

  const PictureSkeleton: React.FC = () => (
    <Skeleton variant="rectangular" width="100%" height={manager ? 200 : 130} />
  );

  return (
    <Card
      elevation={4}
      sx={
        manager
          ? { height: 360, display: "inline-block" }
          : { width: 160, height: 260, display: "inline-block" }
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
                ? { height: 200, width: "100%" }
                : { height: 130, width: "100%" }
            }
            component={picture ? "img" : PictureSkeleton}
            image={
              picture ? `data:${imageType};base64,${picture}` : "design.png"
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
                wordBreak: "break-word",
              }}
            >
              {manager ? design.description : ""}
            </Typography>
            {design.tags.map((tag: Tag) => (
              <TagChip key={tag.id} id={tag.id} name={tag.name} />
            ))}
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
};

export default DesignCard;
