import { MockDataPusher } from '@/mockDataPusher'
import { useCurrencyStore } from '@/stores/atom/currency'

// 初始化模拟数据（仅用于演示）
export const initializeMockCurrencyData = () => {
  // 获取store状态和方法
  const { fetchCurrencies, fetchLiveRates } = useCurrencyStore.getState()

  // 加载基本货币数据
  fetchCurrencies()

  // 加载实时汇率数据
  fetchLiveRates()

  MockDataPusher.simulateRateUpdate()
}
