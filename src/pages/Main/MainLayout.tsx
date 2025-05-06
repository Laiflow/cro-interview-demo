import React from "react";
import { Outlet } from "react-router-dom";
import FooterTabs from "./FooterTabs";
import { useCryptoSocket } from "./useCryptoSocket";

const MainLayout: React.FC = () => {
  useCryptoSocket();

  return (
    <div className="min-h-screen flex flex-1 flex-col bg-gray-900">
      {/* Logo和头部 */}
      <div className="p-4 bg-gray-900 text-white">
        <div className="flex items-center">
          <div className="flex items-center">
            <img
              src="https://crypto.com/static/31b8515a96850f98c54d84cd6f31070b/7f71e/crypto-logo.png"
              alt="Crypto.com"
              className="h-8 mr-2"
            />
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

export default MainLayout;
