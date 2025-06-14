import { useQuery } from '@tanstack/react-query'
import { COMMON_REFRESH_INTERVAL } from '@/constants'
import { PersistTimeMap } from '@/config/queryClient'
import { fetchWalletBalance } from '../services/mockApi'
import { WalletBalance } from '../types/wallet'

export interface WalletBalanceResponse {
  ok: boolean
  warning: string
  wallet: WalletBalance[]
}
/**
 * React Query hook to fetch wallet balance data.
 * Refetch every COMMON_REFRESH_INTERVAL ms.
 * Returns wallet balance response object.
 */

export const useWalletBalanceQuery = (options = {}) => {
  return useQuery<WalletBalanceResponse>({
    queryKey: ['walletBalance'],
    queryFn: fetchWalletBalance,
    staleTime: PersistTimeMap.disabled,
    refetchInterval: COMMON_REFRESH_INTERVAL,
    ...options,
  })
}
