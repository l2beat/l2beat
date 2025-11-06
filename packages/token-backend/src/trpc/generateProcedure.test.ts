import { expect, mockObject } from 'earl'
import type { jwtVerify } from 'jose'
import type { AuthConfig, Config } from '../config/Config'
import {
  createCallerFactory,
  generateProcedure,
  trcpRoot,
} from './generateProcedure'

const READ_ONLY_TOKEN = 'read-only-token-abcd-1234'

const mockConfig = mockObject<Config>({
  auth: mockObject<AuthConfig>({
    JWKS: undefined,
    aud: undefined,
    teamDomain: undefined,
  }),
  readOnlyAuthToken: READ_ONLY_TOKEN,
})

describe(generateProcedure.name, () => {
  it('works as expected when auth is undefined', async () => {
    const mockNonAuthConfig = mockObject<Config>({
      auth: false,
    })

    const caller = generateCaller(mockNonAuthConfig, new Headers(), {
      failJwtToken: true,
    })

    const resultReadOnly = await caller.whoamiReadOnly()
    const resultProtected = await caller.whoamiProtected()

    expect(resultReadOnly).toEqual('dev@l2beat.com')
    expect(resultProtected).toEqual('dev@l2beat.com')
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

    const resultReadOnly = caller.whoamiReadOnly()
    const resultProtected = caller.whoamiProtected()

    await expect(resultReadOnly).toBeRejectedWith(
      'JWT token verification failed',
    )
    await expect(resultProtected).toBeRejectedWith(
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

    const resultReadOnly = await caller.whoamiReadOnly()
    const resultProtected = await caller.whoamiProtected()

    expect(resultReadOnly).toEqual('someone@l2beat.com')
    expect(resultProtected).toEqual('someone@l2beat.com')
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

    const resultReadOnly = await caller.whoamiReadOnly()
    const resultProtected = caller.whoamiProtected

    expect(resultReadOnly).toEqual('dev-readonly@l2beat.com')
    await expect(resultProtected).toBeRejectedWith('incorrect read-only token')
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

  const readOnlyProcedure = generateProcedure(config, {
    acceptReadOnlyToken: true,
    jwtVerifyFn,
  })

  const protectedProcedure = generateProcedure(config, {
    acceptReadOnlyToken: false,
    jwtVerifyFn,
  })

  const appRouter = trcpRoot.router({
    whoamiReadOnly: readOnlyProcedure.query(({ ctx }) => ctx.email),
    whoamiProtected: protectedProcedure.query(({ ctx }) => ctx.email),
  })

  const callerFactory = createCallerFactory(appRouter)
  return callerFactory({ headers })
}
