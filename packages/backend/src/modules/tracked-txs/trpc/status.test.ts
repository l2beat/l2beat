import type { TrackedTxConfigEntry } from '@l2beat/shared'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { TrackedTxProject } from '../../../config/Config'
import { getTrackedTxsStatusRows, STALE_AFTER_SECONDS } from './status'

describe(getTrackedTxsStatusRows.name, () => {
  const now = UnixTime(1_700_000_000)

  it('returns active config groups for each feature', () => {
    const result = getTrackedTxsStatusRows({
      projects: [
        mockProject('project-a', [
          mockConfig({ id: 'active-liveness', type: 'liveness' }),
          mockConfig({
            id: 'ended-liveness',
            type: 'liveness',
            untilTimestamp: 1,
          }),
          mockConfig({ id: 'active-costs', type: 'l2costs' }),
        ]),
      ],
      latestTimestamps: {
        liveness: [
          {
            configurationId: 'active-liveness',
            latestTimestamp: now - UnixTime.HOUR,
          },
        ],
        l2costs: [
          {
            configurationId: 'active-costs',
            latestTimestamp: now - UnixTime.HOUR,
          },
        ],
      },
      now,
    })

    expect(
      result.map((row) => [row.feature, row.projectId, row.subtype]),
    ).toEqual([
      ['l2costs', 'project-a', 'stateUpdates'],
      ['liveness', 'project-a', 'stateUpdates'],
    ])
  })

  it('does not return configs for archived projects', () => {
    const result = getTrackedTxsStatusRows({
      projects: [
        mockProject(
          'archived-project',
          [mockConfig({ id: 'archived-liveness', type: 'liveness' })],
          true,
        ),
      ],
      latestTimestamps: {
        liveness: [
          {
            configurationId: 'archived-liveness',
            latestTimestamp: now - UnixTime.HOUR,
          },
        ],
        l2costs: [],
      },
      now,
    })

    expect(result).toEqual([])
  })

  it('marks groups as missing, stale, or fresh and sorts urgent rows first', () => {
    const result = getTrackedTxsStatusRows({
      projects: [
        mockProject('fresh-project', [
          mockConfig({ id: 'fresh', type: 'liveness' }),
        ]),
        mockProject('missing-project', [
          mockConfig({ id: 'missing', type: 'liveness' }),
        ]),
        mockProject('stale-project', [
          mockConfig({ id: 'stale', type: 'liveness' }),
        ]),
      ],
      latestTimestamps: {
        liveness: [
          {
            configurationId: 'fresh',
            latestTimestamp: now - UnixTime.HOUR,
          },
          {
            configurationId: 'stale',
            latestTimestamp: now - STALE_AFTER_SECONDS - 1,
          },
        ],
        l2costs: [],
      },
      now,
    })

    expect(result.map((row) => [row.projectId, row.status])).toEqual([
      ['missing-project', 'missing'],
      ['stale-project', 'stale'],
      ['fresh-project', 'fresh'],
    ])
  })

  it('marks a subtype group fresh when at least one config has fresh data', () => {
    const result = getTrackedTxsStatusRows({
      projects: [
        mockProject('project-a', [
          mockConfig({ id: 'missing', type: 'liveness' }),
          mockConfig({ id: 'stale', type: 'liveness' }),
          mockConfig({ id: 'fresh', type: 'liveness' }),
        ]),
      ],
      latestTimestamps: {
        liveness: [
          {
            configurationId: 'stale',
            latestTimestamp: now - STALE_AFTER_SECONDS - 1,
          },
          {
            configurationId: 'fresh',
            latestTimestamp: now - UnixTime.HOUR,
          },
        ],
        l2costs: [],
      },
      now,
    })

    expect(result).toHaveLength(1)

    const row = result[0]

    expect(row!.projectId).toEqual('project-a')
    expect(row!.feature).toEqual('liveness')
    expect(row!.subtype).toEqual('stateUpdates')
    expect(row!.status).toEqual('fresh')
    expect(row!.latestTimestamp).toEqual(now - UnixTime.HOUR)
    expect(row!.ageSeconds).toEqual(UnixTime.HOUR)
    expect(row!.configsCount).toEqual(3)
    expect(row!.configsWithDataCount).toEqual(2)
    expect(row!.missingConfigsCount).toEqual(1)
    expect(row!.staleConfigsCount).toEqual(1)
    expect(row!.formulas).toEqual(['transfer'])
    expect(row!.sinceTimestamp).toEqual(1_600_000_000)
  })
})

function mockProject(
  id: string,
  configurations: TrackedTxConfigEntry[],
  isArchived = false,
): TrackedTxProject {
  return {
    id: ProjectId(id),
    isArchived,
    configurations,
  }
}

function mockConfig(
  config: Pick<TrackedTxConfigEntry, 'id' | 'type'> &
    Partial<TrackedTxConfigEntry>,
): TrackedTxConfigEntry {
  return {
    id: config.id,
    projectId: ProjectId('project'),
    sinceTimestamp: 1_600_000_000,
    untilTimestamp: config.untilTimestamp,
    type: config.type,
    subtype: 'stateUpdates',
    params: {
      formula: 'transfer',
      to: EthereumAddress.ZERO,
    },
  } as TrackedTxConfigEntry
}
