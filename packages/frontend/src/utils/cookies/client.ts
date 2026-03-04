import type { KnownCookieName, KnownCookieValue } from '~/consts/cookies'
import { knownCookies } from '~/consts/cookies'
import { parseCookies } from '~/server/utils/parseCookies'
import { parseKnownCookie, serializeKnownCookie } from './common'

export function getCookie<T extends KnownCookieName>(
  name: T,
): KnownCookieValue<T> {
  const meta = knownCookies[name]
  const cookies = parseCookies(document.cookie)
  const cookie = cookies[name]
  if (cookie === undefined) {
    return meta.defaultValue
  }
  return parseKnownCookie({ name, value: cookie })
}

export function setCookie<T extends KnownCookieName>(
  name: T,
  value: KnownCookieValue<T>,
) {
  const meta = knownCookies[name]
  const serialized = serializeKnownCookie({ name, value })
  const maxAge = 365 * 24 * 60 * 60 // 1 year
  document.cookie = `${meta.key}=${encodeURIComponent(serialized)}; path=/; max-age=${maxAge}; SameSite=Lax`
}
