import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getLaggingAndSyncing } from './getLaggingAndSyncing'
import { ApiProject } from './types'

const projectId = ProjectId('project')

describe(getLaggingAndSyncing.name, () => {
  it('everything up to date', () => {
    const targetTimestamp = new UnixTime(100)

    const valuesByTimestamp = {
      '100': [mockValue('A', 100), mockValue('B', 100), mockValue('C', 100)],
    }

    const project = mockProject(['A', 'B', 'C'])

    const result = getLaggingAndSyncing(
      valuesByTimestamp,
      targetTimestamp,
      project,
    )

    expect(result.lagging).toBeEmpty()
    expect(result.syncing).toBeEmpty()
  })

  it('data source syncing', () => {
    const targetTimestamp = UnixTime.ZERO.add(14, 'days')

    // It is later than 7D ago, so will be considered syncing
    const timestamp = targetTimestamp.add(-10, 'days').toNumber()
    const valuesByTimestamp = {
      [timestamp]: [mockValue('A', timestamp)],
      // No entry for "B", will be considered syncing
    }

    const project = mockProject(['A', 'B'])

    const result = getLaggingAndSyncing(
      valuesByTimestamp,
      targetTimestamp,
      project,
    )

    expect(result.lagging).toBeEmpty()
    expect(result.syncing).toEqual([`${projectId}-A`, `${projectId}-B`])
  })

  it('data source lagging', () => {
    const targetTimestamp = UnixTime.ZERO.add(14, 'days')

    // It is earlier than 7D ago, so will be considered lagging
    const timestamp = targetTimestamp.add(-4, 'hours').toNumber()
    const timestamp7DaysAgo = targetTimestamp.add(-7, 'days').toNumber()
    const valuesByTimestamp = {
      // this one is needed for the function assumptions about the data
      [timestamp7DaysAgo]: [mockValue('A', timestamp7DaysAgo)],
      // there should be consecutive records in prod data
      [timestamp]: [mockValue('A', timestamp)],
    }

    const project = mockProject(['A'])

    const result = getLaggingAndSyncing(
      valuesByTimestamp,
      targetTimestamp,
      project,
    )

    expect(result.lagging).toEqual([
      {
        source: `${projectId}-A`,
        latestTimestamp: new UnixTime(timestamp),
        latestValue: mockValue('A', timestamp),
      },
    ])
    expect(result.syncing).toBeEmpty()
  })
})

function mockValue(source: string, timestamp: number) {
  return {
    projectId,
    dataSource: source,
    timestamp: new UnixTime(timestamp),
    canonical: 0n,
    canonicalForTotal: 0n,
    external: 0n,
    externalForTotal: 0n,
    native: 0n,
    nativeForTotal: 0n,
  }
}

function mockProject(sources: string[]): ApiProject {
  return {
    id: projectId,
    minTimestamp: UnixTime.ZERO,
    type: 'layer2', // does not matter here
    slug: 'slug', // does not matter here
    sources: new Map(sources.map((s) => [s, { minTimestamp: UnixTime.ZERO }])),
  }
}
