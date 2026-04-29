import { expect, mockObject } from 'earl'
import type { jwtVerify } from 'jose'
import { type AuthCredentials, getSession } from './session'

const mockAuth = mockObject<AuthCredentials>({
  JWKS: undefined,
  aud: undefined,
  teamDomain: undefined,
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
})
