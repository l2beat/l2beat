import fs from 'node:fs'
import path from 'node:path'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { infer } from '../infer'
import { transfersToFacts } from '../transfersToFacts'
import { publicProcedure, router } from './trpc'

const TRANSFER_LIMIT = 10

export const appRouter = router({
  inferTokenCatalog: publicProcedure.query(async ({ ctx }) => {
    const transfers = await ctx.db.interopTransfer.getAll()
    const limited = transfers.slice(0, TRANSFER_LIMIT)

    const facts = transfersToFacts(limited)
    const rulesPath = path.join(__dirname, '..', 'rules.lp')
    const rules = fs.readFileSync(rulesPath, 'utf-8')

    const kb = await infer(facts, rules)

    return {
      transferCount: limited.length,
      facts: kb.facts,
    }
  }),
})

export type AppRouter = typeof appRouter
export type RouterOutputs = inferRouterOutputs<AppRouter>
export type RouterInputs = inferRouterInputs<AppRouter>
