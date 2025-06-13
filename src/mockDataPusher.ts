import { multiply, plus } from '@/utils/operation'
import { Currency, CurrencyRate } from './types/currency'
import { CURRENCY_RATES_EVENT } from './constants/socketEvent'
import { useCurrencyStore } from './stores/atom/currency'

interface SocketClient {
  emit: (event: string, data: Currency | CurrencyRate) => void
}

/** Simulate pushing currency basic information updates */
export class MockDataPusher {
  /**
   *  mock rate-data push
   * @static
   * @param {SocketClient} [socketClient]
   *
   * @memberOf MockDataPusher
   */
  static simulateRateUpdate(socketClient?: SocketClient) {
    // Set interval to 5s
    setInterval(() => {
      const mockRates = {
        USDT: '1.000727',
        BTC: '10603.900000',
        ETH: '340.210000',
        CRO: '0.147268',
        DAI: '1.001209',
      }

      const newMockRates = Object.entries(mockRates).reduce((acc, [currency, baseRate]) => {
        const variation = (Math.random() - 0.5) * 0.01
        const newRate = multiply(baseRate)(plus(1)(variation))
        return { ...acc, [currency]: newRate }
      }, {})

      Object.entries(newMockRates).forEach((entity) => {
        const [currency, newRate] = entity
        // In a real environment, this would send messages via WebSocket
        if (socketClient) {
          socketClient.emit(CURRENCY_RATES_EVENT, {
            [currency]: newRate,
          } as unknown as CurrencyRate)
        } else {
          // Directly update store when no socket client is available (for testing only)
          const { updateRate } = useCurrencyStore.getState()
          updateRate(currency, newRate as number)
        }
      })
    }, 3000)
  }
}
