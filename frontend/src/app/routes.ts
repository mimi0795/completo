import { createBrowserRouter } from "react-router";
import LoginPage from "./components/LoginPage";
import AdminDashboard from "./components/AdminDashboard";
import StudentDashboard from "./components/StudentDashboard";

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
    path: "/student",
    Component: StudentDashboard,
  },
]);
