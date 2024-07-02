import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { ValueRecord } from '../../repositories/ValueRepository'
import { getConfiguredValuesForTimestamp } from './getConfiguredValuesForTimestamp'
import { ApiProject } from './types'

const projectId = ProjectId('project')

describe(getConfiguredValuesForTimestamp.name, () => {
  it('returns only configured values', () => {
    const values = [mockValue('A', 100), mockValue('B', 100)]
    const project = mockProject(['A'])
    const timestamp = new UnixTime(100)
    const lagging = new Map()
    const syncing = new Set<string>()

    const result = getConfiguredValuesForTimestamp(
      values,
      project,
      timestamp,
      lagging,
      syncing,
    )

    expect(result).toEqual([mockValue('A', 100)])
  })

  it('takes source minTimestamp into consideration', () => {
    const values = [mockValue('A', 100), mockValue('B', 100)]
    const project = {
      ...mockProject([]),
      sources: new Map([
        ['A', { minTimestamp: new UnixTime(100) }],
        ['B', { minTimestamp: new UnixTime(200) }],
      ]),
    }
    const timestamp = new UnixTime(100)
    const lagging = new Map()
    const syncing = new Set<string>()

    const result = getConfiguredValuesForTimestamp(
      values,
      project,
      timestamp,
      lagging,
      syncing,
    )

    expect(result).toEqual([mockValue('A', 100)])
  })

  it('removes data sources that are being synced', () => {
    const values = [mockValue('A', 100), mockValue('B', 100)]
    const project = mockProject(['A', 'B'])
    const timestamp = new UnixTime(100)
    const lagging = new Map()
    const syncing = new Set<string>([`${projectId}-B`])

    const result = getConfiguredValuesForTimestamp(
      values,
      project,
      timestamp,
      lagging,
      syncing,
    )

    expect(result).toEqual([mockValue('A', 100)])
  })

  it('interpolates lagging sources with latest known value', () => {
    const values: ValueRecord[] = []
    const project = mockProject(['A'])
    const timestamp = new UnixTime(200)
    const lagging = new Map([
      [
        'project-A',
        {
          latestValue: mockValue('A', 100),
        },
      ],
    ])
    const syncing = new Set<string>()

    const result = getConfiguredValuesForTimestamp(
      values,
      project,
      timestamp,
      lagging,
      syncing,
    )

    expect(result).toEqual([mockValue('A', 200)])
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
