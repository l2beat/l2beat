import { createHash } from 'node:crypto'
import { v } from '@l2beat/validate'

export interface PageCursor {
  timestamp: number
  id: string
}

/**
 * Keyset cursors are only meaningful for the exact filter set that produced
 * them - reusing one with different filters would silently interleave two
 * result sets. The fingerprint lets us reject that with a 400 instead.
 */
export function fingerprintFilters(
  filters: Record<string, string | number | undefined>,
): string {
  const canonical = Object.entries(filters)
    .filter(([, value]) => value !== undefined)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  return createHash('sha256').update(canonical).digest('hex').slice(0, 12)
}

export function encodeCursor(cursor: PageCursor, fingerprint: string): string {
  const payload = JSON.stringify({
    t: cursor.timestamp,
    i: cursor.id,
    f: fingerprint,
  })

  return Buffer.from(payload, 'utf8').toString('base64url')
}

export type DecodeCursorResult =
  | { ok: true; cursor: PageCursor }
  | { ok: false; reason: 'malformed' | 'filtersChanged' }

const CursorPayload = v.object({
  t: v.number().check(Number.isSafeInteger),
  i: v.string(),
  f: v.string(),
})

export function decodeCursor(
  raw: string,
  fingerprint: string,
): DecodeCursorResult {
  let decoded: unknown
  try {
    decoded = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8'))
  } catch {
    return { ok: false, reason: 'malformed' }
  }

  const payload = CursorPayload.safeParse(decoded)
  if (!payload.success) {
    return { ok: false, reason: 'malformed' }
  }

  if (payload.data.f !== fingerprint) {
    return { ok: false, reason: 'filtersChanged' }
  }

  return { ok: true, cursor: { timestamp: payload.data.t, id: payload.data.i } }
}
