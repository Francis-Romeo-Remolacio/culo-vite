import { Routes, Route } from "react-router-dom";
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
// import About from "./scenes/about/index";
import Results from "./scenes/results";
import Cart from "./scenes/cart";
//import MyOrders from "./scenes/my-orders";
// import Purchases from "./scenes/purchases";
// import Forbidden from "./scenes/forbidden";
// import NotFound from "./scenes/not-found";
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
import Profile from "./scenes/management/profile";
// import Logs from "./scenes/management/logs";
// import Settings from "./scenes/management/settings";
import AddOns from "./scenes/management/addons";
import AuthGuard from "./components/AuthGuard";
import NotFound from "./scenes/not-found/index.js";
import PostPayment from "./scenes/post-payment/index.js";
import Suborders from "./scenes/management/suborders/index.js";

function App() {
  return (
    <div
      className="app"
      style={{
        /*backgroundColor: colors.grey[100],*/ height: "auto",
        minHeight: "100vh",
      }}
    >
      <AuthGuard role={"Guest"}>
        {/* Public */}
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
            <Route path="/not-found" element={<NotFound />} />
            {
              //<Route path="/about" element={<About />} />
              //<Route path="/forbidden" element={<Forbidden />} />
              //<Route path="*" element={<NotFound />} />
            }
          </Routes>
        </MainAppBar>
      </AuthGuard>

      <AuthGuard role={"Customer"}>
        {/* Customer */}
        <MainAppBar>
          {/* <FabChat /> */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/view-design" element={<Design />} />
            <Route path="/custom" element={<Custom />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/post-payment" element={<PostPayment />} />
            {/* <Route path="/post-payment" element={<MyOrders />} /> */}
            <Route path="/results" element={<Results />} />
            {
              //<Route path="/purchases" element={<Purchases />} />
            }
            <Route path="/profile" element={<Profile />} />
            <Route path="/not-found" element={<NotFound />} />
          </Routes>
        </MainAppBar>
      </AuthGuard>

      <AuthGuard role={"Artist"}>
        {/* Artist */}
        <ManagementAppBar>
          <FabChat />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/suborders" element={<Suborders />} />
            <Route path="/designs" element={<Designs />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/not-found" element={<NotFound />} />
          </Routes>
        </ManagementAppBar>
      </AuthGuard>

      <AuthGuard role={"Manager"}>
        {/* Manager */}
        <ManagementAppBar>
          <FabChat />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/register" element={<ManualRegister />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/suborders" element={<Suborders />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/designs" element={<Designs />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/pastry-material" element={<Materials />} />
            <Route path="/add-ons" element={<AddOns />} />
            <Route path="/tags" element={<Tags />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/not-found" element={<NotFound />} />
          </Routes>
        </ManagementAppBar>
      </AuthGuard>

      <AuthGuard role={"Admin"}>
        {/* Admin */}
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
            <Route path="/not-found" element={<NotFound />} />
            {
              //<Route path="/logs" element={<Logs />} />
              //<Route path="/settings" element={<Settings />} />
              //<Route path="*" element={<NotFound />} />
            }
          </Routes>
        </ManagementAppBar>
      </AuthGuard>
    </div>
  );
}

export default App;
