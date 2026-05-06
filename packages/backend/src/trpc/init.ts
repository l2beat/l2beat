import { initTRPC } from '@trpc/server'
import type { BaseContext } from './context'

const t = initTRPC.context<BaseContext>().create({
  transformer: {
    serialize: JSON.stringify,
    deserialize: JSON.parse,
  },
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause,
        stack: process.env.NODE_ENV !== 'production' && shape.data.stack,
      },
    }
  },
})

export const router = t.router
export const mergeRouters = t.mergeRouters
export const createCallerFactory = t.createCallerFactory

export const publicProcedure = t.procedure
