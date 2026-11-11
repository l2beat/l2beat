import { UnixTime } from '@l2beat/shared-pure'
import { QueryClient } from '@tanstack/react-query'

// Default dehydrate options on purpose: the server JSON-encodes the whole page
// data once, so a per-query serializer would encode each result twice, and a
// pending query's promise would not survive the encoding.
export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 10 * UnixTime.MINUTE * 1000,
      },
    },
  })
