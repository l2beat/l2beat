import { type z } from 'zod'
import { type KnownCookieName, knownCookies } from '~/consts/cookies'

/**
 * Parse a cookie value.
 * @param name known cookie name
 * @param value cookie value
 * @returns parsed value or default value if parsing fails
 */
export function parseKnownCookie({
  name,
  value,
}: { name: KnownCookieName; value: string }) {
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
}) {
  const meta = knownCookies[name]
  return JSON.stringify(meta.schema.parse(value))
}
