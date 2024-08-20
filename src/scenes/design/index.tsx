import { Image, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../api/axiosConfig";
import { Design as DesignClass } from "../../utils/Schemas";

const Design = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const designId = query.get("q") || "";

  const [designData, setDesignData] = useState<DesignClass>();
  const [loading, setLoading] = useState(true);
  const [imageType, setImageType] = useState("");
  const [picture, setPicture] = useState("");
  const [stockStatus, setStockStatus] = useState(true);
  const [price, setPrice] = useState(0.0);
  const [rating, setRating] = useState(5.0);
  const [size, setSize] = useState("");
  const [flavor, setFlavor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [availableFlavors, setAvailableFlavors] = useState([
    "Dark Chocolate",
    "Funfetti (vanilla with sprinkles)",
    "Vanilla Caramel",
    "Mocha",
    "Red Velvet",
    "Banana",
  ]);

  useEffect(() => {
    const fetchDesignData = async () => {
      try {
        const responseMain = await api.get(
          `designs/${encodeURIComponent(designId)}`
        );
        /*const responseInfo = await api.get(
          `ui-helpers/get-design-info/${encodeURIComponent(designId)}`
        );*/
        setDesignData(
          Object.assign({}, responseMain.data /*, responseInfo.data*/)
        );
        if (designData) {
          try {
            setPicture(designData.display_picture_data);
          } catch (err) {
            console.error("Error setting picture:", err);
          }
          setPrice(Math.ceil(designData.variants[0].cost_estimate / 100) * 100);
          setStockStatus(designData.variants[0].in_stock);
        }
      } catch (error) {
        console.error("Error fetching design data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (designId) {
      fetchDesignData();
    }
  }, [designId]);

  if (designData) {
    return (
      <>
        <Title>{designData.display_name}</Title>
        <Image
          src={`data:image/${imageType};base64,${picture}`}
          alt="Cake"
          fit="contain"
        />
        <Title variant="subtitle1">
          Pink Butter Cake Studio Original Design
        </Title>
      </>
    );
  }
};

export default Design;
