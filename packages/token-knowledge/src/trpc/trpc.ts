import type { Database } from '@l2beat/database'
import { initTRPC, TRPCError } from '@trpc/server'

export interface AppContext {
  db: Database
  writeEnabled: boolean
}

export const createContext = (db: Database, writeEnabled: boolean) => () => ({
  db,
  writeEnabled,
})

const t = initTRPC.context<AppContext>().create({
  transformer: {
    serialize: JSON.stringify,
    deserialize: JSON.parse,
  },
})

export const router = t.router
export const createCallerFactory = t.createCallerFactory
export const publicProcedure = t.procedure
export const writeProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.writeEnabled) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Write operations are disabled on this server.',
    })
  }
  return next()
})
