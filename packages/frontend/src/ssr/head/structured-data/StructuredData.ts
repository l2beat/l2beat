import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'

/** A schema.org JSON-LD block, rendered as one `<script>` in the page head. */
export interface StructuredData {
  '@context': 'https://schema.org'
  '@type': string
  [property: string]: unknown
}

export function withSchemaOrgContext<T extends { '@type': string }>(data: T) {
  return { '@context': 'https://schema.org' as const, ...data }
}

/**
 * Canonical and structured data links name the production page, even when
 * staging or a preview rendered it.
 */
export function toProductionUrl(path: string) {
  return PRODUCTION_ORIGIN + path
}
