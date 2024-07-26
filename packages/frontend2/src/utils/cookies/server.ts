import 'server-only'
import { cookies } from 'next/headers'
import {
  type KnownCookieName,
  knownCookies,
  type KnownCookieValue,
} from '~/consts/cookies'
import { parseKnownCookie, serializeKnownCookie } from './common'
import { type ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'

export function getCookie(name: KnownCookieName) {
  const meta = knownCookies[name]
  const cookie = cookies().get(meta.key)
  if (cookie === undefined) {
    return meta.defaultValue
  }
  return parseKnownCookie({ name, value: cookie.value })
}

export function setCookie<T extends KnownCookieName>(
  name: T,
  value: KnownCookieValue<T>,
  options: Partial<ResponseCookie>,
) {
  const meta = knownCookies[name]
  cookies().set(meta.key, serializeKnownCookie({ name, value }), options)
}
