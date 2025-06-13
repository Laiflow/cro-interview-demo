import { create } from 'zustand'
import { useSocketWithWorker } from '../../hooks/useSocketWithWorker'
import { fetchCurrencies, fetchLiveRates } from '../../services/mockApi'
import { Currency, CurrencyRate } from '@/types/currency'
import { CURRENCY_BASIC_INFO_EVENT, CURRENCY_RATES_EVENT } from '@/constants/socketEvent'
import { dividedBy, multiply } from '@/utils/operation'

export interface CurrencyState {
  // Currency data
  currencies: Currency[]
  currenciesMap: Record<string, Currency>
  rates: Record<string, CurrencyRate>

  // Store state
  isLoading: boolean
  error: string | null
  socketConnected: boolean

  // actions
  fetchCurrencies: () => Promise<void>
  fetchLiveRates: () => Promise<void>
  subscribeToCurrencyUpdates: (socketUrl: string) => () => void
  updateRate: (currency: string, rate: number) => void
  updateCurrency: (currency: Currency) => void

  // compute
  getRate: (currency: string) => number
  convertToUsd: (amount: number, currency: string) => number
  convertFromUsd: (amount: number, currency: string) => number
  getCurrency: (currencyId: string) => Currency | undefined
}

/** Atomic currency store containing basic currency data, rate data, and polling/push subscription handling logic */
export const useCurrencyStore = create<CurrencyState>((set, get) => ({
  // Initial state
  currencies: [],
  currenciesMap: {},
  rates: {},
  isLoading: false,
  error: null,
  socketConnected: false,
  // Fetch currency basic information
  fetchCurrencies: async () => {
    set({ isLoading: true, error: null })

    try {
      // In a real environment, this would call the API
      const { currencies } = (await fetchCurrencies()) || {}

      // Build currenciesMap for quick lookup
      const currenciesMap: Record<string, Currency> = {}
      currencies.forEach((currency) => {
        currenciesMap[currency.coin_id] = currency
      })

      set({
        currencies,
        currenciesMap,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch currencies',
        isLoading: false,
      })
    }
  },

  // Fetch live rates
  fetchLiveRates: async () => {
    set({ isLoading: true, error: null })

    try {
      // In a real environment, this would call the API
      const data = await fetchLiveRates()

      // Process the obtained rate data
      const updatedRates: Record<string, CurrencyRate> = {}

      // Iterate over the rate data returned by the API
      data.tiers.forEach((tier) => {
        const currency = tier.from_currency
        const rate = parseFloat(tier.rates[0].rate)

        updatedRates[currency] = {
          currency,
          rate,
          lastUpdated: Date.now(),
        }
      })

      set({
        rates: updatedRates,
        isLoading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch fetchLiveRates',
        isLoading: false,
      })
    }
  },

  // Subscribe to real-time rate updates using WebWorker
  subscribeToCurrencyUpdates: (socketUrl: string) => {
    // Create the return function for the custom hook
    const { subscribe, isConnected, disconnect } = useSocketWithWorker(socketUrl, {
      reconnectLimit: 5,
      reconnectInterval: 3000,
      throttleInterval: 1000,
      onOpen: () => {
        set({ socketConnected: true, error: null })
      },
      onClose: () => {
        set({ socketConnected: false })
      },
      onError: (error) => {
        set({
          error: error.message || 'Socket connection error',
          socketConnected: false,
        })
      },
    })

    // Subscribe to rate updates
    const ratesUnsubscribe = subscribe<{ currency: string; rate: number }>(
      CURRENCY_RATES_EVENT,
      (data) => {
        // Update rate
        get().updateRate(data.currency, data.rate)
      }
    )

    // Subscribe to currency basic info updates
    const currencyUnsubscribe = subscribe<Currency>(CURRENCY_BASIC_INFO_EVENT, (data) => {
      // Update currency info
      get().updateCurrency(data)
    })

    // Listen to connection status
    if (isConnected) {
      set({ socketConnected: true })
    }

    // Return cleanup function
    return () => {
      ratesUnsubscribe()
      currencyUnsubscribe()
      disconnect()
      set({ socketConnected: false })
    }
  },

  // Update the rate of a specific currency
  updateRate: (currency: string, rate: number) => {
    set((state) => ({
      rates: {
        ...state.rates,
        [currency]: {
          currency,
          rate,
          lastUpdated: Date.now(),
        },
      },
    }))
  },

  // Update the basic information of a specific currency
  updateCurrency: (currency: Currency) => {
    set((state) => {
      // Update currenciesMap
      const updatedCurrenciesMap = {
        ...state.currenciesMap,
        [currency.coin_id]: currency,
      }

      // Update currencies array
      let updatedCurrencies = [...state.currencies]
      const existingIndex = updatedCurrencies.findIndex((c) => c.coin_id === currency.coin_id)

      if (existingIndex >= 0) {
        // Replace existing currency info
        updatedCurrencies[existingIndex] = currency
      } else {
        // Add new currency
        updatedCurrencies = [...updatedCurrencies, currency]
      }

      return {
        currencies: updatedCurrencies,
        currenciesMap: updatedCurrenciesMap,
      }
    })
  },

  // Get the rate of the specified currency
  getRate: (currency: string) => {
    const { rates } = get()
    return rates[currency]?.rate || 0
  },

  // Get the basic information of the specified currency
  getCurrency: (currencyId: string) => {
    return get().currenciesMap[currencyId]
  },

  // Convert currency amount to USD
  convertToUsd: (amount: number, currency: string) => {
    const rate = get().getRate(currency)
    return multiply(amount)(rate)
  },

  // Convert USD amount to the specified currency
  convertFromUsd: (amount: number, currency: string) => {
    const rate = get().getRate(currency)
    return rate ? dividedBy(amount)(rate) : 0
  },
}))
