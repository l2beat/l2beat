import type { ProjectLiquidStakingRisks } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  buildLiquidStakingSummary,
  getLatestEthStaked,
} from './getLiquidStakingSummary'

describe(buildLiquidStakingSummary.name, () => {
  it('takes the latest value of each chart, unless it is over 30 days old', () => {
    const today = UnixTime.toStartOf(UnixTime.now(), 'day')
    const stale = today - 40 * UnixTime.DAY

    const summary = buildLiquidStakingSummary(
      'lido',
      {} as ProjectLiquidStakingRisks,
      undefined,
      {
        yield: [point(stale, { lido: 0.03 }), point(today, { lido: null })].map(
          (p) => ({ ...p, network: null, ethStaked: null, ethStakedUsd: null }),
        ),
        costOfExit: [
          { ...point(stale, { lido: 1 }), estimated: [] },
          { ...point(today - UnixTime.DAY, { lido: 2 }), estimated: ['lido'] },
          { ...point(today, { lido: null }), estimated: [] },
        ],
      },
    )

    expect(summary.yield).toEqual(undefined)
    expect(summary.costOfExit).toEqual({
      value: 2,
      timestamp: today - UnixTime.DAY,
      estimated: true,
    })
  })

  it('divides the TVL in ETH by the latest ETH staked at or before it', () => {
    const today = UnixTime.toStartOf(UnixTime.now(), 'day')
    const yesterday = today - UnixTime.DAY

    const summary = buildLiquidStakingSummary(
      'lido',
      {} as ProjectLiquidStakingRisks,
      { valueUsd: 30_000_000_000, valueEth: 8_000_000, timestamp: today - 1 },
      {
        yield: [
          {
            ...point(yesterday, {}),
            network: null,
            ethStaked: 32_000_000,
            ethStakedUsd: null,
          },
          {
            ...point(today, {}),
            network: null,
            ethStaked: 40_000_000,
            ethStakedUsd: null,
          },
        ],
        costOfExit: [],
      },
    )

    expect(summary.totalValueLockedUsd).toEqual(30_000_000_000)
    expect(summary.stakedEthShare).toEqual({
      value: 0.25,
      timestamp: yesterday,
    })
  })

  it('has no share without the TVL in ETH or a stake under 3 days older', () => {
    const today = UnixTime.toStartOf(UnixTime.now(), 'day')
    const yieldChart = (timestamp: number) => [
      {
        ...point(timestamp, {}),
        network: null,
        ethStaked: 32_000_000,
        ethStakedUsd: null,
      },
    ]

    const withoutEth = buildLiquidStakingSummary(
      'lido',
      {} as ProjectLiquidStakingRisks,
      { valueUsd: 30_000_000_000, timestamp: today },
      { yield: yieldChart(today), costOfExit: [] },
    )
    const stale = buildLiquidStakingSummary(
      'lido',
      {} as ProjectLiquidStakingRisks,
      { valueUsd: 30_000_000_000, valueEth: 8_000_000, timestamp: today },
      { yield: yieldChart(today - 4 * UnixTime.DAY), costOfExit: [] },
    )

    expect(withoutEth.stakedEthShare).toEqual(undefined)
    expect(stale.stakedEthShare).toEqual(undefined)
  })
})

describe(getLatestEthStaked.name, () => {
  const today = UnixTime.toStartOf(UnixTime.now(), 'day')

  it('takes the latest day with a stake', () => {
    const points = [
      stakePoint(today - 2 * UnixTime.DAY, 33_000_000, 99e9),
      stakePoint(today - UnixTime.DAY, 34_000_000, 100e9),
      stakePoint(today, null, null),
    ]

    expect(getLatestEthStaked(points)).toEqual({
      value: 34_000_000,
      valueUsd: 100e9,
      timestamp: today - UnixTime.DAY,
    })
  })

  it('has no stake when the latest is over 3 days old', () => {
    const points = [stakePoint(today - 4 * UnixTime.DAY, 34_000_000, null)]

    expect(getLatestEthStaked(points)).toEqual(undefined)
  })
})

function stakePoint(
  timestamp: number,
  ethStaked: number | null,
  ethStakedUsd: number | null,
) {
  return { ...point(timestamp, {}), network: null, ethStaked, ethStakedUsd }
}

function point(timestamp: number, projects: Record<string, number | null>) {
  return { timestamp, projects }
}
