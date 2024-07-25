import { z } from 'zod'
import { createCallerFactory, procedure, router } from '~/server/api/trpc'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = router({
  cookiesPrefetchPoC: procedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query(({ input }) => `Hello ${input.text}`),
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
