import { UnixTime } from '@l2beat/shared-pure'
import { QueryClient } from '@tanstack/react-query'

// Default dehydrate options on purpose: the server JSON-encodes the whole page
// data once, so a per-query serializer would encode each result twice, and a
// pending query's promise would not survive the encoding.
export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_AFTER_MS,
      },
    },
  })

/**
 * Prefetched queries reach the browser up to 36 min old: the in-memory page
 * cache keeps them 5 min + 25 min stale-while-revalidate, the edge 1 min +
 * 5 min. A staleTime below that refetches on hydration the data the page was
 * just rendered with, and draws its charts a second time. Chart data updates
 * hourly, so an hour keeps shown data at most one update behind.
 */
const STALE_AFTER_MS = UnixTime.HOUR * 1000
