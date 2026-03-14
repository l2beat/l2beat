import type { AppRouter } from '@l2beat/interop-backoffice'
import type { QueryClient } from '@tanstack/react-query'
import { QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink, loggerLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import type React from 'react'
import { useState } from 'react'
import { createQueryClient } from './queryClient'

let clientQueryClientSingleton: QueryClient | undefined = undefined
const getQueryClient = () => {
  if (typeof window === 'undefined') {
    return createQueryClient()
  }
  return (clientQueryClientSingleton ??= createQueryClient())
}

export const api: ReturnType<typeof createTRPCReact<AppRouter>> =
  createTRPCReact<AppRouter>()

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient()
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === 'development' ||
            (op.direction === 'down' && op.result instanceof Error),
        }),
        httpBatchLink({
          transformer: {
            serialize: JSON.stringify,
            deserialize: JSON.parse,
          },
          url: '/trpc',
          headers: () => {
            const headers = new Headers()

            return headers
          },
        }),
      ],
    }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  )
}
