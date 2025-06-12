import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import PrettyAmountCoin from '../PrettyAmountCoin'
import { useCurrencyStore } from '@/stores/atom/currency'

// Mock the currency store
vi.mock('@/stores/atom/currency', () => ({
  useCurrencyStore: vi.fn(),
}))

describe('PrettyAmountCoin', () => {
  beforeEach(() => {
    // Default mock implementation
    ;(useCurrencyStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      getCurrency: (code: string) => ({
        symbol: code,
        display_decimal: 8,
      }),
    })
  })

  it('should render the amount with symbol when showSymbol is true', () => {
    const { getByText } = render(
      <PrettyAmountCoin code="BTC" amount={1.23456789} showSymbol={true} />
    )

    expect(getByText('1.23456789 BTC')).toBeDefined()
  })

  it('should render the amount without symbol when showSymbol is false', () => {
    const { getByText } = render(
      <PrettyAmountCoin code="BTC" amount={1.23456789} showSymbol={false} />
    )

    expect(getByText('1.23456789')).toBeDefined()
  })

  it('should respect the precision parameter', () => {
    const { getByText } = render(
      <PrettyAmountCoin code="BTC" amount={1.23456789} showSymbol={true} precision={2} />
    )

    expect(getByText('1.23 BTC')).toBeDefined()
  })

  it('should display "-" when amount is undefined', () => {
    const { getByText } = render(
      <PrettyAmountCoin code="BTC" amount={undefined} showSymbol={true} />
    )

    expect(getByText('-')).toBeDefined()
  })

  it('should display "-" when amount is null', () => {
    const { getByText } = render(
      <PrettyAmountCoin code="BTC" amount={null as any} showSymbol={true} />
    )

    expect(getByText('-')).toBeDefined()
  })

  it('should display "-" when amount is empty string', () => {
    const { getByText } = render(
      <PrettyAmountCoin code="BTC" amount={'' as any} showSymbol={true} />
    )

    expect(getByText('-')).toBeDefined()
  })

  it('should use currency display_decimal when precision is not provided', () => {
    // Mock a currency with specific display_decimal
    ;(useCurrencyStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      getCurrency: (code: string) => ({
        symbol: code,
        display_decimal: 2,
      }),
    })

    const { getByText } = render(
      <PrettyAmountCoin code="BTC" amount={1.23456789} showSymbol={true} />
    )

    expect(getByText('1.23 BTC')).toBeDefined()
  })

  it('should handle case when currency info is not available', () => {
    // Mock no currency info
    ;(useCurrencyStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      getCurrency: () => undefined,
    })

    const { getByText } = render(
      <PrettyAmountCoin code="UNKNOWN" amount={1.23456789} showSymbol={true} />
    )

    // Should still format the number but without a symbol
    expect(getByText('1.23456789')).toBeDefined()
  })
})
