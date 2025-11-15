import { createTRPCClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from './trpc/appRouter'

export interface TokenClientConfig {
  apiUrl: string
  authToken: string | undefined
  callSource?: string
}

export type TokenDbClient = ReturnType<typeof getTokenDbClient>

export function getTokenDbClient(config: TokenClientConfig) {
  const headers: Record<string, string> = {}

  if (config.callSource) {
    headers['x-trpc-source'] = config.callSource
  }

  if (config.authToken !== undefined) {
    headers['cookie'] = `CF_Authorization=${config.authToken}`
  }

  return createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: config.apiUrl,
        methodOverride: 'POST', // Sometimes request body is too large to fit in GET's URL
        transformer: {
          serialize: JSON.stringify,
          deserialize: JSON.parse,
        },
        headers() {
          return headers
        },
      }),
    ],
  })
}
