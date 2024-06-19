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
  it('data source syncing', () => {})
  it('data source lagging', () => {})
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
