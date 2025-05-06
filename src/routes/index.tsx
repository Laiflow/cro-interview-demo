import React from "react";
import { RouteObject } from "react-router-dom";
import { MainLayout } from "../pages/Main";
import NotFound from "../pages/NotFound";
import WalletPage from "../pages/Wallet";
import DeFiPage from "../pages/DeFi";

// 路由配置
export const routesConfig: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <WalletPage />,
      },
      {
        path: "wallet",
        element: <WalletPage />,
      },
      {
        path: "defi",
        element: <DeFiPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
