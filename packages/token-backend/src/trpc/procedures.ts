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

export const readOnlyProcedure = protectedProcedure.use((opts) => {
  if (!opts.ctx.session.permissions.includes('read')) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      cause: 'insufficient permissions',
    })
  }
  return opts.next()
})

export const readWriteProcedure = protectedProcedure.use((opts) => {
  if (!opts.ctx.session.permissions.includes('write')) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      cause: 'insufficient permissions',
    })
  }
  return opts.next()
})
