import { expect } from 'earl'
import {
  type LiquidStakingTvlPoint,
  trimLeadingIncomplete,
} from './getLiquidStakingTvlChart'

describe(trimLeadingIncomplete.name, () => {
  const point = (
    timestamp: number,
    ethStaked: number | null,
    projects: Record<string, number | null>,
  ): LiquidStakingTvlPoint => ({
    timestamp,
    ethStaked,
    ethPrice: 3000,
    projects,
  })

  it('drops leading days missing a protocol or ETH staked', () => {
    const points = [
      point(1, 100, { lido: 30, etherfi: null }),
      point(2, null, { lido: 30, etherfi: 10 }),
      point(3, 100, { lido: 30, etherfi: 10 }),
      point(4, 105, { lido: 31, etherfi: null }),
    ]

    expect(trimLeadingIncomplete(points, ['lido', 'etherfi'])).toEqual(
      points.slice(2),
    )
  })

  it('keeps all points when no day is complete', () => {
    const points = [
      point(1, 100, { lido: 30, etherfi: null }),
      point(2, 105, { lido: 31, etherfi: null }),
    ]

    expect(trimLeadingIncomplete(points, ['lido', 'etherfi'])).toEqual(points)
  })
})
