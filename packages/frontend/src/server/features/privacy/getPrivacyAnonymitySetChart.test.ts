import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  type PrivacyAnonymitySetChartResponse,
  selectPrivacyAnonymitySetChartRange,
} from './getPrivacyAnonymitySetChart'

const DAY_1 = UnixTime.fromDate(new Date('2026-08-01T00:00:00Z'))
const DAY_2 = DAY_1 + UnixTime.DAY
const DAY_3 = DAY_2 + UnixTime.DAY

describe(selectPrivacyAnonymitySetChartRange.name, () => {
  it('returns the complete history for max range', () => {
    const snapshot = makeSnapshot()

    const result = selectPrivacyAnonymitySetChartRange(snapshot, [null, DAY_3])

    expect(result).toEqual(snapshot)
  })

  it('normalizes the requested range to UTC days', () => {
    const snapshot = makeSnapshot()

    const result = selectPrivacyAnonymitySetChartRange(snapshot, [
      DAY_2 + UnixTime.HOUR,
      DAY_3 + UnixTime.HOUR,
    ])

    expect(result).toEqual({
      ...snapshot,
      history: [
        [DAY_2, 2],
        [DAY_3, 3],
      ],
    })
  })

  it('returns no history when the requested range does not overlap', () => {
    const snapshot = makeSnapshot()

    const result = selectPrivacyAnonymitySetChartRange(snapshot, [
      DAY_3 + UnixTime.DAY,
      DAY_3 + 2 * UnixTime.DAY,
    ])

    expect(result).toEqual({ ...snapshot, history: [] })
  })
})

function makeSnapshot(): PrivacyAnonymitySetChartResponse {
  return {
    series: [],
    history: [
      [DAY_1, 1],
      [DAY_2, 2],
      [DAY_3, 3],
    ],
    holdingDuration: [[7, 3]],
    syncedUntil: DAY_3,
  }
}
