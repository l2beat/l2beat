import { KeyValueKey, KeyValuePair } from '@l2beat/database'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { router } from '../../../trpc/init'
import { protectedProcedure } from '../../../trpc/procedures'

export function createKeyValueTrpcRouter() {
  return router({
    get: protectedProcedure.input(KeyValueKey).query(async ({ ctx, input }) => {
      const value = await ctx.db.keyValue.get(input)
      return value ?? null
    }),
    set: protectedProcedure
      .input(KeyValuePair)
      .mutation(async ({ ctx, input }) => {
        await ctx.db.keyValue.set({
          key: input.key,
          value: input.value,
          updatedBy: ctx.session.email,
        })

        return { success: true }
      }),
  })
}

export type KeyValueTrpcRouter = ReturnType<typeof createKeyValueTrpcRouter>
export type RouterOutputs = inferRouterOutputs<KeyValueTrpcRouter>
export type RouterInputs = inferRouterInputs<KeyValueTrpcRouter>
