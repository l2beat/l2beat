import { createHydrationHelpers } from '@trpc/react-query/rsc'
import { createServerSideHelpers } from '@trpc/react-query/server'

import type { AppRouter } from '~/server/trpc/root'
import { appRouter, createCaller } from '~/server/trpc/root'
import { createTRPCContext } from '~/server/trpc/trpc'
import { createQueryClient } from './query-client'

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = () => {
  const heads = new Headers()
  heads.set('x-trpc-source', 'rsc')

  return createTRPCContext({
    headers: heads,
  })
}

const getQueryClient = createQueryClient
const caller = createCaller(createContext)

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient,
)

export type ExpressHelpers = ReturnType<typeof getExpressHelpers>
export const getExpressHelpers = () =>
  createServerSideHelpers({
    router: appRouter,
    queryClient: getQueryClient(),
    ctx: { headers: new Headers() },
    // Do not serialize data to JSON, because it will be serialized again by the render function
    //     .replace(
    //       `<!--ssr-data-->`,
    //       `window.__SSR_DATA__=${JSON.stringify(data.ssr)}`,
    //     )
    transformer: {
      serialize: (data) => data,
      deserialize: (data) => data,
    },
  })
