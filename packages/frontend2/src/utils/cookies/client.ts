import Cookies from 'js-cookie'
import {
  type KnownCookieName,
  knownCookies,
  type KnownCookieValue,
} from '~/consts/cookies'
import { parseKnownCookie, serializeKnownCookie } from './common'

export function getCookie(name: KnownCookieName) {
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
