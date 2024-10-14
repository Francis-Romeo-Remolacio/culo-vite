import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import TagChip from "./TagChip";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";
import api from "../api/axiosConfig";

const DesignCard = ({ id, name, tags, description, manager, editAction }) => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState("");
  const [imageType, setImageType] = useState(null);
  const data = {
    designId: id,
    displayName: name,
    cakeDescription: description,
    designTags: tags,
  };

  useEffect(() => {
    const fetchImage = async () => {
      const response = await api.get(`designs/${id}/display-picture-data`);
      setImage(response.data.displayPictureData);
      console.log(response.data.displayPictureData);
    };
    fetchImage();
  }, []);

  useEffect(() => {
    if (image) {
      const determineImageType = async () => {
        try {
          const type = getImageType(image);
          setImageType(type);
        } catch (err) {
          console.error("Error determining image type:", err);
        }
      };

      determineImageType();
    }
  }, [image]);

  // Function to get the image type by reading the base64 header
  const getImageType = (base64) => {
    const binaryString = atob(base64);
    const firstByte = binaryString.charCodeAt(0);
    const secondByte = binaryString.charCodeAt(1);
    const thirdByte = binaryString.charCodeAt(2);

    // JPEG (0xFF, 0xD8, 0xFF)
    if (firstByte === 0xff && secondByte === 0xd8 && thirdByte === 0xff) {
      return "image/jpeg";
    }

    // PNG (0x89, 0x50, 0x4E, 0x47)
    if (firstByte === 0x89 && secondByte === 0x50 && thirdByte === 0x4e) {
      return "image/png";
    }

    // GIF (0x47, 0x49, 0x46)
    if (firstByte === 0x47 && secondByte === 0x49 && thirdByte === 0x46) {
      return "image/gif";
    }

    // BMP (0x42, 0x4D)
    if (firstByte === 0x42 && secondByte === 0x4d) {
      return "image/bmp";
    }

    // TIFF (0x49, 0x20 or 0x4D, 0x20)
    if (
      (firstByte === 0x49 && secondByte === 0x20) ||
      (firstByte === 0x4d && secondByte === 0x20)
    ) {
      return "image/tiff";
    }

    // If unknown, throw an error
    throw new Error("Unknown image type.");
  };

  const handleClick = () => {
    if (manager) {
      editAction(data);
      setOpen(false);
    } else {
      navigate(`/view-design?q=${encodeURIComponent(id)}`);
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
            image={image ? `data:${imageType};base64,${image}` : ""}
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
