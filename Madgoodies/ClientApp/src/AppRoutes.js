import { Home } from "./components/Home";
import { Dashboard } from "./components/Dashboard";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  }
];

export default AppRoutes;
