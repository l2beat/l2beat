import type { Database } from '@l2beat/database'
import { initTRPC } from '@trpc/server'

export interface AppContext {
  db: Database
}

export const createContext = (db: Database) => () => ({ db })

const t = initTRPC.context<AppContext>().create({
  transformer: {
    serialize: JSON.stringify,
    deserialize: JSON.parse,
  },
})

export const router = t.router
export const publicProcedure = t.procedure
