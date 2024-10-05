import {
  ChangeEvent,
  ChangeEventHandler,
  FormEvent,
  MouseEvent,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { createSearchParams, Link, useNavigate } from "react-router-dom";
import { styled, alpha, useTheme } from "@mui/material/styles";
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
  Paper,
  Skeleton,
  Stack,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CartIcon from "@mui/icons-material/ShoppingCart";
import OrderIcon from "@mui/icons-material/Redeem";
import MoreIcon from "@mui/icons-material/MoreVert";
import Cookies from "js-cookie";
import api from "./../../api/axiosConfig.js";
import { Popper } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { Notification } from "../../utils/Schemas.js";
import { Tokens } from "../../Theme.js";
import { Login, Style } from "@mui/icons-material";

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

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [cartData, setCartData] = useState([]);
  const [orderData, setOrderData] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const token = Cookies.get("token");
  const navigate = useNavigate();

  const [logoLoaded, setLogoLoaded] = useState(false);
  const [search, setSearch] = useState("");

  const fetchNotifs = async () => {
    try {
      await api.get("current-user/notifications").then((response) => {
        setUnread(response.data.unread);
        const parsedNotifs: Notification[] = response.data.notifs.map(
          (notif: any) => ({
            id: notif.notifId,
            created: notif.dateCreated,
            message: notif.message,
            isRead: notif.isRead,
          })
        );
        setNotifications(parsedNotifs);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await api.get(`current-user/cart`);
      setCartData(response.data);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await api.get(`current-user/orders-count`);
      setOrderData(response.data);
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };

  const handleTypeSearch: ChangeEventHandler = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setSearch(event.target.value);
    console.log(search);
  };

  const handleSearch = () => {
    navigate(`results?q=${search}`);
  };

  useEffect(() => {
    const checkLogin = () => {
      try {
        if (!token) return; // If there's no token, no need to proceed further.

        const currentUserStored = localStorage.getItem("currentUser");
        if (currentUserStored) {
          const currentUser = JSON.parse(decodeURIComponent(currentUserStored));

          // Check if roles are defined and non-empty
          if (
            Array.isArray(currentUser.roles) &&
            currentUser.roles.length > 0
          ) {
            setLoggedIn(true);
            fetchNotifs();
            fetchCart();
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };

    checkLogin();
  }, [token]);

  const readNotif = async (id: string) => {
    try {
      await api.post(`current-user/notifications/${id}/mark-as-read`);
      fetchNotifs();
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setNotifAnchorEl(event.currentTarget);
    setOpen((prev) => !prev);
  };

  const handleProfileMenuOpen = (event: MouseEvent) => {
    setAnchorEl(event.currentTarget as HTMLElement);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
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

  const handleOrders = () => {
    navigate("/my-orders");
  };

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("currentUser");
    window.location.href = "/";
  };

  const menuId = "primary-search-account-menu";

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
        <IconButton size="large" color="inherit" disableTouchRipple>
          <Badge badgeContent={unread} color="default">
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
            <CartIcon />
          </Badge>
        </IconButton>
        <p>Cart</p>
      </MenuItem>
      <MenuItem onClick={handleOrders}>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={0}>
            {" "}
            <OrderIcon />
          </Badge>
        </IconButton>
        <p>My Orders</p>
      </MenuItem>
      <MenuItem onClick={() => navigate("/profile")}>
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
      <Box>
        <AppBar position="fixed" enableColorOnDark>
          <Toolbar>
            <Link to="/" style={{ textDecoration: "none" }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                {!logoLoaded && (
                  <Skeleton
                    variant="circular"
                    width={32}
                    height={32}
                    animation="wave"
                  />
                )}
                <img
                  src="logo192.png"
                  alt="Logo"
                  style={{
                    width: 32,
                    borderRadius: "100%",
                    display: logoLoaded ? "block" : "none",
                  }}
                  onLoad={() => setLogoLoaded(true)}
                />
                <Typography
                  variant="h4"
                  noWrap
                  component="div"
                  sx={{
                    display: { xs: "none", sm: "block" },
                    color: colors.background,
                  }}
                >
                  The Pink Butter Cake Studio
                </Typography>
                <Search>
                  <form onSubmit={handleSearch}>
                    <Stack direction="row" spacing={0.25} sx={{ p: 0.25 }}>
                      <IconButton type="submit">
                        <SearchIcon sx={{ color: colors.background }} />
                      </IconButton>
                      <StyledInputBase
                        placeholder="Search…"
                        onChange={handleTypeSearch}
                        inputProps={{ "aria-label": "search" }}
                        sx={{ color: colors.subtle }}
                      />
                    </Stack>
                  </form>
                </Search>
              </Stack>
            </Link>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {loggedIn ? (
                <>
                  <IconButton
                    size="large"
                    onClick={handleClick}
                    color="inherit"
                  >
                    <Badge
                      badgeContent={notifications.length}
                      color="secondary"
                    >
                      <NotificationsIcon sx={{ color: colors.background }} />
                    </Badge>
                  </IconButton>
                  <IconButton onClick={handleCart} size="large" color="inherit">
                    <Badge badgeContent={cartData.length} color="secondary">
                      <CartIcon sx={{ color: colors.background }} />
                    </Badge>
                  </IconButton>
                  <IconButton
                    onClick={handleOrders}
                    size="large"
                    color="inherit"
                  >
                    <Badge badgeContent={orderData} color="secondary">
                      <OrderIcon sx={{ color: colors.background }} />
                    </Badge>
                  </IconButton>
                  <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={() => navigate("/profile")}
                    color="inherit"
                  >
                    <AccountCircle sx={{ color: colors.background }} />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton
                    size="large"
                    edge="end"
                    onClick={() => {
                      navigate("login");
                    }}
                    color="inherit"
                  >
                    <Login sx={{ color: colors.background }} />
                  </IconButton>
                </>
              )}
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={() => navigate("/login")}
                color="inherit"
              >
                <Login sx={{ color: colors.background }} />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        <Toolbar />
        <Box sx={{ flexGrow: 1, p: 2 }}>{children}</Box>
      </Box>
      <Popper
        open={open}
        anchorEl={notifAnchorEl}
        placement="bottom"
        sx={{ padding: 2 }}
      >
        <Paper sx={{ p: 2 }}>
          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          >
            <Typography variant="h4">{"Notifications"}</Typography>
            <Box
              sx={{
                maxHeight: "300px",
                overflowY: "scroll",
                scrollbarWidth: 0,
              }}
            >
              {notifications.length > 0
                ? notifications.map((notif: Notification) => {
                    const labelId = `checkbox-list-label-${notif.id}`;
                    return (
                      <ListItem
                        key={notif.id}
                        secondaryAction={
                          notif.isRead === false ? (
                            <IconButton
                              edge="end"
                              aria-label="mark-as-read"
                              onClick={() => readNotif(notif.id)}
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
                          <ListItemText
                            id={labelId}
                            primary={notif.message}
                            secondary={String(notif.created)}
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  })
                : "No notifications"}
            </Box>
          </List>
        </Paper>
      </Popper>
    </>
  );
}
