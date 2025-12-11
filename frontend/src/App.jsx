import "./index.css";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResetPassword from "./pages/ResetPassword";
import ForgetPassword from "./pages/ForgetPassord";
import Contact from "./pages/Contact";
import Team from "./pages/Team";
import MenuDetailPage from "./pages/MenuDetailPage";
import CommandPage from "./pages/CommandPage";
import DashboardPage from "./pages/DashboardPage";
import EmployeeHomePage from "./pages/employer/EmployeeHomePage";
import EmployeCommandesPage from "./pages/employer/EmployeCommandesPage";
import EmployeAvisPage from "./pages/employer/EmployeAvisPage";
import EmployeMenusPage from "./pages/employer/EmployeMenusPage";
import EmployePlatsPage from "./pages/employer/EmployePlatsPage";
import EmployeHorairesPage from "./pages/employer/EmployeHorairesPage"; 

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/team" element={<Team />} />
        <Route path="/menu/:id" element={<MenuDetailPage />} />
        <Route path="/commande/:menu_id?" element={<CommandPage />} />

        {/* Routes protégées pour les clients */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Routes protégées pour les employés (role_id === 3) */}
        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute requiredRoleId={3}>
              <EmployeeHomePage />
            </ProtectedRoute>
          }
        />
        {/* Note: Vous pouvez ajouter d'autres routes employé ici */}
        {/* Exemple :
        <Route
          path="/employee/commandes"
          element={
            <ProtectedRoute requiredRoleId={3}>
              <EmployeeCommandesPage />
            </ProtectedRoute>
          }
        />
        */}
        <Route
          path="/employee/commandes"
          element={
            <ProtectedRoute requiredRoleId={3}>
              <EmployeCommandesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/avis"
          element={
            <ProtectedRoute requiredRoleId={3}>
              <EmployeAvisPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/menus"
          element={
            <ProtectedRoute requiredRoleId={3}>
              <EmployeMenusPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/plats"
          element={
            <ProtectedRoute requiredRoleId={3}>
              <EmployePlatsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/horaires"
          element={
            <ProtectedRoute requiredRoleId={3}>
              <EmployeHorairesPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      
    </AuthProvider>
  );
}

export default App;
