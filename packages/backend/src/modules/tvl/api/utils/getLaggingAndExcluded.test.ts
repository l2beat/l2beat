import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { ValueRecord } from '../../repositories/ValueRepository'
import { getLaggingAndExcluded } from './getLaggingAndExcluded'

const projectId = ProjectId('project')

describe(getLaggingAndExcluded.name, () => {
  it('everything up to date', () => {
    const targetTimestamp = new UnixTime(100)

    const valuesByTimestamp = {
      '100': [mockValue('A', 100), mockValue('B', 100), mockValue('C', 100)],
    }

    const configurations = mockConfigurations(['A', 'B', 'C'])

    const result = getLaggingAndExcluded<ValueRecord>(
      configurations,
      valuesByTimestamp,
      (t: ValueRecord) => t.dataSource,
      targetTimestamp,
    )

    expect(result.lagging).toBeEmpty()
    expect(result.excluded).toBeEmpty()
  })

  it('data source syncing', () => {
    const targetTimestamp = UnixTime.ZERO.add(14, 'days')

    // It is later than 7D ago, so will be considered syncing
    const timestamp = targetTimestamp.add(-10, 'days').toNumber()
    const valuesByTimestamp = {
      [timestamp]: [mockValue('A', timestamp)],
      // No entry for "B", will be considered syncing
    }

    const configurations = mockConfigurations(['A', 'B'])

    const result = getLaggingAndExcluded(
      configurations,
      valuesByTimestamp,
      (t: ValueRecord) => t.dataSource,
      targetTimestamp,
    )

    expect(result.lagging).toBeEmpty()
    expect(result.excluded).toEqual([`A`, `B`])
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

    const configurations = mockConfigurations(['A'])

    const result = getLaggingAndExcluded(
      configurations,
      valuesByTimestamp,
      (t: ValueRecord) => t.dataSource,
      targetTimestamp,
    )

    expect(result.lagging).toEqual([
      {
        id: `A`,
        latestTimestamp: new UnixTime(timestamp),
        latestValue: mockValue('A', timestamp),
      },
    ])
    expect(result.excluded).toBeEmpty()
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

function mockConfigurations(
  sources: string[],
): { id: string; minTimestamp: UnixTime }[] {
  return sources.map((s) => ({
    id: s,
    minTimestamp: UnixTime.ZERO,
  }))
}
