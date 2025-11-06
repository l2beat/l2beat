import { expect, mockObject } from 'earl'
import type { jwtVerify } from 'jose'
import type { AuthConfig, Config } from '../config/Config'
import {
  createCallerFactory,
  protectedProcedure,
  trcpRoot,
} from './protectedProcedure'

const READ_ONLY_TOKEN = 'read-only-token-abcd-1234'

const mockConfig = mockObject<Config>({
  auth: mockObject<AuthConfig>({
    JWKS: undefined,
    aud: undefined,
    teamDomain: undefined,
  }),
  readOnlyAuthToken: READ_ONLY_TOKEN,
})

describe(protectedProcedure.name, () => {
  it('works as expected when auth is undefined', async () => {
    const mockNonAuthConfig = mockObject<Config>({
      auth: false,
    })

    const caller = generateCaller(mockNonAuthConfig, new Headers(), {
      failJwtToken: true,
    })

    expect(await caller.whoami()).toEqual({
      email: 'dev@l2beat.com',
      permissions: ['read', 'write'],
    })
  })

  it('fails if auth is set but no correct token is set', async () => {
    // invalid read-only token
    const headers = new Headers([
      ['cookie', 'CF_Authorization=INVALID_READONLY_TOKEN'],
    ])
    // correct JWT token
    const caller = generateCaller(mockConfig, headers, {
      failJwtToken: true,
    })

    await expect(caller.whoami).toBeRejectedWith(
      'JWT token verification failed',
    )
  })

  it('works for wrong read-only token but correct JWT token', async () => {
    // invalid read-only token
    const headers = new Headers([
      ['cookie', 'CF_Authorization=INVALID_READONLY_TOKEN'],
    ])
    // correct JWT token
    const caller = generateCaller(mockConfig, headers, {
      failJwtToken: false,
    })

    expect(await caller.whoami()).toEqual({
      email: 'someone@l2beat.com',
      permissions: ['read', 'write'],
    })
  })

  it('works as expected for read-only token', async () => {
    // correct read-only token
    const headers = new Headers([
      ['cookie', `CF_Authorization=${READ_ONLY_TOKEN}`],
    ])
    // invalid JWT token
    const caller = generateCaller(mockConfig, headers, {
      failJwtToken: true,
    })

    expect(await caller.whoami()).toEqual({
      email: 'dev-readonly@l2beat.com',
      permissions: ['read'],
    })
  })
})

function generateCaller(
  config: Config,
  headers: Headers,
  options: { failJwtToken: boolean },
) {
  const jwtVerifyFn = async () => {
    if (options.failJwtToken) {
      throw new Error('Incorrect JWT token')
    }
    return {
      payload: {
        email: 'someone@l2beat.com',
      },
    } as unknown as Awaited<ReturnType<typeof jwtVerify>>
  }

  const appRouter = trcpRoot.router({
    whoami: protectedProcedure(config, { jwtVerifyFn }).query(({ ctx }) => ({
      email: ctx.email,
      permissions: ctx.permissions,
    })),
  })

  const callerFactory = createCallerFactory(appRouter)
  return callerFactory({ headers })
}
