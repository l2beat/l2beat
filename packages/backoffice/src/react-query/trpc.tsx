import type { BackendRouter } from '@l2beat/backend/trpc'
import { QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink, loggerLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import type React from 'react'
import { useState } from 'react'
import {
  type Environment,
  useEnvironment,
} from '~/components/environment/EnvironmentContext'
import { createQueryClient } from './queryClient'

type Api = ReturnType<typeof createTRPCReact<BackendRouter>>

const productionBackendApi: Api = createTRPCReact<BackendRouter>()
const stagingBackendApi: Api = createTRPCReact<BackendRouter>()
const localBackendApi: Api = createTRPCReact<BackendRouter>()

const CLIENTS: Record<Environment, Api> = {
  production: productionBackendApi,
  staging: stagingBackendApi,
  local: localBackendApi,
}

export function useBackendApi(env?: Environment): Api {
  const { environment } = useEnvironment()
  return CLIENTS[env ?? environment]
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
        api={productionBackendApi}
        url={urls.production ?? '/trpc/production'}
      >
        <PinnedProvider
          api={stagingBackendApi}
          url={urls.staging ?? '/trpc/staging'}
        >
          {urls.local ? (
            <PinnedProvider api={localBackendApi} url={urls.local}>
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
  api,
  url,
  children,
}: {
  api: Api
  url: string
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => createQueryClient())
  const [trpcClient] = useState(() => buildClient(api, url))
  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      {children}
    </api.Provider>
  )
}

function buildClient(api: Api, url: string) {
  return api.createClient({
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
