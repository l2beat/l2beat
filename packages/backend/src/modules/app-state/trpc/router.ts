import { AppStateKey, AppStatePair } from '@l2beat/database'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { router } from '../../../trpc/init'
import { protectedProcedure } from '../../../trpc/procedures'

export function createAppStateTrpcRouter() {
  return router({
    get: protectedProcedure.input(AppStateKey).query(async ({ ctx, input }) => {
      const value = await ctx.db.appState.get(input)
      return value ?? null
    }),
    set: protectedProcedure
      .input(AppStatePair)
      .mutation(async ({ ctx, input }) => {
        await ctx.db.appState.set({
          key: input.key,
          value: input.value,
          updatedBy: ctx.session.email,
        })

        return { success: true }
      }),
  })
}

export type AppStateTrpcRouter = ReturnType<typeof createAppStateTrpcRouter>
export type RouterOutputs = inferRouterOutputs<AppStateTrpcRouter>
export type RouterInputs = inferRouterInputs<AppStateTrpcRouter>
