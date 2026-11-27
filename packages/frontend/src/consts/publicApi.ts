import { UnixTime } from '@l2beat/shared-pure'

/**
 * The public data API (`packages/public-api`). Only this host is published;
 * api.l2beat.com redirects to it.
 */
export const PUBLIC_API_URL = 'https://api.ethbeat.org'
export const PUBLIC_API_DOCS_URL = `${PUBLIC_API_URL}/docs`

/** The old public API, served by this app and replaced by the one above. */
export const OLD_PUBLIC_API_PATH = '/api/scaling'

/** The day the old API began announcing its retirement. */
export const OLD_PUBLIC_API_DEPRECATED_AT = utcDay('2026-11-27')

/**
 * The moment the old API stops answering. The response headers, the migration
 * guide and the brownout schedule all derive from this one value, so moving
 * the sunset means changing only this line.
 */
export const OLD_PUBLIC_API_SUNSET_AT = utcDay('2026-12-15')

export const API_MIGRATION_GUIDE_PATH = '/api-migration' as const

function utcDay(day: `${number}-${number}-${number}`): UnixTime {
  return UnixTime.fromDate(new Date(`${day}T00:00:00Z`))
}

/** A UTC date like "15 December 2026", the form the guide and the 410 bodies share. */
export function formatSunsetDate(timestamp: UnixTime): string {
  return UnixTime.toDate(timestamp).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
