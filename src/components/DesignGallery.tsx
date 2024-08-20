import { useState, useEffect } from "react";
import { Grid } from "@mantine/core";
import DesignCard from "./DesignCard.tsx";
import api from "./../api/axiosConfig.ts";
import { Design } from "../utils/Schemas.ts";

const DesignGallery = () => {
  const [designs, setDesigns] = useState<Design[] | undefined>(undefined);

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const response = await api.get("designs");
        setDesigns(response.data);
      } catch (error) {
        console.error("Error fetching designs:", error);
      }
    };

    fetchDesigns();
  }, []);

  return (
    <Grid mt={8}>
      {designs?.map((design) => (
        <Grid.Col
          key={design.design_id}
          span={{ base: 12, xs: 6, sm: 4, md: 3, lg: 2 }}
        >
          <DesignCard
            isSale
            id={design.design_id}
            designName={design.display_name}
            description={design.cake_description}
            picture={
              /*design.design_picture_url || */ design.display_picture_data
            }
            tags={design.design_tags}
          />
        </Grid.Col>
      ))}
    </Grid>
  );
};

export default DesignGallery;
