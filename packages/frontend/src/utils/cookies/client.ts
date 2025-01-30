import Cookies from 'js-cookie'
import type { KnownCookieName, KnownCookieValue } from '~/consts/cookies'
import { knownCookies } from '~/consts/cookies'
import { parseKnownCookie, serializeKnownCookie } from './common'

export function getCookie<T extends KnownCookieName>(
  name: T,
): KnownCookieValue<T> {
  const meta = knownCookies[name]
  const cookie = Cookies.get(meta.key)
  if (cookie === undefined) {
    return meta.defaultValue
  }
  return parseKnownCookie({ name, value: cookie })
}

export function setCookie<T extends KnownCookieName>(
  name: T,
  value: KnownCookieValue<T>,
  options: Cookies.CookieAttributes = {},
) {
  const meta = knownCookies[name]
  Cookies.set(meta.key, serializeKnownCookie({ name, value }), options)
}
