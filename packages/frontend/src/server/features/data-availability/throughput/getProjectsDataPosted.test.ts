import type { DataAvailabilityRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describe, it } from 'mocha'
import { buildProjectsDataPosted } from './getProjectsDataPosted'

describe(buildProjectsDataPosted.name, () => {
  const from = UnixTime(100 * UnixTime.DAY)
  const to = from + UnixTime.DAY

  it('sums all DA layers and compares with the same window 7D ago', () => {
    const records = [
      record('project-a', from + UnixTime.HOUR, 100, 'ethereum'),
      record('project-a', from + 2 * UnixTime.HOUR, 200, 'celestia'),
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
    daLayer,
  }
}
