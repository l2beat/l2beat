import { expect } from 'earl'
import {
  extractStakeDistribution,
  type StakingDataset,
} from './getStakeDistrib'

describe(extractStakeDistribution.name, () => {
  const dataset: StakingDataset = {
    project: 'polygon-pos',
    displayName: 'Polygon staking',
    stakeToken: 'POL',
    stakeDecimals: 18,
    validatorCount: 105,
    totalStakeBaseUnits: 3.5e27,
    entities: [
      { name: 'Small', stakeBaseUnits: 1e26 },
      { name: 'Large', stakeBaseUnits: 2e27 },
      { name: 'Medium', stakeBaseUnits: 1.4e27 },
    ],
  }

  it('keeps source metadata so regeneration never drops it', () => {
    const output = extractStakeDistribution(dataset, 10)

    expect(output.validatorCount).toEqual(105)
    expect(output.stakeToken).toEqual('POL')
    expect(output.totalStake).toEqual(3_500_000_000)
  })

  it('stamps a fetched timestamp when the source has no snapshot date', () => {
    const output = extractStakeDistribution(dataset, 10)

    expect(output.dateType).toEqual('fetched')
    expect(Number.isNaN(Date.parse(output.date))).toEqual(false)
  })

  it('uses the source snapshot date when reported', () => {
    const output = extractStakeDistribution(
      { ...dataset, snapshotDate: '2026-08-05' },
      10,
    )

    expect(output.dateType).toEqual('snapshot')
    expect(output.date).toEqual('2026-08-05')
  })

  it('sorts entities by stake and applies the limit', () => {
    const output = extractStakeDistribution(dataset, 2)

    expect(output.entities).toEqual([
      { name: 'Large', stake: 2_000_000_000 },
      { name: 'Medium', stake: 1_400_000_000 },
    ])
  })

  it('omits entities for aggregate-only sources', () => {
    const output = extractStakeDistribution(
      { ...dataset, entities: undefined },
      10,
    )

    expect('entities' in output).toEqual(false)
  })
})
