import type { CoingeckoCorrection } from '@l2beat/config/build/global/coingeckoCorrections'
import { UnixTime } from '@l2beat/shared-pure'

type Field = CoingeckoCorrection['field']

interface Point {
  timestamp: UnixTime
  value: number
}

export function applyCoingeckoCorrections(
  corrections: CoingeckoCorrection[],
  field: Field,
  coingeckoId: string,
  fetched: Point[],
): Point[] {
  const corrected = correctedValues(corrections, field, coingeckoId)
  return fetched.map((point) => ({
    ...point,
    value: corrected.get(point.timestamp) ?? point.value,
  }))
}

export function correctedValues(
  corrections: CoingeckoCorrection[],
  field: Field,
  coingeckoId: string,
): Map<UnixTime, number> {
  return new Map(
    corrections
      .filter((c) => c.field === field && c.coingeckoId === coingeckoId)
      .flatMap((c) => c.points)
      .map((p) => [UnixTime.fromDate(new Date(p.at)), p.value]),
  )
}
