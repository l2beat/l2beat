import { createHydrationHelpers } from '@trpc/react-query/rsc'
import { createServerSideHelpers } from '@trpc/react-query/server'
import { cache } from 'react'

import type { AppRouter } from 'rewrite/src/server/trpc/root'
import { appRouter, createCaller } from 'rewrite/src/server/trpc/root'
import { createTRPCContext } from 'rewrite/src/server/trpc/trpc'
import { createQueryClient } from './query-client'

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers()
  heads.set('x-trpc-source', 'rsc')

  return createTRPCContext({
    headers: heads,
  })
})

const getQueryClient = cache(createQueryClient)
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      serialize: (data) => data,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      deserialize: (data) => data,
    },
  })
