import { TRPCError } from '@trpc/server'
import { trcpRoot } from './trpc'

export const publicProcedure = trcpRoot.procedure

export const protectedProcedure = publicProcedure.use((opts) => {
  if (!opts.ctx.session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      cause: 'insufficient access',
    })
  }

  return opts.next({
    ctx: {
      ...opts.ctx,
      session: opts.ctx.session,
    },
  })
})
