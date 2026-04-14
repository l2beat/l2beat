import fs from 'node:fs'
import path from 'node:path'
import { v } from '@l2beat/validate'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { importTransferFacts } from '../importTransferFacts'
import { infer } from '../infer'
import { publicProcedure, router } from './trpc'

const rulesPath = path.join(__dirname, '..', 'rules.lp')

export const appRouter = router({
  importFacts: publicProcedure.mutation(({ ctx }) => {
    return importTransferFacts(ctx.db)
  }),

  clearFacts: publicProcedure.mutation(async ({ ctx }) => {
    const deleted = await ctx.db.tokenFactInput.deleteAll()
    return { deleted }
  }),

  infer: publicProcedure.query(async ({ ctx }) => {
    const allFacts = await ctx.db.tokenFactInput.getAll()
    const factsProgram = allFacts
      .map((f) => `${f.name}(${f.arguments}).`)
      .join('\n')

    const rules = fs.readFileSync(rulesPath, 'utf-8')
    const kb = await infer(factsProgram, rules)

    return {
      inputFactCount: allFacts.length,
      facts: kb.facts,
    }
  }),

  getRules: publicProcedure.query(() => {
    return { content: fs.readFileSync(rulesPath, 'utf-8') }
  }),

  saveRules: publicProcedure
    .input(v.object({ content: v.string() }))
    .mutation(({ input }) => {
      fs.writeFileSync(rulesPath, input.content, 'utf-8')
      return { ok: true }
    }),

  searchTokens: publicProcedure
    .input(v.object({ query: v.string() }))
    .query(() => {
      return { results: [] as { fact: string; params: string[] }[] }
    }),
})

export type AppRouter = typeof appRouter
export type RouterOutputs = inferRouterOutputs<AppRouter>
export type RouterInputs = inferRouterInputs<AppRouter>
