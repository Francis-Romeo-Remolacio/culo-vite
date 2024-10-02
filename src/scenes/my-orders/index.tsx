import { Container } from "@mui/material";
import ToPay from "./to-pay";
import ToApprove from "./to-approve";
import ToPickup from "./to-pickup";

const MyOrders = () => {
  return (
    <Container maxWidth="md">
      <Tabs value={value} onChange={handleChange}>
        <Tab label="To Approve"></Tab>
        <Tab label="To Pay"></Tab>
        <Tab label="To Pickup"></Tab>
      </Tabs>
      <TabPanel></TabPanel>
    </Container>
  );
};

export default MyOrders;
