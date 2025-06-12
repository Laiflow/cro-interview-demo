import { useCurrencyStore } from '@/stores/atom/currency'
import { multiply } from '@/utils/operation'
import React, { memo, useMemo } from 'react'
import PrettyAmountCoin from './PrettyAmountCoin'
import { isValidNumber } from '@/utils/helper'
import { useShallow } from 'zustand/shallow'

type Target = string | number

/**
 * PrettyPrice component displays a formatted price with optional currency symbol
 * @param {Object} props - Component props
 * @param {string} props.currency - Currency code (e.g. 'BTC', 'ETH')
 * @param {string|number|undefined} props.amount - Amount to display
 * @param {number} [props.precision=2] - Number of decimal places to display
 * @param {string|number|undefined} [props.children] - Alternative amount to display
 * @returns {JSX.Element} Formatted price with optional currency symbol
 */
const PrettyPrice = ({
  currency = 'USDT',
  amount,
  children,
  precision = 2,
}: {
  currency?: string
  amount?: Target
  precision?: number
  children?: Target
}) => {
  // prevent re-render
  const targetRate = useCurrencyStore(useShallow((state) => state.getRate(currency)))

  const targetAmount = useMemo(() => {
    if (isValidNumber(children) || isValidNumber(amount)) {
      return multiply(targetRate)(children || amount)
    }
    return '-'
  }, [targetRate, children, amount])

  return (
    <>
      <PrettyAmountCoin
        precision={precision}
        code={currency}
        amount={targetAmount}
        showSymbol={false}
      />
    </>
  )
}

export default memo(PrettyPrice)
