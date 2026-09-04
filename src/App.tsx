import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { AppLayout } from "./components/AppLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { CreateOrderPage } from "./pages/CreateOrderPage";
import { LoginPage } from "./pages/LoginPage";
import { MenuManagementPage } from "./pages/MenuManagementPage";
import { MenuPage } from "./pages/MenuPage";
import { OrdersListPage } from "./pages/OrderListPage";
import { ScrollToTopButton } from "./components/ScrollToTopButton";

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          {/* Rotte pubbliche per i clienti (USER) */}
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Rotte protette per i gestori(ADMIN)*/}
          <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
            <Route path="/create-order" element={<CreateOrderPage />} />
            <Route path="/order-list" element={<OrdersListPage />} />
            <Route path="/menu-management" element={<MenuManagementPage />} />
          </Route>

          {/* Redirect predefinito al menù per gli utenti generici */}
          <Route path="*" element={<Navigate to="/menu" replace />} />
        </Routes>
        <ScrollToTopButton />
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
