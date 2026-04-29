import type { BackendRouter } from '@l2beat/backend/trpc'
import { QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink, loggerLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import type React from 'react'
import { useState } from 'react'
import { useEnvironment } from '~/components/environment/EnvironmentContext'
import { createQueryClient } from './queryClient'

export const api: ReturnType<typeof createTRPCReact<BackendRouter>> =
  createTRPCReact<BackendRouter>()

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const { config } = useEnvironment()
  // The `key` on the inner provider forces a fresh tRPC client + query cache
  // whenever the user switches environments, so cached data from one
  // environment never leaks into another.
  return (
    <TRPCReactProviderInner key={config.url} url={config.url}>
      {props.children}
    </TRPCReactProviderInner>
  )
}

function TRPCReactProviderInner({
  url,
  children,
}: {
  url: string
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => createQueryClient())
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
          url,
          headers: () => {
            const headers = new Headers()
            const backendAuthToken = import.meta.env.VITE_BACKEND_AUTH_TOKEN
            if (backendAuthToken) {
              headers.set('Authorization', backendAuthToken)
            }

            return headers
          },
        }),
      ],
    }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {children}
      </api.Provider>
    </QueryClientProvider>
  )
}
