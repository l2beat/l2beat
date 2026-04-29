import { TRPCError } from '@trpc/server'
import { publicProcedure } from './init'

export { publicProcedure }

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
