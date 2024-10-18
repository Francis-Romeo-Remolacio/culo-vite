import { useState, useEffect } from "react";
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Stack,
  Skeleton,
  Tooltip,
  ListItemButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../api/axiosConfig";
import { Design, Order } from "../../utils/Schemas";
import { getImageType } from "../../components/Base64Image";
import { PointOfSale } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

type OrderListItemProps = {
  order: Order;
  fetchOrders: () => Promise<void>;
  handleOpen: (order: Order) => void;
};

const OrderListItem = ({
  order,
  fetchOrders,
  handleOpen,
}: OrderListItemProps) => {
  const [design, setDesign] = useState<Design>();
  const labelId = `checkbox-list-label-${order.id}`;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDesignData = async () => {
      try {
        // Fetch design data and try fetching design info separately
        const [designDataResponse, designInfoResponse] = await Promise.all([
          api.get(
            `designs/${encodeURIComponent(
              order.listItems.suborders[0].id ||
                order.listItems.customOrders[0].id
            )}`
          ),
          (async () => {
            try {
              return await api.get(
                `ui-helpers/get-design-info/${encodeURIComponent(
                  order.listItems.suborders[0].id ||
                    order.listItems.customOrders[0].id
                )}`
              );
            } catch (error) {
              console.warn("Failed to fetch design info: ", error);
              return null; // Return null if design info request fails
            }
          })(),
        ]);

        // Parse design data
        const parsedDesignData = {
          id: designDataResponse.data.designId,
          name: designDataResponse.data.displayName,
          description: designDataResponse.data.cakeDescription,
          shape: designDataResponse.data.shape,
          tags: designDataResponse.data.designTags.map((tag: any) => ({
            id: tag.designTagId,
            name: tag.designTagName,
          })),
          shapes: designDataResponse.data.designShapes.map((shape: any) => ({
            id: shape.designShapeId,
            name: shape.shapeName,
          })),
        };

        // Parse design info if available
        let parsedDesignInfo = {};
        if (designInfoResponse) {
          parsedDesignInfo = {
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
        }

        // Combine both data sets
        const combinedDesignData = {
          ...parsedDesignData,
          ...parsedDesignInfo, // This will only include designInfo if it succeeded
        };

        setDesign(combinedDesignData as any);
        console.log(combinedDesignData);
      } catch (error) {
        console.error("Error fetching design data or design info: ", error);
      }
    };

    fetchDesignData();
  }, []);

  const [image, setImage] = useState("");
  const [imageType, setImageType] = useState("");

  useEffect(() => {
    const fetchImage = async () => {
      console.log(order.listItems.suborders);
      if (design?.pastryMaterialId) {
        setImage(
          await api.get(
            `designs/${order.listItems.suborders[0].designId}/display-picture-data`
          )
        );
      } else {
        setImage(
          await api
            .get(
              `current-user/custom-orders/${order.listItems.customOrders[0].designId}/picture`
            )
            .then((response) => response.data.base64Picture)
        );
      }
    };
    fetchImage();
  }, [design]);

  useEffect(() => {
    try {
      const type = getImageType(image);
      setImageType(type);
    } catch (err) {
      console.error("Error determining image type:", err);
    }
  }, [image]);

  const handleClickCancel = async () => {
    try {
      await api.delete(`current-user/to-pay/${order.id}`);
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order item:", error);
    }
  };

  const handleClickPay = async () => {
    console.log(order);

    // setisSubmitting(true);
    try {
      const response: any = await api.post(`${order.id}/payment`, {
        option: order.payment,
      });

      window.open(response.data.data.attributes.checkout_url);
      navigate(`/post-payment?order=${order.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      // setisSubmitting(false);
    }
  };

  return (
    <ListItem
      key={order.id}
      secondaryAction={
        <Stack direction="row" spacing={1}>
          <Tooltip title="Cancel">
            <IconButton
              edge="end"
              color="error"
              size="large"
              onClick={handleClickCancel}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Pay">
            <IconButton
              edge="end"
              color="success"
              size="large"
              onClick={handleClickPay}
            >
              <PointOfSale fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </Stack>
      }
      disablePadding
    >
      <ListItemButton onClick={() => handleOpen(order)}>
        <ListItemAvatar sx={{ height: "160px" }}>
          {image ? (
            <img
              src={`data:${imageType};base64,${image}`}
              style={{
                width: "100%",
                maxWidth: 200,
                borderRadius: "4px",
              }}
            />
          ) : (
            <Skeleton
              variant="rounded"
              sx={{ width: "200px", height: "160px" }}
            />
          )}
        </ListItemAvatar>
        <ListItemText
          id={labelId}
          primary={design ? `Name: ${design.name}` : `Name: Custom Order`}
          // secondary={`Price: ${formatToCurrency(itemData.price)}`}
          sx={{ pl: 2 }}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default OrderListItem;
