import React, { useEffect, useState } from "react";
import {
  Container,
  Tabs,
  Tab,
  Box,
  useTheme,
  Accordion,
  AccordionSummary,
  Stack,
  Typography,
  Button,
  AccordionDetails,
} from "@mui/material";
import ToPay from "./ToPay";
import ToApprove from "./ToApprove";
import ToPickup from "./ToPickup";
import { CustomOrder, Suborder } from "../../utils/Schemas";
import { Tokens } from "../../Theme";
import api from "../../api/axiosConfig";
import { getImageType } from "../../components/Base64Image";
import { ArrowDropDown } from "@mui/icons-material";
import { Helmet } from "react-helmet-async";

type SuborderItemProps = {
  suborder: Suborder | CustomOrder;
  index: number;
  handleAssignClickOpen?: (item: Suborder | CustomOrder) => void;
  handleOpenUpdateModal?: (item: Suborder | CustomOrder) => void;
  custom?: boolean;
};

export const SuborderItem = ({
  suborder,
  index,
  handleAssignClickOpen,
  handleOpenUpdateModal,
  custom,
}: SuborderItemProps) => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);

  // Dynamically get key-value pairs except 'id'
  const suborderDetails = Object.entries(suborder).filter(
    ([key, _]) =>
      key !== "id" &&
      key !== "designId" &&
      key !== "designName" &&
      key !== "addOns"
  );

  // State to store the image
  const [image, setImage] = useState<string | null>(null);
  const [imageType, setImageType] = useState<string | null>(null);

  // Fetch the image asynchronously after render
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await api.get(
          `designs/${suborder.designId}/display-picture-data`
        );
        setImage(response.data.displayPictureData); // Assuming the response contains `displayPictureData`
        setImageType(getImageType(String(response.data.displayPictureData)));
      } catch (error) {
        console.error("Error fetching image", error);
      }
    };

    fetchImage();
  }, [suborder.designId]); // Only run when suborder.designId changes

  return (
    <Accordion key={index} sx={{ backgroundColor: colors.primary[100] }}>
      <AccordionSummary
        expandIcon={<ArrowDropDown />}
        aria-controls={`panel${index}-content`}
        id={`panel${index}-header`}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography>
            {!custom
              ? `Suborder ID: ${suborder.designName}`
              : `Custom Order ID: ${suborder.designName}`}
          </Typography>
          {handleAssignClickOpen ? (
            <Button
              size="small"
              onClick={(event) => {
                event.stopPropagation(); // Prevent the accordion from expanding/collapsing
                handleAssignClickOpen(suborder);
              }}
            >
              Assign
            </Button>
          ) : null}
          {handleOpenUpdateModal ? (
            <Button
              size="small"
              onClick={(event) => {
                event.stopPropagation(); // Prevent the accordion from expanding/collapsing
                handleOpenUpdateModal(suborder);
              }}
            >
              Update
            </Button>
          ) : null}
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        {image && imageType ? (
          <img
            src={`data:${imageType};base64,${image}`}
            style={{
              width: 400,
            }}
          />
        ) : null}
        {suborderDetails.map(([key, value]) => (
          <Box key={key} sx={{ marginBottom: 1 }}>
            <Typography variant="body1">
              <strong>{key}:</strong> {String(value)}
            </Typography>
          </Box>
        ))}
        <Box sx={{ marginBottom: 1 }}>
          <Typography variant="body1">
            <strong>{"Add-Ons"}</strong>
          </Typography>
          <Box sx={{ paddingLeft: 2 }}>
            {suborder.addOns.map((addOn, index) => (
              <Typography key={index} variant="body2">
                {`${addOn.name}: $${addOn.quantity}`}
              </Typography>
            ))}
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const MyOrders: React.FC = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="md">
      <Helmet>
        <title>{"My Orders - The Pink Butter Cake Studio"}</title>
      </Helmet>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="My Orders Tabs">
          <Tab label="To Approve" {...a11yProps(0)} />
          <Tab label="To Pay" {...a11yProps(1)} />
          <Tab label="To Pickup" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <ToApprove />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ToPay />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ToPickup />
      </TabPanel>
    </Container>
  );
};

export default MyOrders;
