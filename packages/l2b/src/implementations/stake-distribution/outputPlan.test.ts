import { expect } from 'earl'
import {
  type ProjectStakeDistribution,
  planStakeDistributionOutput,
} from './outputPlan'

describe(planStakeDistributionOutput.name, () => {
  const polygon: ProjectStakeDistribution = {
    project: 'polygon-pos',
    distribution: {
      stakeToken: 'POL',
      dateType: 'fetched',
      date: '2026-08-06T08:48:58.389Z',
      totalStake: 3_500_000_000,
    },
  }
  const gnosis: ProjectStakeDistribution = {
    project: 'gnosis',
    distribution: {
      stakeToken: 'GNO',
      dateType: 'snapshot',
      date: '2026-08-05',
      validatorCount: 200_000,
      totalStake: 250_000,
    },
  }

  it('writes one untagged file per project into the discovery tree', () => {
    const plan = planStakeDistributionOutput(
      'all',
      { type: 'discovery', root: '/repo/discovery' },
      [polygon, gnosis],
    )

    expect(plan).toEqual([
      {
        path: '/repo/discovery/polygon-pos/stake-distribution.json',
        data: polygon.distribution,
      },
      {
        path: '/repo/discovery/gnosis/stake-distribution.json',
        data: gnosis.distribution,
      },
    ])
  })

  it('tags each project when several land in one explicit file', () => {
    const plan = planStakeDistributionOutput(
      'all',
      { type: 'file', path: '/tmp/all.json' },
      [polygon, gnosis],
    )

    expect(plan).toEqual([
      {
        path: '/tmp/all.json',
        data: [
          { project: 'polygon-pos', ...polygon.distribution },
          { project: 'gnosis', ...gnosis.distribution },
        ],
      },
    ])
  })

  it('writes a single project to an explicit file as config-ready JSON', () => {
    const plan = planStakeDistributionOutput(
      'gnosis',
      { type: 'file', path: '/tmp/gnosis.json' },
      [gnosis],
    )

    expect(plan).toEqual([
      { path: '/tmp/gnosis.json', data: gnosis.distribution },
    ])
  })

  it('fails when a single-project run produced nothing', () => {
    expect(() =>
      planStakeDistributionOutput(
        'gnosis',
        { type: 'file', path: '/tmp/gnosis.json' },
        [],
      ),
    ).toThrow()
  })
})
