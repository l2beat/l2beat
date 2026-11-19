import type { ChartUnit } from '~/components/chart/types'
import type { LiquidStakingTvlPoint } from '~/server/features/defi/liquid-staking/getLiquidStakingTvlChart'

export const OTHERS_KEY = 'others'

/** The rows the value locked chart plots, in the chosen unit. */
export type TvlRow = { timestamp: number } & Record<string, number | null>

/**
 * The protocols' values and Others in the chosen unit. Others is left out
 * when a protocol has no value, since it would take that protocol's ETH.
 */
export function toRow(
  point: LiquidStakingTvlPoint,
  projectKeys: string[],
  unit: ChartUnit,
): TvlRow {
  const multiplier = unit === 'usd' ? point.ethPrice : 1
  const convert = (value: number | null) =>
    value != null && multiplier != null ? value * multiplier : null

  const row: TvlRow = { timestamp: point.timestamp }
  let protocolsEth = 0
  let complete = true
  for (const key of projectKeys) {
    const value = point.projects[key] ?? null
    if (value === null) complete = false
    else protocolsEth += value
    row[key] = convert(value)
  }
  const othersEth =
    complete && point.ethStaked != null ? point.ethStaked - protocolsEth : null
  // Below zero the inputs disagree, so there is no value to show.
  row[OTHERS_KEY] =
    othersEth != null && othersEth >= 0 ? convert(othersEth) : null
  return row
}
