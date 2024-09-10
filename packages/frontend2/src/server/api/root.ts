import { createCallerFactory, router } from '~/server/api/trpc'
import { activityRouter } from './routers/activity'
import { costsRouter } from './routers/costs'
import { tvlRouter } from './routers/tvl'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = router({
  tvl: tvlRouter,
  costs: costsRouter,
  activity: activityRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.example.hello({ text: "world" });
 *       ^? string = "Hello world"
 */
export const createCaller = createCallerFactory(appRouter)
