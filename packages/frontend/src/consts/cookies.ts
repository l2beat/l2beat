import { type Parser, type Validator, v as z } from '@l2beat/validate'

/**
 * Known cookie definitions.
 */
export const knownCookies = {
  // example: knownCookie('example', z.string(), 'example'),
  recategorisationPreview: knownCookie(
    'recategorisationPreview',
    z.boolean(),
    false,
  ),
} as const

/**
 * Helper function to define a known cookie. `satisfies` can't be used because it doesn't enforce type between schema and inferred type of default value.
 * @param key cookie name
 * @param schema cookie schema
 * @param defaultValue default value (required!)
 * @returns an object that can be used in `knownCookies` object
 */
function knownCookie<TT, T extends Parser<TT> | Validator<TT>>(
  key: string,
  schema: T,
  defaultValue: z.infer<T>,
) {
  return { key, schema, defaultValue }
}

export type KnownCookieName = keyof typeof knownCookies
export type KnownCookieValue<T extends KnownCookieName> =
  (typeof knownCookies)[T]['defaultValue']
