import React from "react";
import { useCurrencyStore } from "../../store/atom/currency";
import { useWalletBalanceQuery } from "../../hooks/useWalletBalanceQuery";
import TokenList from "./components/TokenList";

const WalletDashboard: React.FC = () => {
  // 使用React Query获取钱包余额
  const {
    data: walletData,
    isLoading,
    error,
    refetch,
  } = useWalletBalanceQuery();
  // 从currency store获取汇率信息
  const store = useCurrencyStore();
  const { getRate } = store;

  // 获取所有钱包余额
  const walletBalances = walletData?.wallet || [];

  // 计算某个货币的USD价值
  const getUsdBalance = (currency: string) => {
    const balance = walletBalances.find((b) => b.currency === currency);
    if (!balance) return 0;

    const rate = getRate(currency);
    return balance.amount * rate;
  };

  // 计算总USD价值
  const getTotalUsdBalance = () => {
    return walletBalances.reduce((total, balance) => {
      return total + getUsdBalance(balance.currency);
    }, 0);
  };

  const totalBalance = getTotalUsdBalance();

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
        <p className="text-red-500 mb-4">Error: {(error as Error).message}</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 text-white">
      {/* 顶部余额部分 */}
      <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <div className="text-xl text-gray-400 mb-1">$</div>
        <div className="text-4xl font-bold">{totalBalance.toFixed(2)} USD</div>

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

      {/* 币种列表 */}
      <div className="flex-1 bg-white rounded-2xl overflow-hidden">
        <TokenList tokens={walletBalances} />
      </div>
    </div>
  );
};

export default WalletDashboard;
