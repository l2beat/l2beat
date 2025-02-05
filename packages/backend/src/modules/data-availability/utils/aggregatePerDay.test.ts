import type { DaBlob } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { aggregatePerDay } from './aggregatePerDay'

describe('aggregatePerDay', () => {
  const FIRST_DAY = new UnixTime(1700000000).toStartOf('day')
  const SECOND_DAY = FIRST_DAY.add(1, 'days')
  const THIRD_DAY = SECOND_DAY.add(1, 'days')

  it('aggregates single blob in a day', () => {
    const blobs: DaBlob[] = [
      {
        blockTimestamp: FIRST_DAY,
        size: 100n,
      },
    ]

    const result = aggregatePerDay('project-a', blobs)

    expect(result).toEqual([
      {
        timestamp: FIRST_DAY,
        totalSize: 100n,
        projectId: 'project-a',
      },
    ])
  })

  it('aggregates multiple blobs in the same day', () => {
    const blobs: DaBlob[] = [
      {
        blockTimestamp: FIRST_DAY,
        size: 100n,
      },
      {
        blockTimestamp: FIRST_DAY.add(1, 'hours'),
        size: 150n,
      },
      {
        blockTimestamp: FIRST_DAY.add(2, 'hours'),
        size: 200n,
      },
    ]

    const result = aggregatePerDay('project-b', blobs)

    expect(result).toEqual([
      {
        timestamp: FIRST_DAY,
        totalSize: 450n,
        projectId: 'project-b',
      },
    ])
  })

  it('separates blobs from different days', () => {
    const blobs: DaBlob[] = [
      {
        blockTimestamp: FIRST_DAY,
        size: 100n,
      },
      {
        blockTimestamp: SECOND_DAY,
        size: 200n,
      },
      {
        blockTimestamp: THIRD_DAY,
        size: 300n,
      },
    ]

    const result = aggregatePerDay('project-c', blobs)

    expect(result).toEqual([
      {
        timestamp: FIRST_DAY,
        totalSize: 100n,
        projectId: 'project-c',
      },
      {
        timestamp: SECOND_DAY,
        totalSize: 200n,
        projectId: 'project-c',
      },
      {
        timestamp: THIRD_DAY,
        totalSize: 300n,
        projectId: 'project-c',
      },
    ])
  })

  it('returns empty array for empty input', () => {
    const result = aggregatePerDay('project-d', [])
    expect(result).toEqual([])
  })
})
