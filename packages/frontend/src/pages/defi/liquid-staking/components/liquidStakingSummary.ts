import { UnixTime } from '@l2beat/shared-pure'
import type { EthSupply } from '~/server/features/defi/liquid-staking/getEthSupply'
import type { LiquidStakingTvlPoint } from '~/server/features/defi/liquid-staking/getLiquidStakingTvlChart'

/** An amount of ETH and the share it is of something. */
export interface EthShare {
  eth: number
  share: number
}

/** A change in ETH, relative and absolute, between two days. */
export interface EthChange {
  value: number
  eth: number
  since: number
  until: number
}

export interface LiquidStakingSummaryStats {
  /** The day the latest stake is from. */
  timestamp: number
  /** ETH held by all active validators. */
  ethStaked: number
  /** ETH's USD price on the latest day, when known. */
  ethPrice?: number
  /** The supply the stake is a share of, when it is known. */
  ethSupply?: number
  /** The stake as a share of all ETH, when the supply is known. */
  supplyShare?: number
  /** The listed protocols' ETH, as a share of the stake. */
  liquid?: EthShare
  /** ETH staked outside the listed protocols, as a share of the stake. */
  others?: EthShare
  /** Each listed protocol's latest ETH and share of the stake, largest first. */
  byProject?: (EthShare & { id: string })[]
  /** The protocol with the most ETH, as a share of the stake. */
  largest?: EthShare & { id: string }
}

/**
 * The numbers beside the value locked chart, from its points (oldest first).
 * Shares come from the latest day every protocol has a value, so a missing
 * one never makes the others look bigger.
 */
export function getLiquidStakingSummary(
  points: LiquidStakingTvlPoint[],
  projectKeys: string[],
  ethSupply: number | undefined,
): LiquidStakingSummaryStats | undefined {
  const staked = points.filter((point) => point.ethStaked != null)
  const latest = staked.at(-1)
  if (!latest?.ethStaked) return undefined

  const complete = staked.findLast((point) =>
    projectKeys.every((key) => point.projects[key] != null),
  )
  const completeStake = complete?.ethStaked
  const byProject =
    complete && completeStake
      ? projectKeys
          .map((id) => {
            const eth = complete.projects[id] ?? 0
            return { id, eth, share: eth / completeStake }
          })
          .sort((a, b) => b.eth - a.eth)
      : undefined
  const liquidEth = byProject?.reduce((sum, { eth }) => sum + eth, 0)
  const othersEth =
    liquidEth !== undefined && completeStake != null
      ? completeStake - liquidEth
      : undefined

  return {
    timestamp: latest.timestamp,
    ethStaked: latest.ethStaked,
    ethPrice: latest.ethPrice ?? undefined,
    ethSupply,
    supplyShare: ethSupply ? latest.ethStaked / ethSupply : undefined,
    liquid:
      liquidEth !== undefined && completeStake
        ? { eth: liquidEth, share: liquidEth / completeStake }
        : undefined,
    others:
      othersEth !== undefined && othersEth >= 0 && completeStake
        ? { eth: othersEth, share: othersEth / completeStake }
        : undefined,
    byProject,
    largest: byProject?.[0],
  }
}

/**
 * The supply's change over the past year, from its daily history (oldest
 * first). Starts at the first day within the year, so a history a day short
 * of a year still gives a change, dated by its own first day.
 */
export function getSupplyChange(
  history: EthSupply[],
  days = 365,
): EthChange | undefined {
  const latest = history.at(-1)
  if (!latest) return undefined
  const from = latest.timestamp - days * UnixTime.DAY
  const first = history.find((day) => day.timestamp >= from)
  if (!first || first === latest || first.value <= 0) return undefined
  return {
    value: latest.value / first.value - 1,
    eth: latest.value - first.value,
    since: first.timestamp,
    until: latest.timestamp,
  }
}

/**
 * The stake's change over the past year, from the value locked chart's
 * points (oldest first), between the first and the latest day with a stake.
 */
export function getStakeChange(
  points: LiquidStakingTvlPoint[],
  days = 365,
): EthChange | undefined {
  const staked = points.filter((point) => point.ethStaked != null)
  const latest = staked.at(-1)
  if (!latest?.ethStaked) return undefined
  const from = latest.timestamp - days * UnixTime.DAY
  const first = staked.find((point) => point.timestamp >= from)
  if (!first?.ethStaked || first === latest) return undefined
  return {
    value: latest.ethStaked / first.ethStaked - 1,
    eth: latest.ethStaked - first.ethStaked,
    since: first.timestamp,
    until: latest.timestamp,
  }
}

/**
 * The period a change covers, as the site writes it after a percent change
 * ("/ 1y"); a year short by a day or two still reads as one.
 */
export function formatChangePeriod(change: EthChange): string {
  const days = Math.round((change.until - change.since) / UnixTime.DAY)
  return days >= 360 ? '1y' : `${days}d`
}
