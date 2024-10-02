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

const CartItem = ({ itemData, checked, handleToggle, fetchCart }) => {
  const [designData, setDesignData] = useState([]);
  const [designInfo, setDesignInfo] = useState(null);
  const labelId = `checkbox-list-label-${itemData.orderName}`;

  const handleClickRemove = () => {
    deleteItem();
  };

  useEffect(() => {
    const fetchDesignData = async () => {
      try {
        var response = await api.get(
          `designs/${encodeURIComponent(itemData.designId)}`
        );
        setDesignData(response.data);
        response = await api.get(
          `ui-helpers/get-design-info/${encodeURIComponent(itemData.designId)}`
        );
        setDesignInfo(response.data);
      } catch (error) {
        console.error("Error fetching design data:", error);
      }
    };
    fetchDesignData();
  }, []);

  const deleteItem = async () => {
    try {
      await api.delete(`current-user/cart/${itemData.suborderId}`);
      fetchCart();
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };

  const formatToCurrency = (num) => {
    num = new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(num);

    return num;
  };

  return (
    <ListItem
      key={itemData.suborderId}
      secondaryAction={
        <Stack direction="row" spacing={1}>
          <IconButton
            edge="end"
            aria-label="details"
            onClick={handleClickRemove}
          >
            <DeleteIcon />
          </IconButton>
          {designInfo ? (
            <ButtonEdit orderData={itemData} designInfo={designInfo} />
          ) : (
            <Skeleton variant="circular" width={36} height={36} />
          )}
        </Stack>
      }
      disablePadding
    >
      <ListItemButton onClick={handleToggle(itemData.suborderId)}>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={checked.indexOf(itemData.suborderId) !== -1}
            tabIndex={-1}
            disableRipple
            inputProps={{ "aria-labelledby": labelId }}
          />
        </ListItemIcon>
        <ListItemAvatar sx={{ height: "160px" }}>
          {designData.displayPictureData ? (
            <img
              src={`data:image/png;base64,${designData.displayPictureData}`}
              alt={designData.displayName}
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
          primary={`Name: ${designData.displayName}`}
          secondary={`Price: ${formatToCurrency(itemData.price)}`}
          sx={{ pl: 2 }}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default CartItem;
