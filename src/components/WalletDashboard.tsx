import React from "react";
import { useWalletStore } from "../store/walletStore";
import TokenList from "./TokenList";

const WalletDashboard: React.FC = () => {
  const {
    isLoading,
    error,
    getTotalUsdBalance,
    fetchWalletData,
    getSupportedWalletBalances,
  } = useWalletStore();

  // 组件挂载时获取数据
  React.useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  const totalBalance = getTotalUsdBalance();
  const supportedBalances = getSupportedWalletBalances();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10 text-white">
        <p>Loading wallet data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-white">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <button
          onClick={() => fetchWalletData()}
          className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col text-white">
      {/* 顶部余额部分 */}
      <div className="bg-gray-800 p-4 rounded-lg mx-4 mb-4">
        <div className="text-xl text-gray-400 mb-1">$</div>
        <div className="text-4xl font-bold">{totalBalance.toFixed(2)} USD</div>
      </div>

      {/* 币种列表 */}
      <div className="bg-white rounded-lg mx-4 overflow-hidden">
        <TokenList tokens={supportedBalances} />
      </div>

      {/* 发送和接收按钮 */}
      <div className="flex justify-center space-x-16 mt-6 px-4">
        <div className="flex flex-col items-center">
          <button className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </button>
          <span className="mt-2 text-white">Send</span>
        </div>
        <div className="flex flex-col items-center">
          <button className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
          </button>
          <span className="mt-2 text-white">Receive</span>
        </div>
      </div>
    </div>
  );
};

export default WalletDashboard;
