import type { BackendRouter } from '@l2beat/backend/trpc'
import { type QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client'
import {
  createTRPCContext,
  type TRPCOptionsProxy,
} from '@trpc/tanstack-react-query'
import type React from 'react'
import { useState } from 'react'
import {
  type Environment,
  useEnvironment,
} from '~/components/environment/EnvironmentContext'
import { createQueryClient } from './queryClient'

type Api = TRPCOptionsProxy<BackendRouter, { keyPrefix: true }>

const productionBackendTrpc = createTRPCContext<
  BackendRouter,
  { keyPrefix: true }
>()
const stagingBackendTrpc = createTRPCContext<
  BackendRouter,
  { keyPrefix: true }
>()
const localBackendTrpc = createTRPCContext<BackendRouter, { keyPrefix: true }>()

const CLIENTS: Record<Environment, typeof productionBackendTrpc> = {
  production: productionBackendTrpc,
  staging: stagingBackendTrpc,
  local: localBackendTrpc,
}

export function useBackendTrpc(env?: Environment): Api {
  const { environment } = useEnvironment()
  return CLIENTS[env ?? environment].useTRPC()
}

export function TRPCReactProvider({ children }: { children: React.ReactNode }) {
  const { allConfigs } = useEnvironment()
  const urls = Object.fromEntries(
    allConfigs.map(({ id, config }) => [id, config.url]),
  ) as Partial<Record<Environment, string>>

  const [defaultQueryClient] = useState(() => createQueryClient())

  return (
    <QueryClientProvider client={defaultQueryClient}>
      <PinnedProvider
        trpc={productionBackendTrpc}
        keyPrefix="production"
        queryClient={defaultQueryClient}
        url={urls.production ?? '/trpc/production'}
      >
        <PinnedProvider
          trpc={stagingBackendTrpc}
          keyPrefix="staging"
          queryClient={defaultQueryClient}
          url={urls.staging ?? '/trpc/staging'}
        >
          {urls.local ? (
            <PinnedProvider
              trpc={localBackendTrpc}
              keyPrefix="local"
              queryClient={defaultQueryClient}
              url={urls.local}
            >
              {children}
            </PinnedProvider>
          ) : (
            children
          )}
        </PinnedProvider>
      </PinnedProvider>
    </QueryClientProvider>
  )
}

function PinnedProvider({
  trpc,
  keyPrefix,
  queryClient,
  url,
  children,
}: {
  trpc: typeof productionBackendTrpc
  keyPrefix: Environment
  queryClient: QueryClient
  url: string
  children: React.ReactNode
}) {
  const [trpcClient] = useState(() => buildClient(url))
  return (
    <trpc.TRPCProvider
      keyPrefix={keyPrefix}
      queryClient={queryClient}
      trpcClient={trpcClient}
    >
      {children}
    </trpc.TRPCProvider>
  )
}

function buildClient(url: string) {
  return createTRPCClient<BackendRouter>({
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
  })
}
