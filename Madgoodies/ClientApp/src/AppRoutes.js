import Home from "./components/Home";
 
import PosSystem from "./components/PosSystem";
import PosLogin from "./components/PosLogin";

const AppRoutes = [
  {
    index: true,
    
    element: <Home />
  },
  {
    path: "/dashboard",
    element: <PosSystem />
  },
  {
    path: "/possystem",
    element: <PosSystem />
  },
  {
    path: "/poslogin",
    element: <PosLogin />
  }
];

export default AppRoutes;
