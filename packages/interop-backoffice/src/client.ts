import { createTRPCClient, httpBatchLink } from '@trpc/client'
import SuperJSON from 'superjson'
import type { InteropTrpcRouter } from './trpc/router'

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

  return createTRPCClient<InteropTrpcRouter>({
    links: [
      httpBatchLink({
        transformer: {
          serialize: SuperJSON.serialize,
          deserialize: SuperJSON.deserialize,
        },
        url: config.apiUrl,
        methodOverride: 'POST',
        headers() {
          return headers
        },
      }),
    ],
  })
}
