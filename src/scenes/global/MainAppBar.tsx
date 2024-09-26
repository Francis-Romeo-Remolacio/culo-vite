import { MouseEvent, ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled, alpha } from "@mui/material/styles";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Badge,
  MenuItem,
  Menu,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MoreIcon from "@mui/icons-material/MoreVert";
import Cookies from "js-cookie";
import api from "./../../api/axiosConfig.js";
import { Popper } from "@mui/material";
import { useTheme } from "@emotion/react";
import { Tokens } from "../../theme.js";
import CheckIcon from "@mui/icons-material/Check";
import { Notification } from "../../utils/Schemas.js";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));
type MainAppBarProps = {
  children: ReactNode;
};

export default function MainAppBar({ children }: MainAppBarProps) {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);

  // AppBar
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);

  // Notification Popper
  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const token = Cookies.get("token");

  const fetchNotifs = async () => {
    try {
      const response = await api.get("current-user/notifications");
      setNotifications(response.data);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await api.get(`current-user/cart`);
      setCartData(response.data);
      console.log(cartData);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  useEffect(() => {
    const checkLogin = () => {
      try {
        if (token?.length) {
          // Token exists, check user role
          const currentUserStored = localStorage.getItem("currentUser");

          if (currentUserStored) {
            const currentUser = JSON.parse(
              decodeURIComponent(currentUserStored)
            );
            if (currentUser.roles && currentUser.roles.length > 0) {
              setLoggedIn(true);
              fetchNotifs();
              fetchCart();
            }
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };

    checkLogin();
  }, []);

  const readNotif = async (id: string) => {
    try {
      const response = await api.post(
        `current-user/notifications/${id}/mark-as-read`
      );
      fetchNotifs();
    } catch (error) {
      console.error(error);
    }
  };

  const navigate = useNavigate();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setNotifAnchorEl(event.currentTarget);
    setOpen((prev) => !prev);
  };

  const handleProfileMenuOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleCart = () => {
    navigate("/cart");
  };

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("currentUser");
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = loggedIn ? (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      <MenuItem onClick={handleLogout} href="/">
        Logout
      </MenuItem>
    </Menu>
  ) : (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleLogin}>Login</MenuItem>
      <MenuItem onClick={handleRegister}>Register</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = loggedIn ? (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={notifications.length}>
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleCart}>
        <IconButton
          size="large"
          aria-label="show ${cartData.length} pending cart items"
          color="inherit"
        >
          <Badge badgeContent={cartData.length}>
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <p>Cart</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  ) : (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleLogin}>Login</MenuItem>
      <MenuItem onClick={handleRegister}>Register</MenuItem>
    </Menu>
  );

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" enableColorOnDark>
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: "block" }}
            >
              The Pink Butter Cake Studio
            </Typography>
            {loggedIn ? (
              <>
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ "aria-label": "search" }}
                  />
                </Search>
              </>
            ) : (
              <></>
            )}
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {loggedIn ? (
                <>
                  <IconButton
                    size="large"
                    onClick={handleClick}
                    color="inherit"
                  >
                    <Badge badgeContent={notifications.length} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                  <IconButton
                    href="/cart"
                    size="large"
                    aria-label="show ${cartData.length} pending cart items"
                    color="inherit"
                  >
                    <Badge badgeContent={cartData.length}>
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton>
                </>
              ) : (
                <></>
              )}
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
        <Toolbar />
        <Box sx={{ flexGrow: 1, p: 2 }}>{children}</Box>
      </Box>

      <Popper
        open={open}
        anchorEl={notifAnchorEl}
        placement="bottom"
        sx={{ padding: 2 }}
      >
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          {notifications.length > 0
            ? notifications.map((notif: Notification) => {
                const labelId = `checkbox-list-label-${notif.notifId}`;
                return (
                  <ListItem
                    key={notif.notifId}
                    secondaryAction={
                      notif.isRead === false ? (
                        <IconButton
                          edge="end"
                          aria-label="mark-as-read"
                          onClick={() => readNotif(notif.notifId)}
                        >
                          <CheckIcon />
                        </IconButton>
                      ) : (
                        <></>
                      )
                    }
                    disablePadding
                  >
                    <ListItemButton role={undefined}>
                      <ListItemText id={labelId} primary={notif.message} />
                    </ListItemButton>
                  </ListItem>
                );
              })
            : "No notifications"}
        </List>
      </Popper>
    </>
  );
}
