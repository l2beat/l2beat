import { UnixTime } from '@l2beat/shared-pure'
import { QueryClient } from '@tanstack/react-query'

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 10 * UnixTime.MINUTE,
      },
    },
  })
