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
  const parsedCookies = Object.fromEntries(
    rawCookies
      .split('; ')
      .map((rawCookie) => {
        const [key, ...v] = rawCookie.split('=')
        if (!key) {
          throw new Error('Invalid cookie')
        }
        const meta = knownCookies[key as KnownCookieName]
        if (!meta) {
          return undefined
        }
        const cookie = decodeURIComponent(v.join('='))
        if (cookie === undefined) {
          return [key, meta.defaultValue] as const
        }

        return [
          key,
          parseKnownCookie({ name: key as KnownCookieName, value: cookie }),
        ] as const
      })
      .filter((x) => x !== undefined),
  )

  return parsedCookies as unknown as KnownCookies
}
