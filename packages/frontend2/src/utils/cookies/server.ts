import 'server-only'

import { type ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { cookies } from 'next/headers'
import {
  type KnownCookieName,
  type KnownCookieValue,
  knownCookies,
} from '~/consts/cookies'
import { parseKnownCookie, serializeKnownCookie } from './common'

export function getCookie<T extends KnownCookieName>(
  name: T,
): KnownCookieValue<T> {
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
