import { useEffect } from 'react'
import { useCurrencyStore } from '@/stores/atom/currency'
import { initializeMockCurrencyData } from './presenter'

/**
 * 使用加密货币Socket数据
 * 在实际环境中，这将连接到真实的Socket服务器
 * 在Demo中，我们使用模拟数据
 */
export const useCryptoSocket = () => {
  const {
    currencies,
    isLoading,
    error,
    socketConnected,
    // subscribeToCurrencyUpdates // ws订阅币服数据
  } = useCurrencyStore()

  // 初始化并订阅更新
  useEffect(() => {
    // 在真实应用中，这里会连接到实际的Socket服务器
    // 例如: const unsubscribe = subscribeToCurrencyUpdates('wss://api.example.com/socket');
    // 例如: const unsubscribe = subscribeToCurrencyUpdates('wss://api.example.com/socket');

    // 在演示环境中，我们使用模拟数据
    if (currencies.length === 0) {
      // 只在初始化时执行一次
      initializeMockCurrencyData()
    }

    // 清理函数
    return () => {
      // 在实际环境中取消订阅: unsubscribe();
    }
  }, [currencies.length])

  return {
    isLoading,
    error,
    socketConnected,
  }
}
