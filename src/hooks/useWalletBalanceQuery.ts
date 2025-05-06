import { useQuery } from "@tanstack/react-query";
import { fetchWalletBalance } from "../utils/mockApi";
import { WalletBalance } from "../types/wallet";

export interface WalletBalanceResponse {
  ok: boolean;
  warning: string;
  wallet: WalletBalance[];
}

export const useWalletBalanceQuery = (options = {}) => {
  return useQuery<WalletBalanceResponse>({
    queryKey: ["walletBalance"],
    queryFn: fetchWalletBalance,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};
