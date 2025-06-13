import { QueryClient } from '@tanstack/react-query'

export const PersistTimeMap = {
  disabled: 0, // Disable cache
  halfDay: 12 * 60 * 60 * 1000, // 12 hours
  oneDay: 24 * 60 * 60 * 1000, // 24 hours
  oneWeek: 7 * 24 * 60 * 60 * 1000, // 7 days
  maximum: 2147483647, // 24.8 days, maximum 32-bit integer value
}

export const StaleTimeMap = {
  /** Disable data freshness, always send new request */
  disabled: 0,
  /** Preload scenario, 3 seconds page load time */
  preload: 3 * 1000,
}

// Create QueryClient and configure global options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry once after failure
      retry: 1,
      // By default, do not keep data fresh, always send new request. Control granularity in each useQuery, e.g. 5 * 60 * 1000 for 5 minutes freshness
      staleTime: PersistTimeMap.disabled,
      // 12 * 60 * 60 * 1000, // Data cache for 12 hours
      gcTime: PersistTimeMap.halfDay,
      refetchOnMount: true,
    },
  },
})
