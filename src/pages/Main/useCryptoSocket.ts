import { useEffect } from 'react'
import { useCurrencyStore } from '@/stores/atom/currency'
import { initializeMockCurrencyData } from './presenter'

/**
 * Use crypto socket data
 * In production, this connects to a real socket server
 * In demo, we use mock data
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
    // In real app, connect to actual socket server here
    // e.g.: const unsubscribe = subscribeToCurrencyUpdates('wss://api.example.com/socket');
    // e.g.: const unsubscribe = subscribeToCurrencyUpdates('wss://api.example.com/socket');

    // In demo, we use mock data
    if (currencies.length === 0) {
      // Only run once on init
      initializeMockCurrencyData()
    }

    // Cleanup function
    return () => {
      // In production, unsubscribe: unsubscribe();
    }
  }, [currencies.length])

  return {
    isLoading,
    error,
    socketConnected,
  }
}
