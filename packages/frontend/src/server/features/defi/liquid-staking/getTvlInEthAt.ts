import type { Project, ProjectLiquidStakingContracts } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { toEth } from './computeLiquidStakingCharts'
import { getLatestAtOrBefore } from './getEthStakedAt'

/** A day's rate stands for the two days after it starts, so a late indexer leaves no gap. */
const MAX_RATE_AGE = 2 * UnixTime.DAY
const MOCK_TVL_ETH = 1_000_000

export type TvlInEthProject = Pick<
  Project<'liquidStaking'>,
  'id' | 'liquidStaking'
>

/**
 * The ETH the tokens counted in a project's TVL stand for at each timestamp:
 * their supply at the protocol's own rate, not at their market price. Null
 * when the supply or the rate is missing.
 */
export async function getTvlInEthAt(
  project: TvlInEthProject,
  timestamps: number[],
): Promise<(number | null)[]> {
  if (timestamps.length === 0) return []
  if (env.MOCK) return timestamps.map(() => MOCK_TVL_ETH)

  const from = Math.min(...timestamps)
  const to = Math.max(...timestamps)
  const token = getTvlToken(project)
  const [tokenValues, snapshots] = await Promise.all([
    getDb().tvsTokenValue.getByProject(
      project.id,
      UnixTime(from),
      UnixTime(to),
    ),
    token.rebasing
      ? []
      : getDb().liquidStakingSnapshot.getDayStartsByProjectsInRange(
          [project.id],
          UnixTime(from - MAX_RATE_AGE),
          UnixTime(to),
        ),
  ])
  return computeTvlInEth(timestamps, token, tokenValues, snapshots)
}

/**
 * The token each protocol's TVL counts. stETH and eETH rebase to stay at one
 * ETH, while Lido's and ether.fi's snapshots read the rate of wstETH and
 * weETH. The others' snapshots read the rate of the token the TVL counts.
 */
export const TVL_TOKENS: Record<
  ProjectLiquidStakingContracts['type'],
  { symbol: string; rebasing: boolean }
> = {
  lido: { symbol: 'stETH', rebasing: true },
  etherfi: { symbol: 'eETH', rebasing: true },
  rocketpool: { symbol: 'rETH', rebasing: false },
  cbeth: { symbol: 'cbETH', rebasing: false },
  wbeth: { symbol: 'wBETH', rebasing: false },
}

export interface TvlToken {
  /** The id of its TVS config. */
  id: string
  rebasing: boolean
}

export function getTvlToken(project: TvlInEthProject): TvlToken {
  const { symbol, rebasing } = TVL_TOKENS[project.liquidStaking.contracts.type]
  return { id: `${project.id}-${symbol}`, rebasing }
}

/**
 * The supply at each timestamp times the latest rate. A timestamp where the
 * TVL counts any other token gets null, since its rate is unknown.
 */
export function computeTvlInEth(
  timestamps: number[],
  token: TvlToken,
  tokenValues: { timestamp: number; tokenId: string; amount: number }[],
  snapshots: { timestamp: number; exchangeRate: bigint }[],
): (number | null)[] {
  const supplyAt = new Map<number, number | null>()
  for (const { timestamp, tokenId, amount } of tokenValues) {
    const onlyToken = tokenId === token.id && !supplyAt.has(timestamp)
    supplyAt.set(timestamp, onlyToken ? amount : null)
  }
  const rates = token.rebasing
    ? timestamps.map(() => 1)
    : getLatestAtOrBefore(
        timestamps,
        snapshots.map((snapshot) => ({
          timestamp: snapshot.timestamp,
          value: toEth(snapshot.exchangeRate),
        })),
        MAX_RATE_AGE,
      )
  return timestamps.map((timestamp, i) => {
    const supply = supplyAt.get(timestamp)
    const rate = rates[i]
    return supply != null && rate != null ? supply * rate : null
  })
}
