import {
  AppShell,
  Burger,
  Group,
  Skeleton,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./CuloAppShell.module.css";
import { ReactNode, useContext, useState } from "react";
import { Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { IconHelpCircleFilled } from "@tabler/icons-react";
import { UserContext } from "./UserProvider";

interface CuloAppShellProps {
  children: ReactNode;
}

interface NavItem {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
}

const headerLinkData: { [key: string]: string[] } = {
  Guest: ["Home", "Shop", "Custom Order", "Contacts"],
  Customer: ["Home", "Shop", "Cart", "Orders", "Profile"],
  Artist: [],
  Manager: [],
  Admin: [],
};

const navbarLinkData: {
  [key: string]: NavItem[];
} = {
  Guest: [
    { icon: IconHelpCircleFilled, label: "Home", path: "/" },
    { icon: IconHelpCircleFilled, label: "Shop", path: "/shop" },
    { icon: IconHelpCircleFilled, label: "Custom Order", path: "/custom" },
    { icon: IconHelpCircleFilled, label: "Contacts", path: "/contacts" },
    { icon: IconHelpCircleFilled, label: "Login", path: "/login" },
    { icon: IconHelpCircleFilled, label: "Register", path: "/register" },
  ],
  Customer: [
    { icon: IconHelpCircleFilled, label: "Home", path: "/" },
    { icon: IconHelpCircleFilled, label: "Shop", path: "/shop" },
    { icon: IconHelpCircleFilled, label: "Cart", path: "/cart" },
    { icon: IconHelpCircleFilled, label: "Purchases", path: "/Purchases" },
    { icon: IconHelpCircleFilled, label: "Custom Order", path: "/custom" },
    { icon: IconHelpCircleFilled, label: "Profile", path: "/profile" },
    { icon: IconHelpCircleFilled, label: "Contacts", path: "/contacts" },
  ],
  Artist: [
    { icon: IconHelpCircleFilled, label: "Dashboard", path: "/" },
    { icon: IconHelpCircleFilled, label: "Calendar", path: "/calendar" },
    { icon: IconHelpCircleFilled, label: "Orders", path: "/orders" },
    { icon: IconHelpCircleFilled, label: "Designs", path: "/designs" },
    { icon: IconHelpCircleFilled, label: "Inventory", path: "/inventory" },
    { icon: IconHelpCircleFilled, label: "Add-Ons", path: "/add-ons" },
    { icon: IconHelpCircleFilled, label: "Tags", path: "/tags" },
  ],
  Manager: [
    { icon: IconHelpCircleFilled, label: "Dashboard", path: "/" },
    { icon: IconHelpCircleFilled, label: "Profile Form", path: "/register" },
    { icon: IconHelpCircleFilled, label: "Calendar", path: "/calendar" },
    { icon: IconHelpCircleFilled, label: "Orders", path: "/orders" },
    { icon: IconHelpCircleFilled, label: "Designs", path: "/designs" },
    { icon: IconHelpCircleFilled, label: "Inventory", path: "/inventory" },
    { icon: IconHelpCircleFilled, label: "Add-Ons", path: "/add-ons" },
    { icon: IconHelpCircleFilled, label: "Tags", path: "/tags" },
    { icon: IconHelpCircleFilled, label: "Profile", path: "/profile" },
  ],
  Admin: [
    { icon: IconHelpCircleFilled, label: "Dashboard", path: "/" },
    { icon: IconHelpCircleFilled, label: "Profile Form", path: "/register" },
    { icon: IconHelpCircleFilled, label: "Calendar", path: "/calendar" },
    { icon: IconHelpCircleFilled, label: "Users", path: "/users" },
    { icon: IconHelpCircleFilled, label: "Orders", path: "/orders" },
    { icon: IconHelpCircleFilled, label: "Designs", path: "/designs" },
    { icon: IconHelpCircleFilled, label: "Inventory", path: "/inventory" },
    { icon: IconHelpCircleFilled, label: "Add-Ons", path: "/add-ons" },
    { icon: IconHelpCircleFilled, label: "Tags", path: "/tags" },
    { icon: IconHelpCircleFilled, label: "System Logs", path: "/logs" },
    { icon: IconHelpCircleFilled, label: "Profile", path: "/profile" },
  ],
};

export default function CuloAppShell({ children }: CuloAppShellProps) {
  const [opened, { toggle }] = useDisclosure();
  const currentUser = useContext(UserContext);
  const role =
    currentUser?.roles && currentUser.roles[0] ? currentUser.roles[0] : "Guest";

  const renderHeaderLinks = (links: string[]) => {
    return links.map((link) => (
      <UnstyledButton key={link} className={classes.control}>
        {link}
      </UnstyledButton>
    ));
  };

  const renderNavbarLinks = (links: NavItem[]) => {
    const [active, setActive] = useState(0);

    return links.map((link, index) => (
      <NavLink
        key={link.label}
        to={link.path}
        // active={index === active} // Ensure NavLink supports 'active' prop
        onClick={() => setActive(index)}
      >
        {link.label}
      </NavLink>
    ));
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="md" />
          <Group justify="space-between" style={{ flex: 1 }}>
            <Group gap={8}>
              <Skeleton circle height={32} />
              <Typography>The Pink Butter Studio</Typography>
            </Group>
            <Group ml="xl" gap={0} visibleFrom="sm">
              {renderHeaderLinks(
                headerLinkData[role] || headerLinkData["Guest"]
              )}
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        {renderNavbarLinks(navbarLinkData[role] || navbarLinkData["Guest"])}
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
