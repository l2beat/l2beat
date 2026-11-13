import type { ProjectLiquidStakingRisks } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { buildLiquidStakingSummary } from './getLiquidStakingSummary'

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
})

function point(timestamp: number, projects: Record<string, number | null>) {
  return { timestamp, projects }
}
