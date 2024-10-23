import React, { useState } from "react";
import { Container, Tabs, Tab, Box } from "@mui/material";
import ToPay from "./ToPay";
import ToApprove from "./ToApprove";
import ToPickup from "./ToPickup";

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
