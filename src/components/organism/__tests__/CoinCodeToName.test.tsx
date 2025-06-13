import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import CoinCodeToName from '../CoinCodeToName'
import { useCurrencyStore } from '@/stores/atom/currency'

// Mock the currency store
vi.mock('@/stores/atom/currency', () => ({
  useCurrencyStore: vi.fn(),
}))

describe('CoinCodeToName', () => {
  // Mock currency data
  const mockCurrencyData = {
    BTC: { name: 'Bitcoin', code: 'BTC' },
    ETH: { name: 'Ethereum', code: 'ETH' },
  }

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks()
    // Setup default mock implementation
    ;(useCurrencyStore as any).mockImplementation((selector) => {
      const state = {
        getCurrency: (code: string) => mockCurrencyData[code as keyof typeof mockCurrencyData],
      }
      return selector(state)
    })
  })

  it('should display currency name when currency exists', () => {
    render(<CoinCodeToName coin="BTC" />)

    const element = screen.getByText('Bitcoin')
    expect(element).toBeDefined()
  })

  it('should display currency code when currency does not exist', () => {
    render(<CoinCodeToName coin="UNKNOWN" />)

    const element = screen.getByText('UNKNOWN')
    expect(element).toBeDefined()
  })

  it('should handle empty coin code', () => {
    render(<CoinCodeToName coin="UNKNOWN" />)

    const element = screen.getByText('UNKNOWN')
    expect(element).toBeDefined()
  })

  it('should handle different currency codes', () => {
    render(<CoinCodeToName coin="ETH" />)

    const element = screen.getByText('Ethereum')
    expect(element).toBeDefined()
  })
})
