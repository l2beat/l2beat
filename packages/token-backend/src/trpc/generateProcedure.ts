import { initTRPC, TRPCError } from '@trpc/server'
import { jwtVerify } from 'jose'
import type { Config } from '../config/Config'
import { parseCookies } from '../utils/parseCookies'

export const createTRPCContext = (opts: { headers: Headers }) => {
  return {
    ...opts,
  }
}

type Context = Awaited<ReturnType<typeof createTRPCContext>>

export const trcpRoot = initTRPC.context<Context>().create({
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
export const createCallerFactory = trcpRoot.createCallerFactory

export function generateProcedure(
  config: Config,
  options: {
    acceptReadOnlyToken: boolean
    jwtVerifyFn?: typeof jwtVerify
  },
) {
  return trcpRoot.procedure.use(async (opts) => {
    // If there's no authentication configured (e.g. on local), pass-through
    const auth = config.auth
    if (auth === false) {
      return opts.next({ ctx: { email: 'dev@l2beat.com' } })
    }

    // Otherwise, check the cookie
    const headers = opts.ctx.headers
    const cookie = headers.get('cookie')
    if (!cookie) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        cause: 'missing authorization data',
      })
    }

    const cookies = parseCookies(cookie)
    const token = cookies['CF_Authorization']

    if (!token) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        cause: 'missing authorization method',
      })
    }

    // If the cookie is a prefefined read-only token,
    // accept if options.acceptReadOnly is true
    if (token === config.readOnlyAuthToken) {
      if (options.acceptReadOnlyToken) {
        return opts.next({ ctx: { email: 'dev-readonly@l2beat.com' } })
      }
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        cause: 'incorrect read-only token',
      })
    }

    // Otherwise check if it's a valid JWT cookie
    const { JWKS, teamDomain, aud } = auth
    const jwtVerifyFn = options.jwtVerifyFn ?? jwtVerify

    let decodedToken
    try {
      decodedToken = await jwtVerifyFn(token, JWKS, {
        issuer: teamDomain,
        audience: aud,
      })
    } catch {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        cause: 'JWT token verification failed',
      })
    }

    const { payload } = decodedToken
    return opts.next({ ctx: { email: payload.email as string } })
  })
}
