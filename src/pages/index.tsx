import { Route, Routes, useLocation } from "react-router-dom";
import { Home } from "./home";
import { Landing } from "./Landing/Landing";
import CreateReport from "@/components/ReportComponents/CreateReport";
import List from "@/components/ListReport./List";
const routes = [
  { path: "/", Page: Landing },
  { path: "/home", Page: Home },

  
  { path: "/report", Page: CreateReport },
  { path: '/show', Page:  List},
];

function Routing() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      {routes.map(({ path, Page }) => (
        <Route key={path} path={path} element={<Page />} />
      ))}
    </Routes>
  );
}

export { Routing };
