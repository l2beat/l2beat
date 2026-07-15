import { trpcTransformer } from '@l2beat/shared-pure'
import type { AppRouter } from '@l2beat/token-backend'
import type { QueryClient } from '@tanstack/react-query'
import { QueryClientProvider } from '@tanstack/react-query'
import {
  createTRPCClient,
  httpBatchLink,
  loggerLink,
  type TRPCClient,
} from '@trpc/client'
import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { createTRPCContext } from '@trpc/tanstack-react-query'
import type React from 'react'
import { useState } from 'react'
import { createQueryClient } from './queryClient'

let clientQueryClientSingleton: QueryClient | undefined = undefined
const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return createQueryClient()
  }
  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= createQueryClient())
}

const trpcContext = createTRPCContext<AppRouter>()

export const TRPCProvider: React.FC<{
  children: React.ReactNode
  queryClient: QueryClient
  trpcClient: TRPCClient<AppRouter>
}> = trpcContext.TRPCProvider

export const useTRPC: () => TRPCOptionsProxy<AppRouter> = trpcContext.useTRPC

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient()
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === 'development' ||
            (op.direction === 'down' && op.result instanceof Error),
        }),
        httpBatchLink({
          // History pages can resolve hundreds of relation endpoints at once.
          methodOverride: 'POST',
          transformer: trpcTransformer,
          url: '/trpc',
          headers: () => {
            const headers = new Headers()
            const readOnlyToken = import.meta.env
              .VITE_TOKEN_BACKEND_READONLY_AUTH_TOKEN
            if (readOnlyToken) {
              headers.set('Authorization', readOnlyToken)
            }

            return headers
          },
        }),
      ],
    }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  )
}
