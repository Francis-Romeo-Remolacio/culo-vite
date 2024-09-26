import React, { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
  Box,
  CircularProgress,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { Tokens } from "../../../theme";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import ContactsIcon from "@mui/icons-material/Contacts";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import BarChartIcon from "@mui/icons-material/BarChart";
import PieChartOutlineIcon from "@mui/icons-material/PieChartOutline";
import TimelineIcon from "@mui/icons-material/Timeline";
import MenuIcon from "@mui/icons-material/Menu";
import MapIcon from "@mui/icons-material/Map";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import LabelIcon from "@mui/icons-material/Label";
import CakeIcon from "@mui/icons-material/Cake";
import api from "../../../api/axiosConfig";

import ShapeLineIcon from "@mui/icons-material/ShapeLine";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === to}
      style={{
        color: colors.text,
      }}
      onClick={() => setSelected(to)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const [selected, setSelected] = useState(location.pathname);
  const [loading, setLoading] = useState(true);

  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [errorUser, setErrorUser] = useState(null);

  const [profilePicture, setProfilePicture] = useState("");
  const [loadingProfilePicture, setLoadingProfilePicture] = useState(true);
  const [errorProfilePicture, setErrorProfilePicture] = useState(null);
  const [profilePictureType, setProfilePictureType] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDataResponse = await api.get("/auth/user");
        const profilePictureResponse = await api.get(
          "/auth/user/profile_picture"
        );

        const profilePictureData = profilePictureResponse.data;
        const profilePictureType = getImageType(profilePictureData);

        setUserData(userDataResponse.data);
        setProfilePicture(profilePictureData);
        setProfilePictureType(profilePictureType);

        // Update loadingProfilePicture state to false after profile picture is loaded
        setLoadingProfilePicture(false);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setErrorUser("Failed to fetch user data. Please try again.");
        setErrorProfilePicture(
          "Failed to fetch profile picture. Please try again."
        );
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getImageType = (data) => {
    try {
      const firstChar = data.charAt(0);

      switch (firstChar) {
        case "/":
          return "jpeg";
        case "i":
          return "png";
        default:
          throw new Error("Unsupported image type.");
      }
    } catch (err) {
      console.error("Error determining image type:", err);
      throw err;
    }
  };

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.grey[100]} !important`,
          backdropFilter: "blur(24px)",
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: `${colors.primary[800]} !important`,
        },
        "& .pro-menu-item.active": {
          color: `${colors.primary[500]} !important`,
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.text,
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.text}>
                  CULO
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {userData && !isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                {profilePicture && loadingProfilePicture ? (
                  <CircularProgress />
                ) : (
                  <img
                    alt="profile-user"
                    width="100px"
                    height="100px"
                    src={
                      profilePicture
                        ? `data:image/${profilePictureType};base64,${profilePicture}`
                        : "/assets/user.png"
                    }
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/assets/user.png";
                    }}
                    style={{ cursor: "pointer", borderRadius: "50%" }}
                  />
                )}
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.text}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {userData?.username}
                </Typography>
                <Typography variant="h5" color={colors.pink}>
                  {userData?.roles[0]}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/management/dashboard"
              icon={<HomeIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.text}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Pages
            </Typography>
            <Item
              title="Profile Form"
              to="/management/form"
              icon={<PersonIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Calendar"
              to="/management/calendar"
              icon={<CalendarTodayIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.text}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Data
            </Typography>
            <Item
              title="Inventory"
              to="/management/inventory"
              icon={<Inventory2Icon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="AddOns"
              to="/management/addons"
              icon={<LabelIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Orders"
              to="/management/orders"
              icon={<ShoppingCartCheckoutIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Designs"
              to="/management/designs"
              icon={<CakeIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Pastry Material"
              to="/management/pastry_material"
              icon={<ShapeLineIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Tags"
              to="/management/tags"
              icon={<LabelIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Users"
              to="/management/users"
              icon={<PeopleIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Sales"
              to="/management/sales"
              icon={<PeopleIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Notification"
              to="/management/notification"
              icon={<LabelIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.text}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Other
            </Typography>
            <Item
              title="FAQ Page"
              to="/management/faq"
              icon={<HelpOutlineIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
