import { initTRPC, TRPCError } from '@trpc/server'
import { jwtVerify } from 'jose'
import { config } from '../config'
import { parseCookies } from '../utils/parseCookies'

export const createTRPCContext = (opts: { headers: Headers }) => {
  return {
    ...opts,
  }
}

type Context = Awaited<ReturnType<typeof createTRPCContext>>

const t = initTRPC.context<Context>().create({
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
const publicProcedure = t.procedure

export const protectedProcedure = publicProcedure.use(async (opts) => {
  const auth = config.auth
  if (auth === false) {
    return opts.next({
      ctx: {
        email: 'dev@l2beat.com',
      },
    })
  }
  const headers = opts.ctx.headers
  const cookie = headers.get('cookie')
  if (!cookie) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  const cookies = parseCookies(cookie)
  const token = cookies['CF_Authorization']

  if (!token) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  const { JWKS, teamDomain, aud } = auth
  const decodedToken = await jwtVerify(token, JWKS, {
    issuer: teamDomain,
    audience: aud,
  })
  if (!decodedToken) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  const { payload } = decodedToken

  return opts.next({
    ctx: {
      email: payload.email as string,
    },
  })
})
