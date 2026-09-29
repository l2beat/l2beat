import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  orderAnonymitySetSeriesByCurrentSize,
  type PrivacyAnonymitySetChartResponse,
  selectPrivacyAnonymitySetChartRange,
  trimLeadingEmptyAnonymitySetHistory,
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

  it('keeps the latest day when the requested end is earlier that day', () => {
    const snapshot = makeSnapshot()

    const result = selectPrivacyAnonymitySetChartRange(snapshot, [
      DAY_2,
      DAY_3 - 2 * UnixTime.HOUR,
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

describe(orderAnonymitySetSeriesByCurrentSize.name, () => {
  // Methodology: every series carries a distinct value in each column, so
  // checking series ids alongside both charts' columns proves the values moved
  // together with their series.
  it('orders series and their chart columns by the latest history value', () => {
    const snapshot: PrivacyAnonymitySetChartResponse = {
      ...makeSnapshot(),
      series: [makeSeries('cdai'), makeSeries('eth-1'), makeSeries('eth-0.1')],
      history: [
        [DAY_1, 50, 10, 1],
        [DAY_2, 5, 40, 90],
      ],
      holdingDuration: [[7, 6, 41, 91]],
    }

    const result = orderAnonymitySetSeriesByCurrentSize(snapshot)

    expect(result).toEqual({
      ...snapshot,
      series: [makeSeries('eth-0.1'), makeSeries('eth-1'), makeSeries('cdai')],
      history: [
        [DAY_1, 1, 10, 50],
        [DAY_2, 90, 40, 5],
      ],
      holdingDuration: [[7, 91, 41, 6]],
    })
  })

  it('keeps the source order for series of equal size', () => {
    const snapshot: PrivacyAnonymitySetChartResponse = {
      ...makeSnapshot(),
      series: [makeSeries('a'), makeSeries('b')],
      history: [[DAY_1, 3, 3]],
      holdingDuration: [[7, 1, 2]],
    }

    const result = orderAnonymitySetSeriesByCurrentSize(snapshot)

    expect(result).toEqual(snapshot)
  })

  it('keeps the source order when there is no history', () => {
    const snapshot: PrivacyAnonymitySetChartResponse = {
      ...makeSnapshot(),
      series: [makeSeries('a'), makeSeries('b')],
      history: [],
      holdingDuration: [],
    }

    const result = orderAnonymitySetSeriesByCurrentSize(snapshot)

    expect(result).toEqual(snapshot)
  })
})

describe(trimLeadingEmptyAnonymitySetHistory.name, () => {
  it('removes days before any series has activity', () => {
    const result = trimLeadingEmptyAnonymitySetHistory([
      [DAY_1, 0, 0],
      [DAY_2, 0, 2],
      [DAY_3, 0, 0],
    ])

    expect(result).toEqual([
      [DAY_2, 0, 2],
      [DAY_3, 0, 0],
    ])
  })

  it('returns no history when every series is empty', () => {
    const result = trimLeadingEmptyAnonymitySetHistory([
      [DAY_1, 0, 0],
      [DAY_2, 0, 0],
    ])

    expect(result).toEqual([])
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
    syncingLabels: [],
    syncedUntil: DAY_3,
  }
}

function makeSeries(
  id: string,
): PrivacyAnonymitySetChartResponse['series'][number] {
  return { id, label: id, token: 'ETH', minimumAmount: '1' }
}
