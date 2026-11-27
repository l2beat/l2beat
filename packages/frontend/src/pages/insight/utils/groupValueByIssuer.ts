import { assert } from '@l2beat/shared-pure'
import type { InsightHolding } from '~/server/features/insight/InsightReport'

export type IssuerSegment =
  | { kind: 'issuer'; issuer: string; valueUsd: number }
  /** Issuers past the named ones, merged so the bar stays readable. */
  | { kind: 'others'; issuerCount: number; valueUsd: number }
  /** Holdings token-db records no issuer for. */
  | { kind: 'none'; valueUsd: number }

/**
 * Priced value per issuer, largest first. The biggest `namedCountMax` issuers
 * keep their name; the rest merge into one segment. Holdings with no issuer
 * stay apart and come last, because "nobody recorded" is not an issuer.
 */
export function groupValueByIssuer(
  holdings: InsightHolding[],
  namedCountMax: number,
): IssuerSegment[] {
  assert(namedCountMax >= 1, 'At least one issuer is named')
  const valueByIssuer = new Map<string, number>()
  let noIssuerValueUsd = 0
  for (const holding of holdings) {
    if (holding.valueUsd === null || holding.valueUsd <= 0) continue
    if (holding.issuer === null) {
      noIssuerValueUsd += holding.valueUsd
      continue
    }
    const sum = valueByIssuer.get(holding.issuer) ?? 0
    valueByIssuer.set(holding.issuer, sum + holding.valueUsd)
  }

  const ranked = [...valueByIssuer].sort((a, b) => b[1] - a[1])
  const segments: IssuerSegment[] = ranked
    .slice(0, namedCountMax)
    .map(([issuer, valueUsd]) => ({ kind: 'issuer', issuer, valueUsd }))
  const rest = ranked.slice(namedCountMax)
  if (rest.length > 0) {
    segments.push({
      kind: 'others',
      issuerCount: rest.length,
      valueUsd: rest.reduce((sum, [, valueUsd]) => sum + valueUsd, 0),
    })
  }
  if (noIssuerValueUsd > 0) {
    segments.push({ kind: 'none', valueUsd: noIssuerValueUsd })
  }
  return segments
}
