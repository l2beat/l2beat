import type { DataAvailabilityRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { findRecordGaps } from './gaps'

const HOUR = UnixTime.HOUR
const T0 = UnixTime.fromDate(new Date('2026-07-30T00:00:00Z'))

function record(
  timestamp: UnixTime,
  configurationId = 'aaa',
): DataAvailabilityRecord {
  return {
    timestamp,
    projectId: 'alpha',
    daLayer: 'ethereum',
    configurationId,
    totalSize: 1n,
  }
}

describe(findRecordGaps.name, () => {
  it('reports hours without records', () => {
    const gaps = findRecordGaps(
      [record(T0), record(T0 + 2 * HOUR)],
      [
        {
          projectId: 'alpha',
          daLayer: 'ethereum',
          configurationId: 'aaa',
          hours: [T0, T0 + HOUR, T0 + 2 * HOUR],
        },
      ],
    )
    expect(gaps).toEqual([
      {
        projectId: 'alpha',
        daLayer: 'ethereum',
        configurationId: 'aaa',
        expectedHours: 3,
        missingHours: [T0 + HOUR],
      },
    ])
  })

  it('reports a fully missing configuration', () => {
    const gaps = findRecordGaps(
      [],
      [
        {
          projectId: 'alpha',
          daLayer: 'ethereum',
          configurationId: 'aaa',
          hours: [T0, T0 + HOUR],
        },
      ],
    )
    expect(gaps).toEqual([
      {
        projectId: 'alpha',
        daLayer: 'ethereum',
        configurationId: 'aaa',
        expectedHours: 2,
        missingHours: [T0, T0 + HOUR],
      },
    ])
  })

  it('returns nothing for full coverage', () => {
    const gaps = findRecordGaps(
      [record(T0), record(T0 + HOUR)],
      [
        {
          projectId: 'alpha',
          daLayer: 'ethereum',
          configurationId: 'aaa',
          hours: [T0, T0 + HOUR],
        },
      ],
    )
    expect(gaps).toEqual([])
  })

  it('distinguishes configurations of the same project', () => {
    const gaps = findRecordGaps(
      [record(T0, 'aaa')],
      [
        {
          projectId: 'alpha',
          daLayer: 'ethereum',
          configurationId: 'aaa',
          hours: [T0],
        },
        {
          projectId: 'alpha',
          daLayer: 'ethereum',
          configurationId: 'bbb',
          hours: [T0],
        },
      ],
    )
    expect(gaps).toEqual([
      {
        projectId: 'alpha',
        daLayer: 'ethereum',
        configurationId: 'bbb',
        expectedHours: 1,
        missingHours: [T0],
      },
    ])
  })
})
