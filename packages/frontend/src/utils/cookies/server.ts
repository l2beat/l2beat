import 'server-only'

import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { cookies } from 'next/headers'
import type { KnownCookieName, KnownCookieValue } from '~/consts/cookies'
import { knownCookies } from '~/consts/cookies'
import { parseKnownCookie, serializeKnownCookie } from './common'

export async function getCookie<T extends KnownCookieName>(
  name: T,
): Promise<KnownCookieValue<T>> {
  const meta = knownCookies[name]
  const cookie = (await cookies()).get(meta.key)
  if (cookie === undefined) {
    return meta.defaultValue
  }
  return parseKnownCookie({ name, value: cookie.value })
}

export async function setCookie<T extends KnownCookieName>(
  name: T,
  value: KnownCookieValue<T>,
  options: Partial<ResponseCookie>,
) {
  const meta = knownCookies[name]
  const cookie = await cookies()
  cookie.set(meta.key, serializeKnownCookie({ name, value }), options)
}
