import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { LoginPage } from "./pages/LoginPage";
import { MenuPage } from "./pages/MenuPage";
import { CreateOrderPage } from "./pages/CreateOrderPage";
import { OrdersListPage } from "./pages/OrderListPage";
import { MenuManagementPage } from "./pages/MenuManagementPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/create-order" element={<CreateOrderPage />} />
        <Route path="/order-list" element={<OrdersListPage />} />
        <Route path="/menu-management" element={<MenuManagementPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
