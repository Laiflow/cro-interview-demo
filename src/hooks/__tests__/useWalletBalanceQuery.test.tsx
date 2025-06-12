import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useWalletBalanceQuery } from '../useWalletBalanceQuery'
import { fetchWalletBalance } from '../../services/mockApi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock the API call
vi.mock('../../services/mockApi', () => ({
  fetchWalletBalance: vi.fn(),
}))

const mockWalletData = {
  ok: true,
  warning: '',
  wallet: [
    {
      currency: 'BTC',
      amount: 1.4,
    },
    {
      currency: 'ETH',
      amount: 20.3,
    },
  ],
}

describe('useWalletBalanceQuery', () => {
  let queryClient: QueryClient

  // Wrapper component for the hook with React Query Provider
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  beforeEach(() => {
    // Reset mocks and create a new QueryClient for each test
    vi.resetAllMocks()
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
  })

  it('should fetch wallet balance data successfully', async () => {
    // Mock API response
    ;(fetchWalletBalance as any).mockResolvedValue(mockWalletData)

    // Render the hook
    const { result } = renderHook(() => useWalletBalanceQuery(), { wrapper })

    // Initially should be in loading state
    expect(result.current.isLoading).toBe(true)

    // Wait for the query to complete
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    // Check if data was returned correctly
    expect(result.current.data).toEqual(mockWalletData)
    expect(result.current.error).toBeNull()
  })

  it('should handle API error', async () => {
    // Mock API error
    const error = new Error('Failed to fetch wallet data')
    ;(fetchWalletBalance as any).mockRejectedValue(error)

    // Render the hook
    const { result } = renderHook(() => useWalletBalanceQuery(), { wrapper })

    // Wait for the query to complete
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    // Should have error state
    expect(result.current.error).toBeDefined()
    expect(result.current.data).toBeUndefined()
  })

  it('should use custom options when provided', async () => {
    // Mock API response
    ;(fetchWalletBalance as any).mockResolvedValue(mockWalletData)

    // Custom options
    const customOptions = {
      enabled: false,
      retry: 3,
    }

    // Render the hook with custom options
    const { result } = renderHook(() => useWalletBalanceQuery(customOptions), {
      wrapper,
    })

    // Should respect the enabled: false option
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isFetched).toBe(false)
  })
})
