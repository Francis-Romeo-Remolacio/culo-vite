// /src/components/PageLoader.tsx

import { lazy, Suspense, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { UserContext } from "./UserProvider";
import { Center, Loader } from "@mantine/core";

interface RouteType {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
}

interface RouteConfig {
  Guest: RouteType[];
  Customer: RouteType[];
  Artist: RouteType[];
  Manager: RouteType[];
  Admin: RouteType[];
}

const routeConfig: RouteConfig = {
  Guest: [
    { path: "/", component: lazy(() => import("../scenes/landing")) },
    { path: "/gallery", component: lazy(() => import("../scenes/shop")) },
    { path: "/view-design", component: lazy(() => import("../scenes/design")) },
    { path: "/custom", component: lazy(() => import("../scenes/custom")) },
    { path: "/results", component: lazy(() => import("../scenes/results")) },
    { path: "/about", component: lazy(() => import("../scenes/about")) },
    {
      path: "/forbidden",
      component: lazy(() => import("../scenes/forbidden")),
    },
    { path: "*", component: lazy(() => import("../scenes/not-found")) },
  ],
  Customer: [
    { path: "/", component: lazy(() => import("../scenes/home")) },
    { path: "/cart", component: lazy(() => import("../scenes/cart")) },
    {
      path: "/purchases",
      component: lazy(() => import("../scenes/purchases")),
    },
    { path: "/profile", component: lazy(() => import("../scenes/profile")) },
  ],
  Artist: [
    {
      path: "/",
      component: lazy(() => import("../scenes/management/dashboard")),
    },
    {
      path: "/calendar",
      component: lazy(() => import("../scenes/management/calendar")),
    },
    {
      path: "/orders",
      component: lazy(() => import("../scenes/management/orders")),
    },
    {
      path: "/designs",
      component: lazy(() => import("../scenes/management/designs")),
    },
    {
      path: "/inventory",
      component: lazy(() => import("../scenes/management/inventory")),
    },
  ],
  Manager: [
    {
      path: "/",
      component: lazy(() => import("../scenes/management/dashboard")),
    },
    {
      path: "/register",
      component: lazy(() => import("../scenes/management/register")),
    },
    {
      path: "/calendar",
      component: lazy(() => import("../scenes/management/calendar")),
    },
    {
      path: "/orders",
      component: lazy(() => import("../scenes/management/orders")),
    },
    {
      path: "/sales",
      component: lazy(() => import("../scenes/management/sales")),
    },
    {
      path: "/designs",
      component: lazy(() => import("../scenes/management/designs")),
    },
    {
      path: "/inventory",
      component: lazy(() => import("../scenes/management/inventory")),
    },
    {
      path: "/materials",
      component: lazy(() => import("../scenes/management/materials")),
    },
    {
      path: "/add-ons",
      component: lazy(() => import("../scenes/management/add-ons")),
    },
    {
      path: "/tags",
      component: lazy(() => import("../scenes/management/tags")),
    },
  ],
  Admin: [
    {
      path: "/",
      component: lazy(() => import("../scenes/management/dashboard")),
    },
    {
      path: "/register",
      component: lazy(() => import("../scenes/management/register")),
    },
    {
      path: "/calendar",
      component: lazy(() => import("../scenes/management/calendar")),
    },
    {
      path: "/users",
      component: lazy(() => import("../scenes/management/users")),
    },
    {
      path: "/orders",
      component: lazy(() => import("../scenes/management/orders")),
    },
    {
      path: "/sales",
      component: lazy(() => import("../scenes/management/sales")),
    },
    {
      path: "/designs",
      component: lazy(() => import("../scenes/management/designs")),
    },
    {
      path: "/inventory",
      component: lazy(() => import("../scenes/management/inventory")),
    },
    {
      path: "/materials",
      component: lazy(() => import("../scenes/management/materials")),
    },
    {
      path: "/add-ons",
      component: lazy(() => import("../scenes/management/add-ons")),
    },
    {
      path: "/tags",
      component: lazy(() => import("../scenes/management/tags")),
    },
  ],
};

const PageLoader = () => {
  const currentUser = useContext(UserContext);
  const currentRole = currentUser?.roles?.[0] || "Guest";
  const routes =
    routeConfig[currentRole as keyof RouteConfig] || routeConfig.Guest;

  return (
    <Suspense
      fallback={
        <Center h="100vh">
          <Loader size={64} />
        </Center>
      }
    >
      <Routes>
        {routes.map(({ path, component: Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      </Routes>
    </Suspense>
  );
};

export default PageLoader;
