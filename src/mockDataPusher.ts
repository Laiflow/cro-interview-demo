import { multiply, plus } from '@/utils/operation'
import { Currency, CurrencyRate } from './types/currency'
import { CURRENCY_RATES_EVENT } from './constants/socketEvent'
import { useCurrencyStore } from './stores/atom/currency'

interface SocketClient {
  emit: (event: string, data: Currency | CurrencyRate) => void
}

// // 模拟推送货币基本信息更新
export class MockDataPusher {
  /**
   *  mock 费率推送
   * @static
   * @param {SocketClient} [socketClient]
   *
   * @memberOf MockDataPusher
   */
  static simulateRateUpdate(socketClient?: SocketClient) {
    // 定时5s
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
        // 如果在真实环境中，这里会通过WebSocket发送消息
        if (socketClient) {
          socketClient.emit(CURRENCY_RATES_EVENT, {
            [currency]: newRate,
          } as unknown as CurrencyRate)
        } else {
          // 在没有socket客户端的情况下直接更新store（仅用于测试）
          const { updateRate } = useCurrencyStore.getState()
          updateRate(currency, newRate as number)
        }
      })
    }, 3000)
  }
}
