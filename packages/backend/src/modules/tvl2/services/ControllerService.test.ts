import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { Dictionary } from 'lodash'
import { ApiProject } from '../api/Tvl2Controller'
import { ValueRecord } from '../repositories/ValueRepository'
import { filterValues } from './ControllerService'

describe(filterValues.name, () => {
  it('filters out additional values', () => {
    const values = [
      {
        projectId: ProjectId('project'),
        timestamp: UnixTime.ZERO,
        dataSource: 'coingecko',
        canonical: 0n,
        canonicalForTotal: 0n,
        external: 0n,
        externalForTotal: 0n,
        native: 0n,
        nativeForTotal: 0n,
      },
      {
        projectId: ProjectId('project'),
        timestamp: UnixTime.ZERO,
        dataSource: 'arbitrum',
        canonical: 0n,
        canonicalForTotal: 0n,
        external: 0n,
        externalForTotal: 0n,
        native: 0n,
        nativeForTotal: 0n,
      },
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

    const filteredValues = filterValues(valuesByTimestamp, project)

    expect(filteredValues).toEqual({
      [UnixTime.ZERO.toString()]: values.slice(0, 1),
    })
  })

  it('throw when missing data source', () => {
    const values = [
      {
        projectId: ProjectId('project'),
        timestamp: UnixTime.ZERO,
        dataSource: 'coingecko',
        canonical: 0n,
        canonicalForTotal: 0n,
        external: 0n,
        externalForTotal: 0n,
        native: 0n,
        nativeForTotal: 0n,
      },
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
        ['coingecko', { name: 'coingecko', minTimestamp: UnixTime.ZERO }],
        ['arbitrum', { name: 'arbitrum', minTimestamp: UnixTime.ZERO }],
      ]),
    }

    expect(() => filterValues(valuesByTimestamp, project)).toThrow()
  })
})
