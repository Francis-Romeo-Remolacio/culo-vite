import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Grid2 as Grid,
  Skeleton,
} from "@mui/material";
import api from "../../../api/axiosConfig";
import Header from "../../../components/Header";
import { Design, Tag } from "../../../utils/Schemas";
import { AxiosResponse } from "axios";
import DesignCard from "../../../components/DesignCard.tsx";
import DesignDialog from "./DesignDialog.tsx";
import { Add } from "@mui/icons-material";

const Designs = () => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [designOpen, setDesignOpen] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState<Design>();
  const [mode, setMode] = useState<"add" | "edit">("add");

  const handleOpenDialog = (design?: Design) => {
    if (design) {
      setSelectedDesign(design);
      setMode("edit");
    } else {
      const newDesign: Design = {
        id: "",
        name: "",
        description: "",
        pictureData: "",
        shape: "",
        tags: [],
        pastryMaterialId: "",
        variants: [],
      };
      setSelectedDesign(newDesign);
      setMode("add");
    }
    setDesignOpen(true);
  };

  const handleCloseDrawer = () => {
    setDesignOpen(false);
    setMode("add");
  };

  function parseDesigns(response: AxiosResponse): Design[] {
    return response.data.map((design: any) => ({
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
    }));
  }

  const fetchDesigns = async () => {
    await api.get("designs").then((response) => {
      const parsedDesigns: Design[] = parseDesigns(response);
      setDesigns(parsedDesigns);
    });
  };

  const fetchTags = async () => {
    await api.get("tags").then((response) => {
      const parsedTags: Tag[] = response.data.map((tag: any) => ({
        id: tag.designTagId,
        name: tag.designTagName,
      }));
      setTags(parsedTags);
    });
  };

  useEffect(() => {
    fetchDesigns();
    fetchTags();
  }, []);

  return (
    <>
      <Header title="DESIGNS" subtitle="Gallery of all designs" />
      <Grid container spacing={2}>
        <Grid>
          <Button
            variant="contained"
            onClick={() => handleOpenDialog}
            sx={{ width: 140, height: 360 }}
          >
            <Add />
          </Button>
        </Grid>
        {/* <Grid size={{ xs: 12, sm: 3, md: 2, lg: 1.5 }}>
          <Card elevation={2} sx={{ height: 300, display: "inline-block" }}>
            <CardActionArea
              sx={{
                height: "inherit",
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
              }}
            >
              <CardMedia sx={{ height: 140, width: "100%" }}>
                <Skeleton variant="rectangular" width="100%" height={140} />
              </CardMedia>
              <CardContent>
                <Skeleton
                  variant="text"
                  width={100}
                  sx={{ fontSize: "2rem" }}
                />
                <Skeleton
                  variant="text"
                  width={100}
                  sx={{ fontSize: "1rem" }}
                />
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid> */}
        {designs && designs.length > 0 ? (
          designs.map((design) => (
            <Grid key={design.id} size={{ xs: 12, sm: 3, md: 2, lg: 1.5 }}>
              <DesignCard
                design={design}
                onClick={() => handleOpenDialog(design)}
                manager
              />
            </Grid>
          ))
        ) : (
          <Grid>
            <CircularProgress />
          </Grid>
        )}
      </Grid>
      <DesignDialog
        mode={mode}
        open={designOpen}
        onClose={handleCloseDrawer}
        design={selectedDesign}
        tags={tags}
      />
    </>
  );
};

export default Designs;
