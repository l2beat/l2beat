import { v } from '@l2beat/validate'
import { ChainRecord, ChainUpdateSchema } from '../../schemas/Chain'
import { readOnlyProcedure, readWriteProcedure } from '../procedures'
import { router } from '../trpc'

export const chainsRouter = router({
  getAll: readOnlyProcedure.query(({ ctx }) => ctx.db.chain.getAll()),
  getByName: readOnlyProcedure
    .input(v.string())
    .query(async ({ input, ctx }) => {
      const result = await ctx.db.chain.findByName(input)
      return result ?? null
    }),
  insert: readWriteProcedure
    .input(ChainRecord)
    .mutation(async ({ input, ctx }) => {
      await ctx.db.chain.insert(input)
      return { success: true }
    }),
  update: readWriteProcedure
    .input(
      v.object({
        name: v.string(),
        update: ChainUpdateSchema,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db.chain.updateByName(input.name, input.update)
      if (result === 0) {
        throw new Error(`Chain with name "${input.name}" not found`)
      }
      return { success: true }
    }),
  delete: readWriteProcedure
    .input(v.object({ name: v.string() }))
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db.chain.deleteByName(input.name)
      if (result === 0) {
        throw new Error(`Chain with name "${input.name}" not found`)
      }
      return { success: true }
    }),
})
