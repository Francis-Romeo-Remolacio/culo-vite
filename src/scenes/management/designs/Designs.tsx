import { useEffect, useState } from "react";
import { CircularProgress, Container, Grid2 as Grid } from "@mui/material";
import api from "../../../api/axiosConfig";
import Header from "../../../components/Header";
import { Design } from "../../../utils/Schemas";
import { AxiosResponse } from "axios";
import DesignCard from "../../../components/DesignCard.tsx";
import DesignDialog from "./DesignDialog.tsx";

const Designs = () => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [designDrawerOpen, setDesignDrawerOpen] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState<Design>();
  const [mode, setMode] = useState<"add" | "edit">("add");

  const handleOpenDrawer = (design: Design) => {
    setSelectedDesign(design);
    setMode("edit");
    setDesignDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDesignDrawerOpen(false);
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

  useEffect(() => {
    fetchDesigns();
  }, []);

  return (
    <>
      <Header title="DESIGNS" subtitle="Gallery of all designs" />
      <Grid container spacing={2}>
        {designs
          ? designs.map((design) => (
              <Grid size={{ xs: 12, sm: 3, md: 2, lg: 1.5 }}>
                <DesignCard
                  design={design}
                  onClick={() => handleOpenDrawer(design)}
                  manager
                />
              </Grid>
            ))
          : "Loading"}
      </Grid>
      <DesignDialog
        open={designDrawerOpen}
        onClose={handleCloseDrawer}
        design={selectedDesign}
        mode={mode}
      />
    </>
  );
};

export default Designs;
