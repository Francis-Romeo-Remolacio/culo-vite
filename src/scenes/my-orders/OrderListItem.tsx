import { useState, useEffect } from "react";
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Stack,
  Skeleton,
  ListItemButton,
  Button,
  Box,
} from "@mui/material";
import api from "../../api/axiosConfig";
import { Order } from "../../utils/Schemas";
import { getImageType } from "../../components/Base64Image";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../components/CuloAlert";
import { toCurrency } from "../../utils/Formatter";

type OrderListItemProps = {
  order: Order;
  fetchOrders: () => Promise<void>;
  handleOpen: (order: Order) => void;
  status: "to-approve" | "to-pay" | "to-receive" | "completed";
};

const OrderListItem = ({
  order,
  fetchOrders,
  handleOpen,
  status,
}: OrderListItemProps) => {
  const { makeAlert } = useAlert();
  const navigate = useNavigate();

  const [image, setImage] = useState("");
  const [imageType, setImageType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      if (
        order.listItems.customOrders.length > 0 &&
        order.listItems.customOrders[0].designId
      ) {
        await api
          .get(
            `current-user/custom-orders/${order.listItems.customOrders[0].designId}/picture`
          )
          .then((response) => setImage(response.data.base64Picture));
      } else if (
        order.listItems.suborders.length > 0 &&
        order.listItems.suborders[0].designId
      ) {
        await api
          .get(
            `designs/${order.listItems.suborders[0].designId}/display-picture-data`
          )
          .then((response) => setImage(response.data.displayPictureData));
      }
    };
    fetchImage();
  }, []);

  useEffect(() => {
    if (image) {
      try {
        const type = getImageType(image);
        setImageType(type);
      } catch (err) {
        console.error("Error determining image type:", err);
      }
    }
  }, [image]);

  const handleClickCancel = async () => {
    setIsSubmitting(true);
    try {
      await api.post(`current-user/${order.id}/cancel`);
      makeAlert("success", "Successfully canceled order.");
    } catch (error) {
      console.error(error);
      makeAlert("error", "Failed to canceled order.");
    } finally {
      fetchOrders();
      setIsSubmitting(false);
    }
  };

  const handleClickPay = async () => {
    setIsSubmitting(true);
    try {
      const response: any = await api.post(`paymongo/${order.id}/payment`, {
        option: order.payment,
      });

      window.open(response.data.data.attributes.checkout_url);
      navigate(`/post-payment?transaction=${response.data.data.id}`);
    } catch (error) {
      console.error(error);
      makeAlert("error", "Failed to process payment.");
    } finally {
      fetchOrders();
      setIsSubmitting(false);
    }
  };

  const handleClickReceive = async () => {
    setIsSubmitting(true);
    try {
      if (order.payment === "full") {
        try {
          await api.post(`orders/current-user/${order.id}/order-received`);
          fetchOrders();
          makeAlert("success", "Order completed.");
        } catch (error) {
          console.error("Error updating status:", error);
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
      makeAlert("error", "Failed to complete order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ListItem key={order.id}>
      <Stack justifyContent="right" sx={{ width: "100%" }}>
        <ListItemButton onClick={() => handleOpen(order)}>
          <ListItemAvatar sx={{ height: "160px" }}>
            {image ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "200px",
                  height: "100%",
                }}
              >
                <img
                  src={`data:${imageType};base64,${image}`}
                  style={{
                    borderRadius: "4px",
                  }}
                />
              </Box>
            ) : (
              <Skeleton
                variant="rounded"
                sx={{ width: "200px", height: "100%" }}
              />
            )}
          </ListItemAvatar>
          <ListItemText
            id={`label-${order.id}`}
            primary={
              order.listItems.customOrders.length > 0 &&
              order.listItems.customOrders[0].designName
                ? `Name: ${order.listItems.customOrders[0].designName}`
                : order.listItems.suborders.length > 0 &&
                  order.listItems.suborders[0].designName
                ? `Name: ${order.listItems.suborders[0].designName}`
                : `Name: Custom Order`
            }
            secondary={`Price: ${toCurrency(order.price.full)}`}
            sx={{ pl: 2 }}
          />
        </ListItemButton>
        {status === "to-approve" ? (
          <Stack direction="row">
            <Box flexGrow={1} />
            <Button
              variant="contained"
              size="large"
              onClick={handleClickCancel}
              disabled={isSubmitting}
            >
              {"Cancel Order"}
            </Button>
          </Stack>
        ) : status === "to-pay" ? (
          <Stack direction="row">
            <Box flexGrow={1} />
            <Button
              variant="contained"
              size="large"
              onClick={handleClickPay}
              disabled={isSubmitting}
            >
              {"Pay Order"}
            </Button>
          </Stack>
        ) : status === "to-receive" ? (
          <Stack direction="row">
            <Box flexGrow={1} />
            <Button
              variant="contained"
              size="large"
              onClick={handleClickReceive}
              disabled={isSubmitting || order.status !== "to-receive"}
            >
              {"Complete Order"}
            </Button>
          </Stack>
        ) : null}
      </Stack>
    </ListItem>
  );
};

export default OrderListItem;
