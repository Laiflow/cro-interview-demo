import { create } from 'zustand'
import { useSocketWithWorker } from '../../hooks/useSocketWithWorker'
import { fetchCurrencies, fetchLiveRates } from '../../services/mockApi'
import { Currency, CurrencyRate } from '@/types/currency'

// 货币汇率更新事件名称
const CURRENCY_RATES_EVENT = 'currency_rates_update'
// 货币基本信息更新事件名称
const CURRENCY_BASIC_INFO_EVENT = 'currency_basic_info_update'

// 货币Store状态
export interface CurrencyState {
  // 数据
  currencies: Currency[]
  currenciesMap: Record<string, Currency>
  rates: Record<string, CurrencyRate>

  // 状态
  isLoading: boolean
  error: string | null
  socketConnected: boolean

  // 操作
  fetchCurrencies: () => Promise<void>
  fetchLiveRates: () => Promise<void>
  subscribeToCurrencyUpdates: (socketUrl: string) => () => void
  updateRate: (currency: string, rate: number) => void
  updateCurrency: (currency: Currency) => void

  // 计算
  getRate: (currency: string) => number
  convertToUsd: (amount: number, currency: string) => number
  convertFromUsd: (amount: number, currency: string) => number
  getCurrency: (currencyId: string) => Currency | undefined
}

// 创建货币Store
export const useCurrencyStore = create<CurrencyState>((set, get) => ({
  // 初始状态
  currencies: [],
  currenciesMap: {},
  rates: {},
  isLoading: false,
  error: null,
  socketConnected: false,
  // 获取货币基本信息
  fetchCurrencies: async () => {
    set({ isLoading: true, error: null })

    try {
      // 在真实环境中，这里会调用API
      const { currencies } = (await fetchCurrencies()) || {}

      // 构建currenciesMap，便于快速查找
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

  // 获取货币基本信息
  fetchLiveRates: async () => {
    set({ isLoading: true, error: null })

    try {
      // 在真实环境中，这里会调用API
      const data = await fetchLiveRates()

      // 处理获取到的汇率数据
      const updatedRates: Record<string, CurrencyRate> = {}

      // 遍历API返回的汇率数据
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

  // 使用WebWorker订阅实时汇率更新
  subscribeToCurrencyUpdates: (socketUrl: string) => {
    // 创建自定义钩子的返回函数
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

    // 订阅汇率更新
    const ratesUnsubscribe = subscribe<{ currency: string; rate: number }>(
      CURRENCY_RATES_EVENT,
      (data) => {
        // 更新汇率
        get().updateRate(data.currency, data.rate)
      }
    )

    // 订阅货币基本信息更新
    const currencyUnsubscribe = subscribe<Currency>(CURRENCY_BASIC_INFO_EVENT, (data) => {
      // 更新货币信息
      get().updateCurrency(data)
    })

    // 监听连接状态
    if (isConnected) {
      set({ socketConnected: true })
    }

    // 返回清理函数
    return () => {
      ratesUnsubscribe()
      currencyUnsubscribe()
      disconnect()
      set({ socketConnected: false })
    }
  },

  // 更新某个货币的汇率
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

  // 更新某个货币的基本信息
  updateCurrency: (currency: Currency) => {
    set((state) => {
      // 更新currenciesMap
      const updatedCurrenciesMap = {
        ...state.currenciesMap,
        [currency.coin_id]: currency,
      }

      // 更新currencies数组
      let updatedCurrencies = [...state.currencies]
      const existingIndex = updatedCurrencies.findIndex((c) => c.coin_id === currency.coin_id)

      if (existingIndex >= 0) {
        // 替换已存在的货币信息
        updatedCurrencies[existingIndex] = currency
      } else {
        // 添加新货币
        updatedCurrencies = [...updatedCurrencies, currency]
      }

      return {
        currencies: updatedCurrencies,
        currenciesMap: updatedCurrenciesMap,
      }
    })
  },

  // 获取指定货币的汇率
  getRate: (currency: string) => {
    const { rates } = get()
    return rates[currency]?.rate || 0
  },

  // 获取指定货币的基本信息
  getCurrency: (currencyId: string) => {
    return get().currenciesMap[currencyId]
  },

  // 将货币金额转换为USD
  convertToUsd: (amount: number, currency: string) => {
    const rate = get().getRate(currency)
    return amount * rate
  },

  // 将USD金额转换为指定货币
  convertFromUsd: (amount: number, currency: string) => {
    const rate = get().getRate(currency)
    return rate ? amount / rate : 0
  },
}))
