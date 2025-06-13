import { useCurrencyStore } from '@/stores/atom/currency'
import React, { memo } from 'react'
import { useShallow } from 'zustand/shallow'

/**
 * CoinCodeToName component displays the name of a currency based on its code
 * @param {Object} props - Component props
 * @param {string} props.coin - Currency code (e.g. 'BTC', 'ETH')
 * @returns {JSX.Element} Currency name or code if not found
 */
const CoinCodeToName = ({ coin }: { coin: string }) => {
  // Use useShallow to optimize performance, only re-render when specific currency info changes
  const currencyInfo = useCurrencyStore(useShallow((state) => state.getCurrency(coin)))

  return <>{currencyInfo?.name || coin}</>
}

// 使用 memo 避免不必要的重渲染
export default memo(CoinCodeToName)
