import { type Project, ProjectService } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import {
  getLatestTvsByProject,
  getScalingSummary,
  getTvsRangeStart,
  toScalingSummary,
} from './getScalingSummary'

const NOW = UnixTime.fromDate(new Date('2026-11-25T12:30:00Z'))
const SEVEN_DAYS_AGO = NOW - 7 * UnixTime.DAY

describe(getScalingSummary.name, () => {
  // Why: the endpoint promises every active L2 and L3 and nothing archived,
  // and the archived filter lives in the ProjectService query, so only the
  // real project database can show it holds.
  // How: run the whole route against the real config and an empty database,
  // and compare the returned ids with the archived and active scaling sets.
  it('returns every active scaling project and no archived one', async () => {
    const ps = new ProjectService()
    const summary = await getScalingSummary(ps, emptyDatabase())

    const returned = new Set(summary.projects.map((p) => p.id))
    const archived = await ps.getProjects({
      where: ['scalingInfo', 'archivedAt'],
    })
    const active = await ps.getProjects({
      where: ['scalingInfo'],
      whereNot: ['archivedAt'],
    })

    expect(archived.length).toBeGreaterThan(0)
    expect(archived.filter((p) => returned.has(p.id))).toEqual([])
    expect([...returned].sort()).toEqual(active.map((p) => p.id).sort())
  })

  // Why: with no TVS data at all, the API must not claim projects secure $0.
  // How: the same empty database; every project's tvs must be null.
  it('reports missing TVS as null, not zero', async () => {
    const summary = await getScalingSummary(
      new ProjectService(),
      emptyDatabase(),
    )
    expect(summary.projects.every((p) => p.tvs === null)).toEqual(true)
  })
})

describe(toScalingSummary.name, () => {
  // Why: a project without TVS data must come back as null and sort below
  // every project with data, so the list order matches the website.
  // How: two projects, only one has TVS; check order and the null.
  it('maps TVS and sorts projects without data last', () => {
    const tvs = {
      timestamp: NOW,
      breakdown: { total: 100, ether: 40, stablecoin: 50, associated: 10 },
      change7d: 0.1,
    }
    const summary = toScalingSummary({
      projects: [scalingProject('no-data'), scalingProject('with-data')],
      tvs: new Map([['with-data', tvs]]),
      changeReport: {},
      tvsTimestamp: NOW,
    })

    expect(summary.tvsTimestamp).toEqual(NOW)
    expect(summary.projects.map((p) => [p.id, p.tvs])).toEqual([
      ['with-data', tvs],
      ['no-data', null],
    ])
  })

  // Why: the website shows "Not applicable" for an Other project even when
  // its config still carries a stage, and the API must not disagree.
  // How: an Other project configured as Stage 1 against a rollup that is.
  it('shows no stage for Other projects, like the website', () => {
    const stage1 = {
      stage: 'Stage 1' as const,
      downgradePending: undefined,
      summary: [],
    }
    const summary = toScalingSummary({
      projects: [
        scalingProject('other', { type: 'Other', scalingStage: stage1 }),
        scalingProject('rollup', { scalingStage: stage1 }),
      ],
      tvs: new Map(),
      changeReport: {},
      tvsTimestamp: NOW,
    })

    expect(summary.projects.map((p) => [p.id, p.stage])).toEqual([
      ['other', 'Not applicable'],
      ['rollup', 'Stage 1'],
    ])
  })

  // Why: isUnderReview has two sources, the config flag and an unassessed
  // impactful contract change, and either one must raise it.
  // How: one project per source and one with neither.
  it('flags review status from the config and from impactful changes', () => {
    const summary = toScalingSummary({
      projects: [
        scalingProject('config', { reviewStatus: 'initialReview' }),
        scalingProject('changed'),
        scalingProject('clean'),
      ],
      tvs: new Map(),
      changeReport: {
        changed: {
          arbitrum: {
            implementationChange: [EthereumAddress.ZERO],
            highSeverityFieldChange: [],
            ultimateUpgraderChange: [],
            becameVerified: [],
          },
        },
      },
      tvsTimestamp: NOW,
    })

    expect(summary.projects.map((p) => [p.id, p.isUnderReview])).toEqual([
      ['config', true],
      ['changed', true],
      ['clean', false],
    ])
  })

  // Why: an L3's rosette rates the stack it settles through, so the website
  // reads the stacked risks when they exist; the API must read the same.
  // How: a project with different self and stacked risks.
  it('prefers stacked risks over the project own risks', () => {
    const summary = toScalingSummary({
      projects: [
        scalingProject('l3', {
          stacked: riskView('stacked'),
          self: riskView('self'),
        }),
      ],
      tvs: new Map(),
      changeReport: {},
      tvsTimestamp: NOW,
    })

    expect(summary.projects[0]?.risks.map((r) => r.value)).toEqual([
      'stacked',
      'stacked',
      'stacked',
      'stacked',
      'stacked',
    ])
    expect(summary.projects[0]?.risks.map((r) => r.name)).toEqual([
      'Sequencer Failure',
      'State Validation',
      'Data Availability',
      'Exit Window',
      'Proposer Failure',
    ])
  })

  // Why: the website shows an exit window with emergency upgrades as
  // "Emergency: None" beside its regular window; "None" alone overstates the
  // risk.
  // How: an exit window with a regular window; the API returns it too.
  it('keeps the regular exit window', () => {
    const regular = {
      value: '10d',
      sentiment: 'warning' as const,
      description: 'Regular upgrades',
    }
    const view = riskView('None')
    const summary = toScalingSummary({
      projects: [
        scalingProject('arbitrum', {
          self: {
            ...view,
            exitWindow: {
              ...view.exitWindow,
              regular,
            } as typeof view.exitWindow,
          },
        }),
      ],
      tvs: new Map(),
      changeReport: {},
      tvsTimestamp: NOW,
    })

    const exitWindow = summary.projects[0]?.risks.find(
      (r) => r.name === 'Exit Window',
    )
    expect(exitWindow?.regular).toEqual({
      value: '10d',
      sentiment: 'warning',
      description: 'Regular upgrades',
    })
  })
})

