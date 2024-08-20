// /src/App.tsx

import { Routes, Route } from "react-router-dom";
import "@mantine/core/styles.css";

// Components
import { lazy, Suspense } from "react";
import UserProvider from "./components/UserProvider.tsx";
import CuloAppShell from "./components/CuloAppShell.tsx";
import AuthGuard from "./components/AuthGuard.tsx";
import FullscreenThrobber from "./components/FullscreenThrobber.tsx";

// Public Pages
const Landing = lazy(() => import("./scenes/landing"));
const Shop = lazy(() => import("./scenes/shop"));
const Design = lazy(() => import("./scenes/design"));
const About = lazy(() => import("./scenes/about"));
const Custom = lazy(() => import("./scenes/custom"));
const Results = lazy(() => import("./scenes/results"));
const Forbidden = lazy(() => import("./scenes/forbidden"));
const NotFound = lazy(() => import("./scenes/not-found"));

// Customer Pages
const Home = lazy(() => import("./scenes/home"));
const Cart = lazy(() => import("./scenes/cart"));
const Purchases = lazy(() => import("./scenes/purchases"));
const Profile = lazy(() => import("./scenes/profile"));

// Management Pages
const Dashboard = lazy(() => import("./scenes/management/dashboard"));
const Register = lazy(() => import("./scenes/management/register"));
const Calendar = lazy(() => import("./scenes/management/calendar"));
const Users = lazy(() => import("./scenes/management/users"));
const Orders = lazy(() => import("./scenes/management/orders"));
const Sales = lazy(() => import("./scenes/management/sales"));
const Designs = lazy(() => import("./scenes/management/designs"));
const Inventory = lazy(() => import("./scenes/management/inventory"));
const Materials = lazy(() => import("./scenes/management/materials"));
const AddOns = lazy(() => import("./scenes/management/add-ons"));
const Tags = lazy(() => import("./scenes/management/tags"));
const Logs = lazy(() => import("./scenes/management/logs"));
const Settings = lazy(() => import("./scenes/management/settings"));

function App() {
  return (
    <div
      className="app"
      style={{
        height: "auto",
        minHeight: "100vh",
      }}
    >
      <UserProvider>
        <CuloAppShell>
          {/* Public */}
          <Suspense fallback={<FullscreenThrobber />}>
            <AuthGuard role={"Guest"}>
              <Routes>
                <Route path="/" element={<Landing />}></Route>
                <Route path="/shop" element={<Shop />}></Route>
                <Route path="/view-design" element={<Design />}></Route>
                <Route path="/custom" element={<Custom />}></Route>
                <Route path="/results" element={<Results />}></Route>
                <Route path="/about" element={<About />}></Route>
                <Route path="/forbidden" element={<Forbidden />}></Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthGuard>

            <AuthGuard role={"Customer"}>
              {/* Customer */}
              <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/shop" element={<Shop />}></Route>
                <Route path="/view-design" element={<Design />}></Route>
                <Route path="/custom" element={<Custom />}></Route>
                <Route path="/cart" element={<Cart />}></Route>
                <Route path="/purchases" element={<Purchases />}></Route>
                <Route path="/profile" element={<Profile />}></Route>
              </Routes>
            </AuthGuard>

            <AuthGuard role={"Artist"}>
              {/* Artist */}
              <Routes>
                <Route path="/" element={<Dashboard />}></Route>
                <Route path="/calendar" element={<Calendar />}></Route>
                <Route path="/orders" element={<Orders />}></Route>
                <Route path="/designs" element={<Designs />}></Route>
                <Route path="/inventory" element={<Inventory />}></Route>
                <Route path="/profile" element={<Profile />}></Route>
              </Routes>
            </AuthGuard>

            <AuthGuard role={"Manager"}>
              {/* Manager */}
              <Routes>
                <Route path="/" element={<Dashboard />}></Route>
                <Route path="/register" element={<Register />}></Route>
                <Route path="/calendar" element={<Calendar />}></Route>
                <Route path="/orders" element={<Orders />}></Route>
                <Route path="/sales" element={<Sales />}></Route>
                <Route path="/designs" element={<Designs />}></Route>
                <Route path="/inventory" element={<Inventory />}></Route>
                <Route path="/materials" element={<Materials />}></Route>
                <Route path="/add-ons" element={<AddOns />}></Route>
                <Route path="/tags" element={<Tags />}></Route>
                <Route path="/profile" element={<Profile />}></Route>
              </Routes>
            </AuthGuard>

            <AuthGuard role={"Manager"}>
              {/* Admin */}
              <Routes>
                <Route path="/" element={<Dashboard />}></Route>
                <Route path="/register" element={<Register />}></Route>
                <Route path="/calendar" element={<Calendar />}></Route>
                <Route path="/users" element={<Users />}></Route>
                <Route path="/orders" element={<Orders />}></Route>
                <Route path="/sales" element={<Sales />}></Route>
                <Route path="/designs" element={<Designs />}></Route>
                <Route path="/inventory" element={<Inventory />}></Route>
                <Route path="/materials" element={<Materials />}></Route>
                <Route path="/add-ons" element={<AddOns />}></Route>
                <Route path="/tags" element={<Tags />}></Route>
                <Route path="/logs" element={<Logs />}></Route>
                <Route path="/profile" element={<Profile />}></Route>
                <Route path="/settings" element={<Settings />}></Route>
              </Routes>
            </AuthGuard>
          </Suspense>
        </CuloAppShell>
      </UserProvider>
    </div>
  );
}

export default App;
