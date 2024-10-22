import { useState, useEffect } from "react";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Checkbox,
  IconButton,
  Stack,
  Skeleton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../api/axiosConfig";
import ButtonEdit from "./ButtonEdit.jsx";
import { Design, Suborder } from "../../utils/Schemas.js";
import { getImageType } from "../../components/Base64Image.js";

type CartItemProps = {
  itemData: Suborder;
  checked: Suborder[];
  handleToggle: (suborder: Suborder) => () => void;
  fetchCart: () => Promise<void>;
};
const CartItem = ({
  itemData,
  checked,
  handleToggle,
  fetchCart,
}: CartItemProps) => {
  const [design, setDesign] = useState<Design>();
  const labelId = `checkbox-list-label-${itemData.id}`;

  const handleClickRemove = () => {
    deleteItem();
  };

  useEffect(() => {
    const fetchDesignData = async () => {
      {
        try {
          // Fetch both the design data and design info simultaneously
          const [designDataResponse, designInfoResponse] = await Promise.all([
            api.get(`designs/${encodeURIComponent(itemData.designId)}`),
            api.get(
              `ui-helpers/get-design-info/${encodeURIComponent(
                itemData.designId
              )}`
            ),
          ]);

          // Parse the design data
          const parsedDesignData = {
            id: designDataResponse.data.designId,
            name: designDataResponse.data.displayName,
            description: designDataResponse.data.cakeDescription,
            tags: designDataResponse.data.designTags.map((tag: any) => ({
              id: tag.designTagId,
              name: tag.designTagName,
            })),
            shape: designDataResponse.data.designShape,
          };

          // Parse the design info
          const parsedDesignInfo = {
            pastryMaterialId: designInfoResponse.data.pastryMaterialId,
            variants: designInfoResponse.data.variants.map((variant: any) => ({
              id: variant.variantId,
              name: variant.variantName,
              cost: variant.costEstimate,
              inStock: variant.inStock,
              addOns: variant.addOns.map((addOn: any) => ({
                id: addOn.addOnId,
                name: addOn.addOnName,
                price: addOn.price,
                amount: addOn.amount,
                stock: addOn.stock,
              })),
            })),
          };

          // Merge the design data and design info into a single object
          const combinedDesignData = {
            ...parsedDesignData,
            ...parsedDesignInfo,
          };
          setDesign(combinedDesignData as Design);
        } catch (error) {
          console.error("Error fetching design data or design info: ", error);
        }
      }
    };

    fetchDesignData();
  }, []);

  const [image, setImage] = useState("");
  const [imageType, setImageType] = useState("");

  useEffect(() => {
    if (design) {
      const fetchImage = async () => {
        const response = await api.get(
          `designs/${design.id}/display-picture-data`
        );
        setImage(response.data.displayPictureData);
      };
      fetchImage();
    }
  }, [design]);

  useEffect(() => {
    try {
      const type = getImageType(image);
      setImageType(type);
    } catch (err) {
      console.error("Error determining image type:", err);
    }
  }, [image]);

  const deleteItem = async () => {
    try {
      await api.delete(`current-user/cart/${itemData.id}`);
      fetchCart();
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };

  const formatToCurrency = (num: number): string => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(num);
  };

  return (
    <ListItem
      key={itemData.id}
      secondaryAction={
        <Stack direction="row" spacing={1}>
          <IconButton
            edge="end"
            aria-label="details"
            onClick={handleClickRemove}
          >
            <DeleteIcon />
          </IconButton>
          {design ? (
            <ButtonEdit orderData={itemData} designInfo={design} />
          ) : (
            <Skeleton variant="circular" width={36} height={36} />
          )}
        </Stack>
      }
      disablePadding
    >
      <ListItemButton onClick={handleToggle(itemData)}>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={
              checked.findIndex((suborder) => suborder.id === itemData.id) !==
              -1
            }
            tabIndex={-1}
            disableRipple
            inputProps={{ "aria-labelledby": labelId }}
          />
        </ListItemIcon>
        <ListItemAvatar sx={{ height: "160px" }}>
          {design && image ? (
            <img
              src={`data:${imageType};base64,${image}`}
              alt={design.name}
              style={{
                height: "100%",
                borderRadius: "4px",
              }}
            />
          ) : (
            <Skeleton
              variant="rounded"
              sx={{ width: "160px", height: "160px" }}
            />
          )}
        </ListItemAvatar>
        <ListItemText
          id={labelId}
          primary={design ? `Name: ${design.name}` : `Name: Loading...`}
          secondary={`Price: ${formatToCurrency(itemData.price)}`}
          sx={{ pl: 2 }}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default CartItem;
