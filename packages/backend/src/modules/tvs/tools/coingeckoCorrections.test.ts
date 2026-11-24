import type { CoingeckoCorrection } from '@l2beat/config/build/global/coingeckoCorrections'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { applyCoingeckoCorrections } from './coingeckoCorrections'

const NOON = UnixTime.fromDate(new Date('2026-05-31T12:00:00Z'))

describe(applyCoingeckoCorrections.name, () => {
  // Feeds three hourly points where only the middle one is listed, because a
  // correction must not spread to the hours around it.
  it('replaces the value at a listed hour and keeps the hours around it', () => {
    const corrections = [
      correction('coin', 'price', [{ at: '2026-05-31T12:00:00Z', value: 100 }]),
    ]
    const fetched = [-1, 0, 1].map((hours) => ({
      timestamp: UnixTime(NOON + hours * UnixTime.HOUR),
      value: 1,
    }))

    const result = applyCoingeckoCorrections(
      corrections,
      'price',
      'coin',
      fetched,
    )

    expect(result.map((p) => p.value)).toEqual([1, 100, 1])
  })

  it('leaves another coin and another field of the same coin as fetched', () => {
    const corrections = [
      correction('coin', 'price', [{ at: '2026-05-31T12:00:00Z', value: 100 }]),
    ]
    const fetched = [{ timestamp: NOON, value: 1 }]

    expect(
      applyCoingeckoCorrections(corrections, 'price', 'other', fetched),
    ).toEqual(fetched)
    expect(
      applyCoingeckoCorrections(
        corrections,
        'circulatingSupply',
        'coin',
        fetched,
      ),
    ).toEqual(fetched)
  })
})

function correction(
  coingeckoId: string,
  field: CoingeckoCorrection['field'],
  points: CoingeckoCorrection['points'],
): CoingeckoCorrection {
  return {
    coingeckoId,
    field,
    reason: 'reason',
    evidence: ['evidence'],
    points,
  }
}
