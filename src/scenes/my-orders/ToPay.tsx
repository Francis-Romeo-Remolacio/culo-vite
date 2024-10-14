import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  Divider,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import ToPayItem from "./ToPayItem"; // Import ToPayItem
import ButtonCheckout from "../../components/ButtonCheckout.js";
import api from "../../api/axiosConfig.js";
import DeleteIcon from "@mui/icons-material/Delete";
import { PreviewOrder, Suborder } from "../../utils/Schemas.js";
import dayjs from "dayjs";
import { PointOfSale as PointOfSaleIcon } from "@mui/icons-material";

const ToPay = () => {
  const [checked, setChecked] = useState<PreviewOrder[]>([]);
  const [orderData, setOrderData] = useState<PreviewOrder[]>([]);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(false);

  const fetchOrders = async () => {
    try {
      const response = await api.get(`current-user/to-pay`);
      const orders = response.data;

      const parsedOrders: PreviewOrder[] = await Promise.all(
        orders.map(async (order: any) => {
          const parsedOrder = {
            id: order.orderId,
            type: order.type,
            pickupDateTime: order.pickup ? dayjs(order.pickup) : null,
            payment: order.payment ? order.payment : "half",
            designId: order.designId,
            price: order.price,
            suborders: [] as Suborder[],
          };

          // Fetch design data for each order's designId
          try {
            const [designDataResponse, designInfoResponse] = await Promise.all([
              api.get(`designs/${encodeURIComponent(order.designId)}`),
              api.get(
                `ui-helpers/get-design-info/${encodeURIComponent(
                  order.designId
                )}`
              ),
            ]);

            // Parse the design data and design info
            const parsedDesignData = {
              id: designDataResponse.data.designId,
              name: designDataResponse.data.displayName,
              description: designDataResponse.data.cakeDescription,
              tags: designDataResponse.data.designTags.map((tag: any) => ({
                id: tag.designTagId,
                name: tag.designTagName,
              })),
              shapes: designDataResponse.data.designShapes.map(
                (shape: any) => ({
                  id: shape.designShapeId,
                  name: shape.shapeName,
                })
              ),
            };

            const parsedDesignInfo = {
              pastryMaterialId: designInfoResponse.data.pastryMaterialId,
              variants: designInfoResponse.data.variants.map(
                (variant: any) => ({
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
                })
              ),
            };

            // Use the design data's variants to create the suborders
            parsedOrder.suborders = parsedDesignInfo.variants.map(
              (variant: any) => ({
                id: variant.id,
                designId: parsedDesignData.id,
                pastryId: parsedDesignInfo.pastryMaterialId,
                description: parsedDesignData.description,
                size: variant.name,
                color: "", // You can add color if available in your design data
                flavor: "", // You can add flavor if available in your design data
                quantity: 1, // Set default quantity to 1 or fetch from design data if available
                price: variant.cost,
              })
            );
            setOrderData(parsedOrders);
          } catch (designFetchError) {
            console.error(
              "Error fetching design data for order:",
              order.designId,
              designFetchError
            );
          }

          return parsedOrder;
        })
      );

      setOrderData(parsedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleClickClear = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = (order: PreviewOrder) => {
    const currentIndex = checked.findIndex((item) => item.id === order.id);
    let newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(order);
    } else {
      newChecked = newChecked.filter((item) => item.id !== order.id);
    }

    setChecked(newChecked);
  };

  const handlePay = async (orders: PreviewOrder[]) => {
    console.log(orderData);

    setisSubmitting(true);
    try {
      const response: any = await api.post(`${orders[0].id}/payment`, {
        option: orders[0].payment,
      });

      window.open(response.data.data.attributes.checkout_url);
    } catch (error) {
      console.error(error);
    } finally {
      setisSubmitting(false);
    }
  };
  return (
    <Stack spacing={2}>
      {orderData.length > 0 ? (
        <List sx={{ width: "100%" }}>
          {orderData.map((order) => (
            <React.Fragment key={order.id}>
              <ToPayItem
                itemData={order} // Displaying first suborder for simplicity
                checked={checked}
                handleToggle={(order) => () => {
                  handleToggle(order);
                }}
                fetchOrders={fetchOrders}
              />
              <Divider />
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Box
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="body1">No orders to pay for.</Typography>
        </Box>
      )}
      <Button
        type="submit"
        variant="contained"
        onClick={() => handlePay(checked)}
        endIcon={!isSubmitting ? <PointOfSaleIcon /> : ""}
        disabled={isSubmitting}
      >
        {!isSubmitting ? "Send Order" : <CircularProgress size={21} />}
      </Button>
    </Stack>
  );
};

export default ToPay;
