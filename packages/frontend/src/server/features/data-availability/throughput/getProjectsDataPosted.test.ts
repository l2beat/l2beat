import type { DataAvailabilityRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describe, it } from 'mocha'
import { buildProjectsDataPosted } from './getProjectsDataPosted'

describe(buildProjectsDataPosted.name, () => {
  const from = UnixTime(100 * UnixTime.DAY)
  const to = from + UnixTime.DAY

  it('sums the past day and compares with the same window 7D ago', () => {
    const records = [
      record('project-a', from + UnixTime.HOUR, 100, 'ethereum'),
      record('project-a', from + 2 * UnixTime.HOUR, 200, 'ethereum'),
      record(
        'project-a',
        from - 7 * UnixTime.DAY + UnixTime.HOUR,
        150,
        'ethereum',
      ),
    ]

    expect(buildProjectsDataPosted(records, from, to)).toEqual({
      'project-a': {
        pastDay: 300,
        change: 1,
        changePeriod: '7D',
        paidForBlobs: undefined,
      },
    })
  })

  it('omits projects without data in the current window', () => {
    const records = [
      record(
        'project-a',
        from - 7 * UnixTime.DAY + UnixTime.HOUR,
        150,
        'ethereum',
      ),
    ]

    expect(buildProjectsDataPosted(records, from, to)).toEqual({})
  })

  it('sums what the past day blobs cost, in ETH and at the hourly ETH price', () => {
    const records = [
      { ...record('project-a', from, 100, 'ethereum'), totalFeeEth: 0.5 },
      {
        ...record('project-a', from + UnixTime.HOUR, 100, 'ethereum'),
        totalFeeEth: 0.25,
      },
      // before the fees were tracked
      record('project-a', from + 2 * UnixTime.HOUR, 100, 'ethereum'),
      { ...record('project-a', to, 100, 'ethereum'), totalFeeEth: 9 },
    ]
    const prices = new Map([
      [from, 2000],
      [from + UnixTime.HOUR, 4000],
    ])

    expect(
      buildProjectsDataPosted(records, from, to, prices)['project-a']
        ?.paidForBlobs,
    ).toEqual({ eth: 0.75, usd: 2000 })
  })

  it('has no USD for the past day blobs when an hour has no ETH price', () => {
    const records = [
      { ...record('project-a', from, 100, 'ethereum'), totalFeeEth: 0.5 },
    ]

    expect(
      buildProjectsDataPosted(records, from, to)['project-a']?.paidForBlobs,
    ).toEqual({ eth: 0.5, usd: null })
  })

  it('includes records at the start and excludes records at the end', () => {
    const records = [
      record('project-a', from, 100, 'ethereum'),
      record('project-a', to, 200, 'ethereum'),
    ]

    expect(buildProjectsDataPosted(records, from, to)).toEqual({
      'project-a': {
        pastDay: 100,
        change: 0,
        changePeriod: '7D',
        paidForBlobs: undefined,
      },
    })
  })
})

function record(
  projectId: string,
  timestamp: UnixTime,
  totalSize: number,
  daLayer: string,
): DataAvailabilityRecord {
  return {
    configurationId: 'configuration-id',
    projectId,
    timestamp,
    totalSize: BigInt(totalSize),
    totalFeeEth: null,
    daLayer,
  }
}
