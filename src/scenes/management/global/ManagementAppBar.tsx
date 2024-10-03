import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link, useNavigate } from "react-router-dom";
import { ColorModeContext, Tokens } from "../../../Theme";
import {
  Home as HomeIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  CalendarToday as CalendarTodayIcon,
  HelpOutline as HelpOutlineIcon,
  Inventory2 as Inventory2Icon,
  ShoppingCartCheckout as ShoppingCartCheckoutIcon,
  Label as LabelIcon,
  Cake as CakeIcon,
  AttachMoney as AttachMoneyIcon,
  ShapeLine as ShapeLineIcon,
  LightModeOutlined as LightModeOutlinedIcon,
  DarkModeOutlined as DarkModeOutlinedIcon,
  NotificationsOutlined as NotificationsOutlinedIcon,
  PersonOutlined as PersonOutlinedIcon,
  Extension as ExtensionIcon,
  LocalPizza as LocalPizzaIcon,
  Check as CheckIcon,
  Redeem as RedeemIcon,
} from "@mui/icons-material";
import { Badge, Paper, Popper } from "@mui/material";
import { MouseEvent, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import api from "../../../api/axiosConfig";
import { Notification } from "../../../utils/Schemas";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const toKebabCase = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const iconMapping: any = {
  dashboard: HomeIcon,
  register: PersonIcon,
  calendar: CalendarTodayIcon,
  inventory: Inventory2Icon,
  "add-ons": ExtensionIcon,
  orders: RedeemIcon,
  suborders: LocalPizzaIcon,
  designs: CakeIcon,
  "pastry-material": ShapeLineIcon,
  tags: LabelIcon,
  users: PeopleIcon,
  sales: AttachMoneyIcon,
  "faq-page": HelpOutlineIcon,
  default: HelpOutlineIcon,
};

type SidebarItemProps = {
  text: string;
  open: boolean;
};

const SidebarItem = ({ text, open }: SidebarItemProps) => {
  const IconComponent =
    iconMapping[toKebabCase(text)] || iconMapping["default"];
  return (
    <ListItem disablePadding sx={{ display: "block" }}>
      <ListItemButton
        component={Link}
        to={`/${toKebabCase(text)}`}
        sx={{
          minHeight: 48,
          justifyContent: open ? "initial" : "center",
          px: 2.5,
        }}
      >
        <ListItemIcon
          sx={{ minWidth: 0, mr: open ? 3 : "auto", justifyContent: "center" }}
        >
          <IconComponent />
        </ListItemIcon>
        <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
      </ListItemButton>
    </ListItem>
  );
};
const SidebarItemHome = ({ text, open }: SidebarItemProps) => {
  const IconComponent = iconMapping["dashboard"];
  return (
    <ListItem disablePadding sx={{ display: "block" }}>
      <ListItemButton
        component={Link}
        to={`/`}
        sx={{
          minHeight: 48,
          justifyContent: open ? "initial" : "center",
          px: 2.5,
        }}
      >
        <ListItemIcon
          sx={{ minWidth: 0, mr: open ? 3 : "auto", justifyContent: "center" }}
        >
          <IconComponent />
        </ListItemIcon>
        <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
      </ListItemButton>
    </ListItem>
  );
};

export default function ManagementAppBar({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const handleProfileClick = () => navigate("/profile");

  // Notification Popper
  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);
  const [notifOpen, setNotifOpen] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);

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
      const response = await api.post(
        `current-user/notifications/${id}/mark-as-read`
      );
      fetchNotifs();
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setNotifAnchorEl(event.currentTarget);
    setNotifOpen((prev) => !prev);
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={open} enableColorOnDark>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                color: colors.background,
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h4"
              noWrap
              sx={{ flexGrow: 1, color: colors.background }}
            >
              The Pink Butter Cake Studio Management - CULO
            </Typography>
            <Box>
              <IconButton
                onClick={colorMode.toggleColorMode}
                style={{ backgroundColor: colors.panel }}
              >
                {theme.palette.mode === "dark" ? (
                  <DarkModeOutlinedIcon />
                ) : (
                  <LightModeOutlinedIcon />
                )}
              </IconButton>
              <IconButton
                onClick={handleClick}
                color="inherit"
                style={{ backgroundColor: colors.panel }}
              >
                <Badge badgeContent={notifications.length} color="default">
                  <NotificationsOutlinedIcon />
                </Badge>
              </IconButton>
              <IconButton
                onClick={handleProfileClick}
                style={{ backgroundColor: colors.panel }}
              >
                <PersonOutlinedIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            <SidebarItemHome key={"Dashboard"} text={"Dashboard"} open={open} />
          </List>
          <Divider />
          <List>
            {["Register", "Calendar"].map((text, index) => (
              <SidebarItem key={text} text={text} open={open} />
            ))}
          </List>
          <Divider />
          <List>
            {[
              "Inventory",
              "Add-Ons",
              "Orders",
              "Suborders",
              "Designs",
              "Pastry Material",
              "Tags",
              "Users",
              "Sales",
              "FAQ Page",
            ].map((text, index) => (
              <SidebarItem key={text} text={text} open={open} />
            ))}
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          {children}
        </Box>
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
            <Typography>Notifications</Typography>
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
          </List>
        </Paper>
      </Popper>
    </>
  );
}
