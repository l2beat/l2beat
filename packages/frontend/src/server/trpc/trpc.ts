import { trpcTransformer } from '@l2beat/shared-pure'
import { initTRPC } from '@trpc/server'
export const createTRPCContext = (opts: { headers: Headers }) => {
  return {
    ...opts,
  }
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: trpcTransformer,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause,
      },
    }
  },
})

/**
 * Used to create a router in the tRPC API.
 */
export const router = t.router

/**
 * Used to define a procedure in the tRPC API.
 */
export const procedure = t.procedure
