import { TRPCError, initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { ZodError } from 'zod'
import { getSession } from '../auth/cookie'

export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    ...opts,
    session: await getSession(),
  }
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
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
export const procedure = {
  public: t.procedure,
  private: t.procedure.use((opts) => {
    if (!opts.ctx.session) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }
    return opts.next({ ctx: opts.ctx })
  }),
}
