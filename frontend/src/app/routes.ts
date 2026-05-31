import { createHashRouter } from "react-router";
import LoginPage from "./components/LoginPage";
import AdminDashboard from "./components/AdminDashboard";
import StudentDashboard from "./components/StudentDashboard";
import Portaria from "./components/Portaria";
import SolicitarSaida from "./components/SolicitarSaida";

export const router = createHashRouter([
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
  {
    path: "/solicita-saida",
    Component: SolicitarSaida,
  },

  {
  path: "/index.html",
  Component: SolicitarSaida,
}, 
]);
