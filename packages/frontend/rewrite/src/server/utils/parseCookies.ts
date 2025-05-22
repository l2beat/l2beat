import type { Request } from 'express'
import {
  type KnownCookieName,
  type KnownCookieValue,
  knownCookies,
} from '~/consts/cookies'
import { parseKnownCookie } from '~/utils/cookies/common'

export type KnownCookies = {
  [key in KnownCookieName]: KnownCookieValue<key>
}

export function parseCookies(req: Request): KnownCookies {
  const rawCookies = req.headers.cookie ?? ''

  const allowedCookies = Object.keys(knownCookies) as KnownCookieName[]

  const parsedCookies = Object.fromEntries(
    rawCookies
      .split('; ')
      .map((rawCookie) => {
        if (rawCookie === '') {
          return undefined
        }

        const [key, ...v] = rawCookie.split('=')
        if (!key) {
          throw new Error('Invalid cookie')
        }
        return [key, decodeURIComponent(v.join('='))] as const
      })
      .filter((cookie) => cookie !== undefined),
  )

  const parsedAllowedCookies = Object.fromEntries(
    allowedCookies
      .map((allowedCookie) => {
        const cookie = parsedCookies[allowedCookie]
        const meta = knownCookies[allowedCookie]
        if (!meta) {
          return undefined
        }
        if (cookie === undefined) {
          return [allowedCookie, meta.defaultValue] as const
        }

        return [
          allowedCookie,
          parseKnownCookie({
            name: allowedCookie,
            value: cookie,
          }),
        ] as const
      })
      .filter((x) => x !== undefined),
  )

  return parsedAllowedCookies as unknown as KnownCookies
}
