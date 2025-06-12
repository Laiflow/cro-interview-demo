import { QueryClient } from '@tanstack/react-query'

export const PersistTimeMap = {
  disabled: 0, // 禁用缓存
  halfDay: 12 * 60 * 60 * 1000, // 12小时
  oneDay: 24 * 60 * 60 * 1000, //24小时
  oneWeek: 7 * 24 * 60 * 60 * 1000, // 7天
  maximum: 2147483647, // 24.8天  maximum 32 位整数最大值
}

export const StaleTimeMap = {
  /**  禁用数据新鲜有效时长 默认发起新请求 */
  disabled: 0,
  /** 预加载场景 3 秒页面载入时长 */
  preload: 3 * 1000,
}

// 创建 QueryClient 并配置全局选项
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 失败后重试一次
      retry: 1,
      // 默认不保持数据新鲜度 永远发起新请求，颗粒度放到各个 useQuery 下控制  如 5 * 60 * 1000, // 数据保持新鲜5分钟
      staleTime: PersistTimeMap.disabled,
      //  12 * 60 * 60 * 1000, // 数据缓存12小时
      gcTime: PersistTimeMap.halfDay,
      refetchOnMount: true,
    },
  },
})
