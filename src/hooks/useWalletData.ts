import { useQuery } from "@tanstack/react-query";
import {
  fetchCurrencies,
  fetchLiveRates,
  fetchWalletBalance,
} from "../utils/mockApi";
import { useWalletStore } from "../store/walletStore";
import { useEffect } from "react";

export const useWalletData = () => {
  const {
    fetchWalletData,
    isLoading,
    error,
    currencies,
    walletBalances,
    exchangeRates,
  } = useWalletStore();

  // 使用react-query获取数据
  const { isLoading: isLoadingCurrencies } = useQuery({
    queryKey: ["currencies"],
    queryFn: fetchCurrencies,
    enabled: false, // 不自动执行，由store统一管理
  });

  const { isLoading: isLoadingBalances } = useQuery({
    queryKey: ["walletBalances"],
    queryFn: fetchWalletBalance,
    enabled: false,
  });

  const { isLoading: isLoadingRates } = useQuery({
    queryKey: ["rates"],
    queryFn: fetchLiveRates,
    enabled: false,
  });

  // 组件挂载时获取数据
  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  const isDataLoading =
    isLoading || isLoadingCurrencies || isLoadingBalances || isLoadingRates;

  return {
    isLoading: isDataLoading,
    error,
    currencies,
    walletBalances,
    exchangeRates,
    refetch: fetchWalletData,
  };
};
