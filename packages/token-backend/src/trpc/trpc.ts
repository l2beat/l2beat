import { TRPCError } from '@trpc/server'
import { config } from '../config'
import { protectedProcedure, trcpRoot } from './protectedProcedure'

export const router = trcpRoot.router

export const readOnlyProcedure = protectedProcedure(config).use((opts) => {
  if (!opts.ctx.permissions.includes('read')) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      cause: 'insufficient access',
    })
  }
  return opts.next()
})

export const readWriteProcedure = protectedProcedure(config).use((opts) => {
  if (!opts.ctx.permissions.includes('write')) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      cause: 'insufficient access',
    })
  }
  return opts.next()
})
