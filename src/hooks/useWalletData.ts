import { useQuery } from "@tanstack/react-query";
import { fetchCurrencies, fetchLiveRates } from "../utils/mockApi";
import { useCurrencyStore } from "../store/atom/currency";
import { useWalletBalanceQuery } from "./useWalletBalanceQuery";
import { useEffect } from "react";

export const useWalletData = () => {
  // 使用currency store的状态和方法
  const {
    currencies,
    rates,
    isLoading: isCurrencyLoading,
    error: currencyError,
    fetchCurrencies: fetchCurrencyInfo,
    fetchLiveRates: fetchRates,
  } = useCurrencyStore();

  // 使用react-query获取钱包余额数据
  const {
    data: walletData,
    isLoading: isBalanceLoading,
    error: balanceError,
    refetch: refetchBalance,
  } = useWalletBalanceQuery();

  // 使用react-query获取货币数据（预配置但不自动执行）
  const { isLoading: isLoadingCurrencies } = useQuery({
    queryKey: ["currencies"],
    queryFn: fetchCurrencies,
    enabled: false, // 不自动执行，由store统一管理
  });

  const { isLoading: isLoadingRates } = useQuery({
    queryKey: ["rates"],
    queryFn: fetchLiveRates,
    enabled: false,
  });

  // 组件挂载时获取数据
  useEffect(() => {
    fetchCurrencyInfo();
    fetchRates();
  }, [fetchCurrencyInfo, fetchRates]);

  // 统一错误信息
  const error = currencyError || balanceError?.message || null;

  // 整合加载状态
  const isDataLoading =
    isCurrencyLoading ||
    isBalanceLoading ||
    isLoadingCurrencies ||
    isLoadingRates;

  return {
    isLoading: isDataLoading,
    error,
    currencies,
    walletBalances: walletData?.wallet || [],
    rates,
    refetch: () => {
      fetchCurrencyInfo();
      fetchRates();
      refetchBalance();
    },
  };
};
