import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material";

import { tokens } from "../../../theme";
import TagChipName from "../../../components/TagChipName";

const DesignCardAdmin = ({key, id, name, picture, pictureUrl, tags, description, editAction, deleteAction}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const [imageType, setImageType] = useState(null);
  const data = {
    "designId": id,
    "displayName": name,
    "displayPictureUrl": pictureUrl,
    "cakeDescription": description,
    "designTags": tags,
    "displayPictureData": picture,
}

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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const editButtonClick = () => {
    editAction(data);
    setOpen(false);
  }

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

  return (
    <Card sx={{ maxWidth: 400 }}>
      <CardMedia
        sx={{ height: 140 }}
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
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <div style={{ marginTop: "8px" }}>
          {tags.map((tag) => (
            <TagChipName name={tag.designTagName} />
          ))}
        </div>
      </CardContent>

      <CardActions>
          <Button variant="contained" size="small" onClick={handleClickOpen}>
            View Details
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{name}</DialogTitle>
            <DialogContent>
              <DialogContentText>{description}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} sx={{ color: colors.text }}>
                Close 
              </Button>
              <Button type="button" sx={{ color: colors.text }} onClick={(e) => editButtonClick()}>
                Edit
              </Button>
              <Button type="button" sx={{ color: colors.text }} onClick={(e) => deleteAction(id)}>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
      </CardActions>
    </Card>
  );
};

export default DesignCardAdmin;
