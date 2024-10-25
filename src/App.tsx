import { Routes, Route } from "react-router-dom";
import { useAuth } from "./components/AuthContext.tsx";

import Landing from "./scenes/landing";
import Home from "./scenes/home";
import MainAppBar from "./scenes/global/MainAppBar.jsx";
import FabChat from "./scenes/global/FabChat.jsx";
import ManagementAppBar from "./scenes/management/global/ManagementAppBar.jsx";
import Login from "./scenes/login";
import Register from "./scenes/register";
import Shop from "./scenes/shop";
import Design from "./scenes/view-design";
import Custom from "./scenes/custom";
import Results from "./scenes/results";
import Cart from "./scenes/cart";
import Profile from "./scenes/profile";
import MyOrders from "./scenes/my-orders/index.js";
import Dashboard from "./scenes/management/dashboard";
import Inventory from "./scenes/management/inventory";
import Orders from "./scenes/management/orders";
import Designs from "./scenes/management/designs";
import Tags from "./scenes/management/tags";
import Users from "./scenes/management/users";
import Sales from "./scenes/management/sales";
import ManualRegister from "./scenes/management/form";
import Calendar from "./scenes/management/calendar";
import Materials from "./scenes/management/pastry_material";
import AddOns from "./scenes/management/addons";
import NotFound from "./scenes/not-found/index.js";
import PostPayment from "./scenes/post-payment/index.js";
import Suborders from "./scenes/management/suborders/index.js";
import ConfirmEmail from "./scenes/confirm-email/index.js";
import Transactions from "./scenes/transactions";
import { Box, CircularProgress } from "@mui/material";
import ForgotPassword from "./scenes/forgot-password/ForgotPassword.tsx";
import Forbidden from "./scenes/forbidden/index.tsx";

function App() {
  const { role, isAuthenticated } = useAuth();

  if (role === undefined) {
    return (
      <Box
        className="app"
        sx={{
          height: "auto",
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            width: "100%",
            height: "100vh",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </Box>
    );
  } else {
    return (
      <Box
        className="app"
        sx={{
          height: "auto",
          minHeight: "100vh",
        }}
      >
        {/* Public Routes */}
        {!isAuthenticated && role === "Guest" && (
          <MainAppBar>
            <FabChat />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/view-design" element={<Design />} />
              <Route path="/custom" element={<Custom />} />
              <Route path="/results" element={<Results />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/confirm-email" element={<ConfirmEmail />} />
              <Route path="/*" element={<NotFound />} />
            </Routes>
          </MainAppBar>
        )}

        {/* Customer Routes */}
        {isAuthenticated && role === "Customer" && (
          <MainAppBar>
            <FabChat />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/view-design" element={<Design />} />
              <Route path="/custom" element={<Custom />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/post-payment" element={<PostPayment />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/transaction-history" element={<Transactions />} />
              <Route path="/*" element={<NotFound />} />
            </Routes>
          </MainAppBar>
        )}

        {/* Artist Routes */}
        {isAuthenticated && role === "Artist" && (
          <ManagementAppBar>
            <Routes>
              <Route path="/" element={<Forbidden />} />
              <Route path="/register" element={<Forbidden />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/users" element={<Forbidden />} />
              <Route path="/orders" element={<Forbidden />} />
              <Route path="/suborders" element={<Suborders />} />
              <Route path="/sales" element={<Forbidden />} />
              <Route path="/designs" element={<Forbidden />} />
              <Route path="/inventory" element={<Forbidden />} />
              <Route path="/pastry-material" element={<Forbidden />} />
              <Route path="/add-ons" element={<Forbidden />} />
              <Route path="/tags" element={<Forbidden />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/*" element={<NotFound />} />
            </Routes>
          </ManagementAppBar>
        )}

        {/* Manager Routes */}
        {isAuthenticated && role === "Manager" && (
          <ManagementAppBar>
            <FabChat />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/register" element={<Forbidden />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/users" element={<Forbidden />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/suborders" element={<Suborders />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/designs" element={<Designs />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/pastry-material" element={<Materials />} />
              <Route path="/add-ons" element={<AddOns />} />
              <Route path="/tags" element={<Tags />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/*" element={<NotFound />} />
            </Routes>
          </ManagementAppBar>
        )}

        {/* Admin Routes */}
        {isAuthenticated && role === "Admin" && (
          <ManagementAppBar>
            <FabChat />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/register" element={<ManualRegister />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/users" element={<Users />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/suborders" element={<Suborders />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/designs" element={<Designs />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/pastry-material" element={<Materials />} />
              <Route path="/add-ons" element={<AddOns />} />
              <Route path="/tags" element={<Tags />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/*" element={<NotFound />} />
            </Routes>
          </ManagementAppBar>
        )}
      </Box>
    );
  }
}

export default App;
