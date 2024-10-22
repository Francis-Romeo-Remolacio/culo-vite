import { useEffect, useState } from "react";
import { Button, CircularProgress, Grid2 as Grid } from "@mui/material";
import api from "../../../api/axiosConfig";
import Header from "../../../components/Header";
import { Design, Tag } from "../../../utils/Schemas";
import { AxiosResponse } from "axios";
import DesignCard from "../../../components/DesignCard.tsx";
import DesignDialog from "./DesignDialog.tsx";
import { Add, ShapeLine } from "@mui/icons-material";

const Designs = () => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [designOpen, setDesignOpen] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState<Design>();

  const handleOpenDialog = (design?: Design) => {
    if (design) {
      setSelectedDesign(design);
    } else {
      const newDesign: Design = {
        id: "",
        name: "",
        description: "",
        shape: "round",
        tags: [],
        pastryMaterialId: "",
        variants: [],
      };
      setSelectedDesign(newDesign);
    }
    setDesignOpen(true);
  };

  const handleCloseDesignDialog = () => {
    setDesignOpen(false);
  };

  function parseDesigns(response: AxiosResponse): Design[] {
    const parseShape = (shapeList: any) => {
      if (
        shapeList !== undefined &&
        shapeList !== null &&
        shapeList[0] !== undefined &&
        shapeList[0] !== null
      ) {
        const selectedShape = shapeList[0];
        if (
          selectedShape.shapeName !== "round" &&
          selectedShape.shapeName !== "heart" &&
          selectedShape.shapeName !== "rectangle"
        ) {
          return "custom";
        } else {
          return selectedShape.shapeName;
        }
      }
      return "custom";
    };
    const parseCustomShape = (shapeList: any) => {
      if (
        shapeList !== undefined &&
        shapeList !== null &&
        shapeList[0] !== undefined &&
        shapeList[0] !== null
      ) {
        const selectedShape = shapeList[0];
        if (
          selectedShape.shapeName !== "round" ||
          selectedShape.shapeName !== "heart" ||
          selectedShape.shapeName !== "rectangle"
        ) {
          return selectedShape.shapeName;
        } else {
          return "";
        }
      }
    };

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
      shape: parseShape(design.designShapes),
      customShape: parseCustomShape(design.designShapes),

      // shapes: design.designShapes.map((shape: any) => ({
      //   id: shape.designShapeId,
      //   name: shape.shapeName,
      // })),
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
      <Grid
        container
        spacing={2}
        justifyContent={designs && designs.length ? "start" : "center"}
      >
        {designs && designs.length ? (
          <Grid size={{ xs: 12, sm: 3, md: 2, lg: 1.5 }}>
            <Button
              variant="contained"
              onClick={() => handleOpenDialog(undefined)}
              sx={{ width: "100%", height: 360 }}
            >
              <Add />
            </Button>
          </Grid>
        ) : null}
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
        open={designOpen}
        onClose={handleCloseDesignDialog}
        design={selectedDesign}
        tags={tags}
      />
    </>
  );
};

export default Designs;
