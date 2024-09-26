/*import React, { useState, useEffect } from "react";
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
import ButtonView from "./ButtonView.jsx";

const ToPayItem = ({ orderData, checked, handleToggle, fetchCart }) => {
  /*const [designData, setDesignData] = useState([]);
  const [designInfo, setDesignInfo] = useState(null);*/
/*const labelId = `checkbox-list-label-${orderData.orderName}`;

  /*useEffect(() => {
    const fetchDesignData = async () => {
      try {
        var response = await api.get(
          `/BOM/designs/${encodeURIComponent(orderData.designId)}`
        );
        setDesignData(response.data);
        response = await api.get(
          `/BOM/ui_helpers/get_design_info/${encodeURIComponent(
            orderData.designId
          )}`
        );
        setDesignInfo(response.data);
      } catch (error) {
        console.error("Error fetching design data:", error);
      }
    };
    fetchDesignData();
  }, []);*/

/*const formatToCurrency = (num) => {
    num = new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(num);

    return num;
  };

  return (
    <ListItem
      key={orderData.id}
      secondaryAction={
        <Stack direction="row" spacing={1}>
          {orderData ? (
            <ButtonView orderData={orderData} />
          ) : (
            <Skeleton variant="circular" width={36} height={36} />
          )}
        </Stack>
      }
      disablePadding
    >
      <ListItemButton onClick={handleToggle(orderData.id)}>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={checked.indexOf(orderData.id) !== -1}
            tabIndex={-1}
            disableRipple
            inputProps={{ "aria-labelledby": labelId }}
          />
        </ListItemIcon>
        <ListItemAvatar sx={{ height: "160px" }}>
          {false /*designData.displayPictureData*/ /* ? (
            <></> /*<img
              src={`data:image/png;base64,${designData.displayPictureData}`}
              alt={designData.displayName}
              style={{
                height: "100%",
                borderRadius: "4px",
              }}
            />*/ /*
          ) : (
            <Skeleton
              variant="rounded"
              sx={{ width: "160px", height: "160px" }}
            />
          )}
        </ListItemAvatar>
        <ListItemText
          id={labelId}
          primary={`Order: ${orderData.orderName}`}
          secondary={`Price: ${formatToCurrency(orderData.price)}`}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default ToPayItem;
*/
