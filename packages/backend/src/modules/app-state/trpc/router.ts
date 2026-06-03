import { AppStateKey, AppStatePair } from '@l2beat/database'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { router } from '../../../trpc/init'
import { protectedProcedure } from '../../../trpc/procedures'

export function createAppStateTrpcRouter() {
  return router({
    findByKey: protectedProcedure
      .input(AppStateKey)
      .query(async ({ ctx, input }) => {
        const value = await ctx.db.appState.findByKey(input)
        return value ?? null
      }),
    insert: protectedProcedure
      .input(AppStatePair)
      .mutation(async ({ ctx, input }) => {
        await ctx.db.appState.insert({
          key: input.key,
          value: input.value,
          updatedBy: ctx.session.email,
        })

        return { success: true }
      }),
    deleteByKey: protectedProcedure
      .input(AppStateKey)
      .mutation(async ({ ctx, input }) => {
        await ctx.db.appState.deleteByKey(input)

        return { success: true }
      }),
  })
}

export type AppStateTrpcRouter = ReturnType<typeof createAppStateTrpcRouter>
export type RouterOutputs = inferRouterOutputs<AppStateTrpcRouter>
export type RouterInputs = inferRouterInputs<AppStateTrpcRouter>