describe(getLatestTvsByProject.name, () => {
  // Why: the breakdown and 7d change must equal the old endpoint's numbers.
  // How: one project with a latest row and one from seven days before; the
  // breakdown comes from the latest row and change7d is latest/old - 1.
  it('takes the breakdown from the latest row and the change from both', () => {
    const result = getLatestTvsByProject(
      [tvsRow('arbitrum', SEVEN_DAYS_AGO, 80), tvsRow('arbitrum', NOW, 100)],
      ['arbitrum-USDC'],
    )

    expect(result.get('arbitrum')).toEqual({
      timestamp: NOW,
      breakdown: { total: 100, ether: 10, stablecoin: 20, associated: 5 },
      change7d: 0.25,
    })
  })

  // Why: with no value seven days back the change is unknown, and a 0%
  // would claim the project's TVS did not move.
  // How: a project with only its latest row.
  it('reports change7d as null without a value from seven days before', () => {
    const result = getLatestTvsByProject(
      [tvsRow('base', NOW, 100)],
      ['base-ETH'],
    )
    expect(result.get('base')?.change7d).toEqual(null)
  })

  // Why: the website's percentage helper turns both of these into 0%, which
  // would claim the TVS did not move. From 0 the change is undefined; to 0 it
  // is -100%.
  // How: one project that starts at 0 and one that falls to 0.
  it('reports change7d as null from 0 and as -1 down to 0', () => {
    const result = getLatestTvsByProject(
      [
        tvsRow('rising', SEVEN_DAYS_AGO, 0),
        tvsRow('rising', NOW, 100),
        tvsRow('emptied', SEVEN_DAYS_AGO, 100),
        tvsRow('emptied', NOW, 0),
      ],
      ['rising-ETH', 'emptied-ETH'],
    )
    expect(result.get('rising')?.change7d).toEqual(null)
    expect(result.get('emptied')?.change7d).toEqual(-1)
  })

  // Why: the website hides TVS the backend has never synced; so must we.
  // How: rows for a project with no sync metadata yield no entry.
  it('skips projects the TVS backend has no sync metadata for', () => {
    const result = getLatestTvsByProject(
      [tvsRow('stale', NOW, 100)],
      ['other-ETH'],
    )
    expect(result.has('stale')).toEqual(false)
  })
})

describe(getTvsRangeStart.name, () => {
  // Why: the query window must start where the frontend's '3d' range does.
  // How: 12:30 minus the 1h15m backend delay is 11:00 the same day, so the
  // window starts at midnight three days earlier.
  it('starts three days before the day of the last synced hour', () => {
    expect(getTvsRangeStart(NOW)).toEqual(
      UnixTime.fromDate(new Date('2026-11-22T00:00:00Z')),
    )
  })
})

function emptyDatabase() {
  return mockObject<Database>({
    tvsTokenValue: mockObject<Database['tvsTokenValue']>({
      getSummedByProjectAtLatestAndSevenDaysBefore: async () => [],
    }),
    syncMetadata: mockObject<Database['syncMetadata']>({
      getByFeature: async () => [],
      getMaxTargetForFeature: async () => NOW,
    }),
    updateDiff: mockObject<Database['updateDiff']>({
      getAll: async () => [],
    }),
  })
}

function tvsRow(project: string, timestamp: UnixTime, value: number) {
  return {
    project,
    timestamp,
    value,
    canonical: 0,
    customCanonical: 0,
    external: 0,
    native: 0,
    ether: value / 10,
    stablecoin: value / 5,
    btc: 0,
    rwaRestricted: 0,
    rwaPublic: 0,
    other: 0,
    associated: value / 20,
  }
}

function riskView(value: string) {
  const risk = { value, sentiment: 'good' as const, description: value }
  return {
    stateValidation: risk,
    dataAvailability: risk,
    exitWindow: risk,
    sequencerFailure: risk,
    proposerFailure: risk,
  }
}

function scalingProject(
  id: string,
  options: {
    type?: string
    scalingStage?: unknown
    reviewStatus?: string
    self?: ReturnType<typeof riskView>
    stacked?: ReturnType<typeof riskView>
  } = {},
) {
  return {
    id: ProjectId(id),
    slug: id,
    name: id,
    shortName: undefined,
    display: { badges: [] },
    statuses: { reviewStatus: options.reviewStatus },
    scalingInfo: {
      layer: 'layer2',
      type: options.type ?? 'Optimistic Rollup',
      hostChain: { name: 'Ethereum' },
      stacks: [],
      purposes: ['Universal'],
    },
    scalingRisks: {
      self: options.self ?? riskView('self'),
      stacked: options.stacked,
    },
    scalingStage: options.scalingStage,
    tvsInfo: { associatedTokens: [] },
  } as unknown as Project<
    'display' | 'statuses' | 'scalingInfo' | 'scalingRisks' | 'tvsInfo',
    'scalingStage'
  >
}
