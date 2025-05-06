import React from "react";
import { useRoutes } from "react-router-dom";
import { routesConfig } from "./routes/index";

const AppRoutes: React.FC = () => {
  const routes = useRoutes(routesConfig);
  return routes;
};

export default <AppRoutes />;
