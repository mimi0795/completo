import { createBrowserRouter } from "react-router";
import LoginPage from "./components/LoginPage";
import AdminDashboard from "./components/AdminDashboard";
import StudentDashboard from "./components/StudentDashboard";
import Portaria from "./components/Portaria";
import SolicitarSaida from "./components/SolicitarSaida";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
  {
    path: "/entrada",
    Component: StudentDashboard,
  },
  {
    path: "/portaria",
    Component: Portaria,
  },
  {
    path: "/solicitar-saida",
    Component: SolicitarSaida,
  },
]);
