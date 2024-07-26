import { type z } from 'zod'
import {
  type KnownCookieName,
  knownCookies,
  type KnownCookieValue,
} from '~/consts/cookies'

/**
 * Parse a cookie value.
 * @param name known cookie name
 * @param value cookie value
 * @returns parsed value or default value if parsing fails
 */
export function parseKnownCookie<T extends KnownCookieName>({
  name,
  value,
}: { name: T; value: string }): KnownCookieValue<T> {
  const meta = knownCookies[name]
  try {
    const parsedValue: unknown = JSON.parse(value)
    return meta.schema.parse(parsedValue)
  } catch (e) {
    return meta.defaultValue
  }
}

/**
 * Serialize a cookie value.
 * @param name known cookie name
 * @param value cookie value
 * @returns serialized value
 */
export function serializeKnownCookie<T extends KnownCookieName>({
  name,
  value,
}: {
  name: KnownCookieName
  value: z.infer<(typeof knownCookies)[T]['schema']>
}): string {
  const meta = knownCookies[name]
  return JSON.stringify(meta.schema.parse(value))
}
