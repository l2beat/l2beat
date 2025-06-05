import type { DehydratedState } from '@tanstack/react-query'
import { createServerSideHelpers } from '@trpc/react-query/server'
import { createHydrationHelpers } from '@trpc/react-query/rsc'
import { type AppRouter, createCaller, appRouter } from '~/server/trpc/root'
import { createQueryClient } from './queryClient'
import { createTRPCContext } from '~/server/trpc/trpc'

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
    queryClient: createQueryClient(),
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

export type WithDehydratedState<T> = {
  data: T
  queryState: DehydratedState
}

export const mergeDehydratedStates = (
  ...states: (DehydratedState | undefined)[]
) => {
  return states.reduce(
    (acc: DehydratedState, state) => {
      if (state) {
        acc.mutations.push(...state.mutations)
        acc.queries.push(...state.queries)
      }
      return acc
    },
    {
      mutations: [],
      queries: [],
    },
  )
}
