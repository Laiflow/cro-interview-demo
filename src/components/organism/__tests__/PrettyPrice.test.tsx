import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import PrettyPrice from '../PrettyPrice'
import { useCurrencyStore } from '@/stores/atom/currency'

// Mock dependencies
vi.mock('@/stores/atom/currency', () => ({
  useCurrencyStore: vi.fn(),
}))

vi.mock('../PrettyAmountCoin', () => ({
  default: ({ amount, code, precision }) => (
    <span data-testid="pretty-amount">{`${amount} ${code} (precision: ${precision})`}</span>
  ),
}))

describe('PrettyPrice', () => {
  beforeEach(() => {
    // Default mock implementation
    ;(useCurrencyStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      getRate: (currency: string) => {
        const rates = {
          USDT: 1,
          BTC: 10000,
          ETH: 500,
        }
        return rates[currency] || 0
      },
    })
  })

  it('should render with amount prop', () => {
    const { getByTestId } = render(<PrettyPrice currency="BTC" amount={2} />)

    // 2 BTC * 10000 = 20000
    expect(getByTestId('pretty-amount').textContent).toBe('20000 BTC (precision: 2)')
  })

  it('should render with children prop', () => {
    const { getByTestId } = render(<PrettyPrice currency="ETH">5</PrettyPrice>)

    // 5 ETH * 500 = 2500
    expect(getByTestId('pretty-amount').textContent).toBe('2500 ETH (precision: 2)')
  })

  it('should prefer children over amount prop if both are provided', () => {
    const { getByTestId } = render(
      <PrettyPrice currency="ETH" amount={10}>
        5
      </PrettyPrice>
    )

    // Should use children (5) instead of amount (10)
    // 5 ETH * 500 = 2500
    expect(getByTestId('pretty-amount').textContent).toBe('2500 ETH (precision: 2)')
  })

  it('should use custom precision when provided', () => {
    const { getByTestId } = render(<PrettyPrice currency="BTC" amount={2} precision={4} />)

    expect(getByTestId('pretty-amount').textContent).toBe('20000 BTC (precision: 4)')
  })

  it('should handle undefined amount and children', () => {
    const { getByTestId } = render(<PrettyPrice currency="BTC" />)

    // Should pass "-" to PrettyAmountCoin
    expect(getByTestId('pretty-amount').textContent).toBe('- BTC (precision: 2)')
  })

  it('should handle non-numeric children', () => {
    const { getByTestId } = render(<PrettyPrice currency="BTC">abc</PrettyPrice>)

    // Should pass "-" to PrettyAmountCoin
    expect(getByTestId('pretty-amount').textContent).toBe('- BTC (precision: 2)')
  })

  it('should handle unknown currency', () => {
    const { getByTestId } = render(<PrettyPrice currency="XYZ" amount={10} />)

    // Rate for XYZ is 0, so result should be 0
    expect(getByTestId('pretty-amount').textContent).toBe('0 XYZ (precision: 2)')
  })
})
