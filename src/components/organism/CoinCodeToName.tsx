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
  // 使用 useShallow 优化性能，只有当特定币种信息变化时才重渲染
  const currencyInfo = useCurrencyStore(useShallow((state) => state.getCurrency(coin)))

  return <>{currencyInfo?.name || coin}</>
}

// 使用 memo 避免不必要的重渲染
export default memo(CoinCodeToName)
