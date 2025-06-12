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

export const useWalletBalanceQuery = (options = {}) => {
  return useQuery<WalletBalanceResponse>({
    queryKey: ['walletBalance'],
    queryFn: fetchWalletBalance,
    staleTime: PersistTimeMap.disabled,
    refetchInterval: COMMON_REFRESH_INTERVAL,
    ...options,
  })
}
