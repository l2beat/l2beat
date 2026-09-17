import type { jwtVerify } from 'jose'
import { describe, expect, it } from 'vitest'
import type { AuthConfig, Config } from '../config/Config'
import { getSession } from './getSession'

const READ_ONLY_TOKEN = 'read-only-token-abcd-1234'

const mockConfig = {
  auth: {
    JWKS: undefined,
    aud: undefined,
    teamDomain: undefined,
  } as unknown as AuthConfig,
  readOnlyAuthToken: READ_ONLY_TOKEN,
} as unknown as Config

describe(getSession.name, () => {
  it('works as expected when auth is undefined', async () => {
    const mockNonAuthConfig = {
      auth: false,
    } as unknown as Config

    const session = await getSession(new Headers(), mockNonAuthConfig)

    expect(session).toStrictEqual({
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

    expect(result).toStrictEqual(undefined)
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

    expect(session).toStrictEqual({
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

    expect(session).toStrictEqual({
      email: 'dev-readonly@l2beat.com',
      permissions: ['read'],
    })
  })

  it('returns undefined if no token is provided', async () => {
    const headers = new Headers()

    const session = await getSession(headers, mockConfig)

    expect(session).toStrictEqual(undefined)
  })
})
