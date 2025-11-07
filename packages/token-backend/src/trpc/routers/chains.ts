import type { TokenDatabase } from '@l2beat/database'
import { db } from '../../database/db'
import { readOnlyProcedure, router } from '../trpc'

export interface ChainsRouterDeps {
  db: TokenDatabase
}

export function createChainsRouter(deps: ChainsRouterDeps) {
  const { db } = deps

  return router({
    getAll: readOnlyProcedure.query(() => {
      return db.chain.getAll()
    }),
  })
}

export const chainsRouter = createChainsRouter({
  db,
})
