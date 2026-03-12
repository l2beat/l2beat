import { createTRPCClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from './trpc/appRouter'

export interface InteropBackOfficeClientConfig {
  apiUrl: string
  callSource?: string
}

export type InteropBackOfficeClient = ReturnType<
  typeof getInteropBackofficeClient
>

export function getInteropBackofficeClient(
  config: InteropBackOfficeClientConfig,
) {
  const headers: Record<string, string> = {}

  if (config.callSource) {
    headers['x-trpc-source'] = config.callSource
  }

  return createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: config.apiUrl,
        methodOverride: 'POST',
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
