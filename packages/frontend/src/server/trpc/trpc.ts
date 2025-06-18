import { initTRPC } from '@trpc/server'
export const createTRPCContext = (opts: { headers: Headers }) => {
  return {
    ...opts,
  }
}

const t = initTRPC.context<typeof createTRPCContext>().create({
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
      },
    }
  },
})

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory

/**
 * Used to create a router in the tRPC API.
 */
export const router = t.router

/**
 * Used to define a procedure in the tRPC API.
 */
export const procedure = t.procedure
