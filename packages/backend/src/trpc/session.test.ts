import { expect, mockObject } from 'earl'
import type { jwtVerify } from 'jose'
import type {
  BackofficeAuthConfig,
  BackofficeZeroTrustAuthConfig,
} from '../config/Config'
import { getSession } from './session'

const BACKOFFICE_TOKEN = 'backoffice-token-abcd-1234'

/** Placeholder JWKS passed to jwtVerify; tests stub jwtVerifyFn so value is unused. */
const mockJwks = {} as BackofficeZeroTrustAuthConfig['JWKS']

const mockAuth = mockObject<BackofficeAuthConfig>({
  zeroTrust: mockObject<BackofficeZeroTrustAuthConfig>({
    JWKS: mockJwks,
    aud: 'test-audience',
    teamDomain: 'https://test.cloudflareaccess.com',
  }),
  authToken: BACKOFFICE_TOKEN,
})

describe(getSession.name, () => {
  it('works as expected when auth is disabled', async () => {
    const session = await getSession(new Headers(), false)

    expect(session).toEqual({
      email: 'dev@l2beat.com',
    })
  })

  it('returns undefined if auth is set but the token is invalid', async () => {
    const headers = new Headers([
      ['cookie', 'CF_Authorization=INVALID_READONLY_TOKEN'],
    ])
    const jwtVerifyFn = async () => {
      throw new Error('Incorrect JWT token')
    }

    const session = await getSession(headers, mockAuth, {
      jwtVerifyFn: jwtVerifyFn as typeof jwtVerify,
    })

    expect(session).toEqual(undefined)
  })

  it('returns a session if the jwt token is valid', async () => {
    const headers = new Headers([
      ['cookie', 'CF_Authorization=VALID_JWT_TOKEN'],
    ])
    const jwtVerifyFn = async () => {
      return {
        payload: {
          email: 'someone@l2beat.com',
        },
      } as unknown as Awaited<ReturnType<typeof jwtVerify>>
    }

    const session = await getSession(headers, mockAuth, {
      jwtVerifyFn: jwtVerifyFn as typeof jwtVerify,
    })

    expect(session).toEqual({
      email: 'someone@l2beat.com',
    })
  })

  it('returns undefined if no token is provided', async () => {
    const session = await getSession(new Headers(), mockAuth)

    expect(session).toEqual(undefined)
  })

  it('returns a session when the backoffice auth token matches (Authorization header)', async () => {
    const headers = new Headers([['Authorization', BACKOFFICE_TOKEN]])
    // jwt verifier should never be called when the static token matches
    const jwtVerifyFn = async () => {
      throw new Error('Should not be called')
    }

    const session = await getSession(headers, mockAuth, {
      jwtVerifyFn: jwtVerifyFn as typeof jwtVerify,
    })

    expect(session).toEqual({
      email: 'dev@l2beat.com',
    })
  })

  it('returns a session when the backoffice auth token matches (CF_Authorization cookie)', async () => {
    const headers = new Headers([
      ['cookie', `CF_Authorization=${BACKOFFICE_TOKEN}`],
    ])
    const jwtVerifyFn = async () => {
      throw new Error('Should not be called')
    }

    const session = await getSession(headers, mockAuth, {
      jwtVerifyFn: jwtVerifyFn as typeof jwtVerify,
    })

    expect(session).toEqual({
      email: 'dev@l2beat.com',
    })
  })

  it('falls back to JWT verification when the backoffice token does not match', async () => {
    const headers = new Headers([['Authorization', 'not-the-backoffice-token']])
    const jwtVerifyFn = async () => {
      return {
        payload: {
          email: 'someone@l2beat.com',
        },
      } as unknown as Awaited<ReturnType<typeof jwtVerify>>
    }

    const session = await getSession(headers, mockAuth, {
      jwtVerifyFn: jwtVerifyFn as typeof jwtVerify,
    })

    expect(session).toEqual({
      email: 'someone@l2beat.com',
    })
  })
})
