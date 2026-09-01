import type { TrackedTxConfigEntry } from '@l2beat/shared'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { TrackedTxProject } from '../../../config/Config'
import { getTrackedTxsStatusRows, STALE_AFTER_SECONDS } from './status'

describe(getTrackedTxsStatusRows.name, () => {
  const now = UnixTime(1_700_000_000)

  it('returns active configs for each feature', () => {
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
      result.map((row) => [
        row.configId,
        row.feature,
        row.projectId,
        row.subtype,
      ]),
    ).toEqual([
      ['active-costs', 'l2costs', 'project-a', 'stateUpdates'],
      ['active-liveness', 'liveness', 'project-a', 'stateUpdates'],
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
      ['stale-project', 'stale'],
      ['missing-project', 'missing'],
      ['fresh-project', 'fresh'],
    ])
  })

  it('returns one status row for each active config', () => {
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

    expect(
      result.map((row) => ({
        configId: row.configId,
        projectId: row.projectId,
        feature: row.feature,
        subtype: row.subtype,
        status: row.status,
        latestTimestamp: row.latestTimestamp,
        ageSeconds: row.ageSeconds,
        formula: row.formula,
        sinceTimestamp: row.sinceTimestamp,
      })),
    ).toEqual([
      {
        configId: 'stale',
        projectId: 'project-a',
        feature: 'liveness',
        subtype: 'stateUpdates',
        status: 'stale',
        latestTimestamp: now - STALE_AFTER_SECONDS - 1,
        ageSeconds: STALE_AFTER_SECONDS + 1,
        formula: 'transfer',
        sinceTimestamp: 1_600_000_000,
      },
      {
        configId: 'missing',
        projectId: 'project-a',
        feature: 'liveness',
        subtype: 'stateUpdates',
        status: 'missing',
        latestTimestamp: undefined,
        ageSeconds: undefined,
        formula: 'transfer',
        sinceTimestamp: 1_600_000_000,
      },
      {
        configId: 'fresh',
        projectId: 'project-a',
        feature: 'liveness',
        subtype: 'stateUpdates',
        status: 'fresh',
        latestTimestamp: now - UnixTime.HOUR,
        ageSeconds: UnixTime.HOUR,
        formula: 'transfer',
        sinceTimestamp: 1_600_000_000,
      },
    ])
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
