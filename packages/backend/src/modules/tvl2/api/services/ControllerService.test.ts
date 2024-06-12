import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { Dictionary } from 'lodash'
import { ValueRecord } from '../../repositories/ValueRepository'
import { ApiProject } from '../utils/types'
import { filterSources, filterTimestamps } from './ControllerService'

describe(filterSources.name, () => {
  it('filters out additional values', () => {
    const values = [
      value(UnixTime.ZERO, 'coingecko'),
      value(UnixTime.ZERO, 'arbitrum'),
    ]
    const valuesByTimestamp: Dictionary<ValueRecord[]> = {
      [UnixTime.ZERO.toString()]: values,
    }

    const project: ApiProject = {
      id: ProjectId('project'),
      minTimestamp: UnixTime.ZERO,
      type: 'layer2',
      slug: 'project',
      sources: new Map([
        ['coingecko', { name: 'coingecko', minTimestamp: new UnixTime(0) }],
      ]),
    }

    const filteredValues = filterSources(valuesByTimestamp, project)

    expect(filteredValues).toEqual({
      [UnixTime.ZERO.toString()]: values.slice(0, 1),
    })
  })

  it('throw when missing data source', () => {
    const values = [value(UnixTime.ZERO, 'coingecko')]
    const valuesByTimestamp: Dictionary<ValueRecord[]> = {
      [UnixTime.ZERO.toString()]: values,
    }

    const project: ApiProject = {
      id: ProjectId('project'),
      minTimestamp: UnixTime.ZERO,
      type: 'layer2',
      slug: 'project',
      sources: new Map([
        ['coingecko', { name: 'coingecko', minTimestamp: UnixTime.ZERO }],
        ['arbitrum', { name: 'arbitrum', minTimestamp: UnixTime.ZERO }],
      ]),
    }

    expect(() => filterSources(valuesByTimestamp, project)).toThrow()
  })
})

describe(filterTimestamps.name, () => {
  it('filters out not needed data', () => {
    const start = UnixTime.fromDate(new Date('2023-05-01T00:00:00Z'))
    const sixHourlyCutOff = start.add(7, 'days')
    const hourlyCutOff = start.add(14, 'days')

    const values: ValueRecord[] = [
      value(start),
      value(start.add(1, 'days')),
      value(sixHourlyCutOff.add(1, 'days').add(6, 'hours')),
      value(hourlyCutOff.add(1, 'days').add(1, 'hours')),

      // to filter out
      value(sixHourlyCutOff.add(-1, 'days').add(6, 'hours')),
      value(hourlyCutOff.add(-1, 'days').add(1, 'hours')),
    ]

    const filteredValues = filterTimestamps(
      values,
      sixHourlyCutOff,
      hourlyCutOff,
    )

    expect(filteredValues).toEqual(values.slice(0, 4))
  })
})

function value(
  timestamp: UnixTime,
  dataSource: 'coingecko' | 'arbitrum' = 'coingecko',
) {
  return {
    projectId: ProjectId('project'),
    timestamp,
    dataSource,
    canonical: 0n,
    canonicalForTotal: 0n,
    external: 0n,
    externalForTotal: 0n,
    native: 0n,
    nativeForTotal: 0n,
  }
}
