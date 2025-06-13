import { useCurrencyStore } from '@/stores/atom/currency'
import { formatNumber } from '@/utils/formatNumber'
import { isUndef } from '@/utils/helper'
import { transformParam } from '@/utils/operation'
import React, { useMemo } from 'react'
import { useShallow } from 'zustand/shallow'

/**
 * PrettyAmountCoin component displays a formatted amount with optional currency symbol
 * @param {Object} props - Component props
 * @param {string} props.code - Currency code (e.g. 'BTC', 'ETH')
 * @param {string|number|undefined} props.amount - Amount to display
 * @param {boolean} [props.showSymbol=true] - Whether to show currency symbol
 * @param {number} [props.precision] - Number of decimal places to display
 * @returns {JSX.Element} Formatted amount with optional currency symbol
 */
const PrettyAmountCoin = ({
  code,
  amount,
  showSymbol = true,
  precision,
}: {
  code: string
  amount: string | number | undefined
  showSymbol?: boolean
  precision?: number
}) => {
  // Prevent re-render
  const currencyInfo = useCurrencyStore(useShallow((state) => state.currenciesMap[code]))
  // Default 18 decimal
  const { display_decimal = 18, symbol } = currencyInfo

  const showText = useMemo(() => {
    if (isUndef(amount)) {
      return '-'
    }
    const formatAmount = formatNumber({
      value: transformParam(amount),
      options: {
        maximumFractionDigits: precision || display_decimal,
      },
    })

    return `${formatAmount}${showSymbol && symbol ? ` ${symbol}` : ''}`
  }, [amount, display_decimal])

  return <>{showText}</>
}

export default PrettyAmountCoin
