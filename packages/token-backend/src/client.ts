import { createTRPCClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from './trpc/appRouter'

export interface TokenClientConfig {
  apiUrl: string
  authToken: string | undefined
  callSource?: string
}

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
