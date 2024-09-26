import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Box, Container, Tabs, Tab } from "@mui/material";
import { Helmet } from "react-helmet-async";
import CartList from "./CartList.jsx";
import ToPayList from "./ToPayList.jsx";

const Cart = () => {
  const [tab, setTab] = React.useState(0);

  const handleChangeTab = (event, newTab) => {
    setTab(newTab);
  };

  function CustomTabPanel(props) {
    const { children, tab, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={tab !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {tab === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    tab: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <>
      <Helmet>
        <title>Cart - The Pink Butter Cake Studio</title>
      </Helmet>

      <Container maxWidth="md">
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tab}
            onChange={handleChangeTab}
            aria-label="basic tabs example"
          >
            <Tab label="In Cart" {...a11yProps(0)} />
            <Tab label="To Pay" {...a11yProps(1)} />
            <Tab label="To Receive" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel tab={tab} index={0}>
          <CartList />
        </CustomTabPanel>
        <CustomTabPanel tab={tab} index={1}>
          <ToPayList />
        </CustomTabPanel>
        <CustomTabPanel tab={tab} index={2}>
          To Receive
        </CustomTabPanel>
      </Container>
    </>
  );
};

export default Cart;
