import { useCallback } from 'react'
import { useCreation } from 'ahooks'
import { multiply, plus, toFixed } from '@/utils/operation'
import { useCurrencyStore } from '@/stores/atom/currency'
import { useWalletBalanceQuery } from '../../../hooks/useWalletBalanceQuery'

export const useWalletBalance = () => {
  const { data: walletData, isLoading, error, refetch } = useWalletBalanceQuery()

  const rates = useCurrencyStore((state) => state.rates)
  const walletBalances = walletData?.wallet || []

  // 计算某个货币的USD价值
  const getUsdBalance = useCallback(
    (currency: string) => {
      const balance = walletBalances.find((b) => b.currency === currency)
      if (!balance) return 0

      const rate = rates[currency]?.rate
      return multiply(balance.amount)(rate)
    },
    [walletBalances, rates]
  )

  const totalBalance = useCreation(() => {
    const total = walletBalances.reduce((total, balance) => {
      return plus(total)(getUsdBalance(balance.currency))
    }, 0)
    return toFixed(total)(2)
  }, [walletBalances, getUsdBalance])

  return {
    totalBalance,
    walletBalances,
    isLoading,
    error,
    refetch,
  }
}
