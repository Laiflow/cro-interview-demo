import { MockDataPusher } from '@/mockDataPusher'
import { useCurrencyStore } from '@/stores/atom/currency'

// Initialize mock data (for demo only)
export const initializeMockCurrencyData = () => {
  // Get store state and methods
  const { fetchCurrencies, fetchLiveRates } = useCurrencyStore.getState()

  // Load basic currency data
  fetchCurrencies()

  // Load real-time rate data
  fetchLiveRates()

  MockDataPusher.simulateRateUpdate()
}
