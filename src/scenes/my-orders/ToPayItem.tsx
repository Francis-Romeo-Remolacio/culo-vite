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
import { Design, PreviewOrder } from "../../utils/Schemas";

type ToPayItemProps = {
  itemData: PreviewOrder;
  checked: PreviewOrder[]; // Adjusted to use PreviewOrder since it represents an order
  handleToggle: (order: PreviewOrder) => () => void;
  fetchOrders: () => Promise<void>;
};

const ToPayItem = ({
  itemData,
  checked,
  handleToggle,
  fetchOrders,
}: ToPayItemProps) => {
  const [design, setDesign] = useState<Design>();
  const labelId = `checkbox-list-label-${itemData.id}`;

  const handleClickRemove = () => {
    deleteItem();
  };

  useEffect(() => {
    const fetchDesignData = async () => {
      try {
        const [designDataResponse, designInfoResponse] = await Promise.all([
          api.get(`designs/${encodeURIComponent(itemData.designId)}`),
          api.get(
            `ui-helpers/get-design-info/${encodeURIComponent(
              itemData.designId
            )}`
          ),
        ]);

        const parsedDesignData = {
          id: designDataResponse.data.designId,
          name: designDataResponse.data.displayName,
          description: designDataResponse.data.cakeDescription,
          pictureUrl: designDataResponse.data.designPictureUrl,
          pictureData: designDataResponse.data.displayPictureData,
          tags: designDataResponse.data.designTags.map((tag: any) => ({
            id: tag.designTagId,
            name: tag.designTagName,
          })),
          shapes: designDataResponse.data.designShapes.map((shape: any) => ({
            id: shape.designShapeId,
            name: shape.shapeName,
          })),
        };

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

        const combinedDesignData = {
          ...parsedDesignData,
          ...parsedDesignInfo,
        };
        setDesign(combinedDesignData as Design);
      } catch (error) {
        console.error("Error fetching design data or design info: ", error);
      }
    };

    fetchDesignData();
  }, []);

  const deleteItem = async () => {
    try {
      await api.delete(`current-user/to-pay/${itemData.id}`);
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order item:", error);
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
        </Stack>
      }
      disablePadding
    >
      <ListItemButton onClick={handleToggle(itemData)}>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={
              checked.findIndex((order) => order.id === itemData.id) !== -1
            }
            tabIndex={-1}
            disableRipple
            inputProps={{ "aria-labelledby": labelId }}
          />
        </ListItemIcon>
        <ListItemAvatar sx={{ height: "160px" }}>
          {design?.pictureData ? (
            <img
              src={`data:image/png;base64,${design.pictureData}`}
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
          // secondary={`Price: ${formatToCurrency(itemData.price)}`}
          sx={{ pl: 2 }}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default ToPayItem;
