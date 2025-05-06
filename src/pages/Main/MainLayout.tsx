import React, { memo } from "react";
import { Outlet } from "react-router-dom";
import FooterTabs from "./FooterTabs";
import { useCryptoSocket } from "./useCryptoSocket";
import logo from "/logo.png";

const MainLayout: React.FC = () => {
  useCryptoSocket();

  return (
    <div className="min-h-screen flex flex-1 flex-col bg-gray-900">
      {/* Logo和头部 */}
      <div className="p-4 bg-gray-900 text-white">
        <div className="flex items-center">
          <div className="flex items-center">
            <img src={logo} alt="Crypto.com" className="h-8 mr-2" />
            <span className="text-xl font-bold">DEFI WALLET</span>
          </div>
        </div>
      </div>

      <Outlet />

      {/* 底部导航 */}
      <FooterTabs />
    </div>
  );
};

export default memo(MainLayout);
