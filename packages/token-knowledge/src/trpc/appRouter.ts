import { v } from '@l2beat/validate'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { getRulesContent } from '../getRules'
import { importTransferFacts } from '../importTransferFacts'
import { infer } from '../infer'
import { publicProcedure, router, writeProcedure } from './trpc'

export const appRouter = router({
  getConfig: publicProcedure.query(({ ctx }) => {
    return { writeEnabled: ctx.writeEnabled }
  }),

  importFacts: writeProcedure.mutation(({ ctx }) => {
    return importTransferFacts(ctx.db)
  }),

  clearFacts: writeProcedure.mutation(async ({ ctx }) => {
    const deleted = await ctx.db.tokenFactInput.deleteAll()
    return { deleted }
  }),

  infer: publicProcedure
    .input(v.object({ rules: v.string() }))
    .query(async ({ ctx, input }) => {
      const allFacts = await ctx.db.tokenFactInput.getAll()
      const factsProgram = allFacts
        .map((f) => `${f.name}(${f.arguments}).`)
        .join('\n')

      const inferredFacts = await infer(factsProgram, input.rules)

      return {
        inputFactCount: allFacts.length,
        facts: inferredFacts,
      }
    }),

  getRules: publicProcedure.query(() => {
    return { content: getRulesContent(__dirname) }
  }),
})

export type AppRouter = typeof appRouter
export type RouterOutputs = inferRouterOutputs<AppRouter>
export type RouterInputs = inferRouterInputs<AppRouter>
