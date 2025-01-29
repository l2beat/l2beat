import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { TvsProject } from './get-tvs-projects'
import { getValuesStatus } from './get-tvs-values-status'

describe(getValuesStatus.name, () => {
  it('everything up to date', () => {
    const targetTimestamp = new UnixTime(100)
    const valuesByTimestamp = {
      '100': [mockValue('A', 100), mockValue('B', 100), mockValue('C', 100)],
    }
    const project = mockProject(['A', 'B', 'C'])
    const result = getValuesStatus(project, valuesByTimestamp, targetTimestamp)
    expect(result.lagging).toBeEmpty()
    expect(result.excluded).toBeEmpty()
  })

  it('data source excluded', () => {
    const targetTimestamp = UnixTime.ZERO.add(14, 'days')

    // It is later than 7D ago, so will be considered excluded
    const timestamp = targetTimestamp.add(-10, 'days').toNumber()
    const valuesByTimestamp = {
      [timestamp]: [mockValue('A', timestamp)],
      // No entry for "B", will be considered excluded
    }

    const project = mockProject(['A', 'B'])

    const result = getValuesStatus(project, valuesByTimestamp, targetTimestamp)

    expect(result.lagging).toBeEmpty()
    expect(result.excluded).toEqual(new Set(['A', 'B']))
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

    const result = getValuesStatus(project, valuesByTimestamp, targetTimestamp)

    expect(result.lagging).toEqual([
      {
        id: 'A',
        latestTimestamp: new UnixTime(timestamp),
      },
    ])
    expect(result.excluded).toBeEmpty()
  })
})

function mockValue(source: string, timestamp: number) {
  return {
    projectId: ProjectId('project'),
    dataSource: source,
    timestamp: new UnixTime(timestamp),
    canonical: 0n,
    canonicalAssociated: 0n,
    canonicalForTotal: 0n,
    canonicalAssociatedForTotal: 0n,
    external: 0n,
    externalAssociated: 0n,
    externalForTotal: 0n,
    externalAssociatedForTotal: 0n,
    native: 0n,
    nativeAssociated: 0n,
    nativeForTotal: 0n,
    nativeAssociatedForTotal: 0n,
    ether: 0n,
    stablecoin: 0n,
  }
}
function mockProject(sources: string[]): TvsProject {
  return {
    projectId: ProjectId('project'),
    minTimestamp: UnixTime.ZERO,
    type: 'layer2', // does not matter here
    slug: 'slug', // does not matter here
    sources: new Map(
      sources.map((s) => [s, { name: 's', minTimestamp: UnixTime.ZERO }]),
    ),
  }
}
