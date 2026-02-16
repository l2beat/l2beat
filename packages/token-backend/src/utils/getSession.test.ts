import { expect, mockObject } from 'earl'
import type { jwtVerify } from 'jose'
import type { AuthConfig, Config } from '../config/Config'
import { getSession } from './getSession'

const READ_ONLY_TOKEN = 'read-only-token-abcd-1234'
const READ_ONLY_TOKEN_2 = 'read-only-token-zxyw-9876'

const mockConfig = mockObject<Config>({
  auth: mockObject<AuthConfig>({
    JWKS: undefined,
    aud: undefined,
    teamDomain: undefined,
  }),
  readOnlyAuthTokens: [READ_ONLY_TOKEN, READ_ONLY_TOKEN_2],
})

describe(getSession.name, () => {
  it('works as expected when auth is undefined', async () => {
    const mockNonAuthConfig = mockObject<Config>({
      auth: false,
    })

    const session = await getSession(new Headers(), mockNonAuthConfig)

    expect(session).toEqual({
      email: 'dev@l2beat.com',
      permissions: ['read', 'write'],
    })
  })

  it('returns undefined if auth is set but no correct token is set', async () => {
    // invalid read-only token
    const headers = new Headers([
      ['cookie', 'CF_Authorization=INVALID_READONLY_TOKEN'],
    ])
    // correct JWT token
    const jwtVerifyFn = async () => {
      throw new Error('Incorrect JWT token')
    }

    const result = await getSession(headers, mockConfig, {
      jwtVerifyFn: jwtVerifyFn as typeof jwtVerify,
    })

    expect(result).toEqual(undefined)
  })

  it('returns session if auth is set but no correct token is set', async () => {
    // invalid read-only token
    const headers = new Headers([
      ['cookie', 'CF_Authorization=INVALID_READONLY_TOKEN'],
    ])
    // correct JWT token
    const jwtVerifyFn = async () => {
      return {
        payload: {
          email: 'someone@l2beat.com',
        },
      } as unknown as Awaited<ReturnType<typeof jwtVerify>>
    }

    const session = await getSession(headers, mockConfig, {
      jwtVerifyFn: jwtVerifyFn as typeof jwtVerify,
    })

    expect(session).toEqual({
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
    const jwtVerifyFn = async () => {
      throw new Error('Incorrect JWT token')
    }

    const session = await getSession(headers, mockConfig, {
      jwtVerifyFn: jwtVerifyFn as typeof jwtVerify,
    })

    expect(session).toEqual({
      email: 'dev-readonly@l2beat.com',
      permissions: ['read'],
    })
  })

  it('works as expected for another read-only token', async () => {
    const headers = new Headers([
      ['cookie', `CF_Authorization=${READ_ONLY_TOKEN_2}`],
    ])
    const jwtVerifyFn = async () => {
      throw new Error('Incorrect JWT token')
    }

    const session = await getSession(headers, mockConfig, {
      jwtVerifyFn,
    })

    expect(session).toEqual({
      email: 'dev-readonly@l2beat.com',
      permissions: ['read'],
    })
  })

  it('returns undefined if no token is provided', async () => {
    const headers = new Headers()

    const session = await getSession(headers, mockConfig)

    expect(session).toEqual(undefined)
  })
})
