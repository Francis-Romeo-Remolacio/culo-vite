import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link, useNavigate } from 'react-router-dom';
import { ColorModeContext, Tokens } from '../../../Theme';
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
  SettingsOutlined as SettingsOutlinedIcon,
  PersonOutlined as PersonOutlinedIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== 'open' })<AppBarProps>(
  ({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  })
);

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const toKebabCase = (str: string) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const iconMapping = {
  dashboard: HomeIcon,
  register: PersonIcon,
  calendar: CalendarTodayIcon,
  inventory: Inventory2Icon,
  'add-ons': LabelIcon,
  orders: ShoppingCartCheckoutIcon,
  designs: CakeIcon,
  'pastry-material': ShapeLineIcon,
  tags: LabelIcon,
  users: PeopleIcon,
  sales: AttachMoneyIcon,
  notification: LabelIcon,
  'faq-page': HelpOutlineIcon,
  default: HelpOutlineIcon,
};

type SidebarItemProps = {
   text: string; open: boolean 
}

const SidebarItem = ({ text, open }:SidebarItemProps ) => {
  const IconComponent = iconMapping[toKebabCase(text)] || iconMapping['default'];
  return (
    <ListItem disablePadding sx={{ display: 'block' }}>
      <ListItemButton component={Link} to={`/${toKebabCase(text)}`} sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5 }}>
        <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
          <IconComponent />
        </ListItemIcon>
        <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
      </ListItemButton>
    </ListItem>
  );
};
const SidebarItemHome = ({ text, open }:SidebarItemProps ) => {
  const IconComponent = iconMapping["dashboard"];
  return (
    <ListItem disablePadding sx={{ display: 'block' }}>
      <ListItemButton component={Link} to={`/`} sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5 }}>
        <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
          <IconComponent />
        </ListItemIcon>
        <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
      </ListItemButton>
    </ListItem>
  );
};

export default function ManagementAppBar({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const colors = Tokens(theme.palette.mode);
  const colorMode = React.useContext(ColorModeContext);
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const handleProfileClick = () => navigate('/profile');

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} enableColorOnDark>
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} edge="start" sx={{ color: colors.background, marginRight: 5, ...(open && { display: 'none' }) }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h4" noWrap sx={{ flexGrow: 1, color: colors.background }}>
            The Pink Butter Cake Studio Management - CULO
          </Typography>
          <Box>
            <IconButton onClick={colorMode.toggleColorMode} style={{ backgroundColor: colors.panel }}>
              {theme.palette.mode === 'dark' ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
            </IconButton>
            <IconButton style={{ backgroundColor: colors.panel }}>
              <NotificationsOutlinedIcon />
            </IconButton>
            <IconButton style={{ backgroundColor: colors.panel }}>
              <SettingsOutlinedIcon />
            </IconButton>
            <IconButton onClick={handleProfileClick} style={{ backgroundColor: colors.panel }}>
              <PersonOutlinedIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>{theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}</IconButton>
        </DrawerHeader>
        <Divider /><List>
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
            "Designs",
            "Pastry Material",
            "Tags",
            "Users",
            "Sales",
            "Notification",
            "FAQ Page",
          ].map((text, index) => (
            <SidebarItem key={text} text={text} open={open} />
          ))}
        </List>
        <Divider />
        <List>
          {["Users", "FAQ Page"].map((text, index) => (
            <SidebarItem key={text} text={text} open={open} />
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
