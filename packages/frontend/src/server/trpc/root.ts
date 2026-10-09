import { router } from '~/server/trpc/trpc'
import { activityRouter } from './routers/activity'
import { auditsRouter } from './routers/audits'
import { costsRouter } from './routers/costs'
import { daRouter } from './routers/da'
import { defiRouter } from './routers/defi'
import { interopRouter } from './routers/interop'
import { livenessRouter } from './routers/liveness'
import { privacyRouter } from './routers/privacy'
import { projectsRouter } from './routers/projects'
import { searchBarRouter } from './routers/searchBar'
import { tokensRouter } from './routers/tokens'
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
  defi: defiRouter,
  liveness: livenessRouter,
  projects: projectsRouter,
  searchBar: searchBarRouter,
  interop: interopRouter,
  privacy: privacyRouter,
  tokens: tokensRouter,
  audits: auditsRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
