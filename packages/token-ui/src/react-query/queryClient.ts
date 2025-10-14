import { defaultShouldDehydrateQuery, QueryClient } from '@tanstack/react-query'

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 10 * 60 * 1000,
      },
      dehydrate: {
        serializeData: JSON.stringify,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
      hydrate: {
        deserializeData: JSON.parse,
      },
    },
  })
