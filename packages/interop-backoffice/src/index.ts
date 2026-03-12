export {
  getInteropBackofficeClient,
  type InteropBackOfficeClient,
} from './client'
export { createKoaMiddleware } from './server/koa-middleware'
export type { AppRouter, RouterInputs, RouterOutputs } from './trpc/appRouter'
export { createAppRouter } from './trpc/appRouter'
export { createTRPCContext } from './trpc/trpc'
