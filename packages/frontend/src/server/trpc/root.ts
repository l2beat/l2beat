import { createCallerFactory, router } from '~/server/trpc/trpc'
import { activityRouter } from './routers/activity'
import { costsRouter } from './routers/costs'
import { daRouter } from './routers/da'
import { livenessRouter } from './routers/liveness'
import { tvsRouter } from './routers/tvs'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = router({
  activity: activityRouter,
  costs: costsRouter,
  tvs: tvsRouter,
  da: daRouter,
  liveness: livenessRouter,
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
