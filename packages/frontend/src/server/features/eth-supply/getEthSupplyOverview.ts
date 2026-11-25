import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import {
  computeYieldChart,
  toEth,
} from '~/server/features/defi/liquid-staking/computeLiquidStakingCharts'
import { buildSupplyDays, getDailyIssuance } from './computeEthSupply'
import dailyBurnSnapshot from './data/dailyBurnSnapshot.json'
import type { EthSupplyOverview } from './types'

/** EthereumStakingDaily, which the issuance is measured from, starts here. */
const ISSUANCE_START = UnixTime.fromDate(new Date('2024-01-01T00:00:00Z'))

/**
 * Total supply at the end of 2026-11-15 UTC (block 26,417,557), from
 * ethsupply.fyi's Erigon + Prysm supply ledger.
 */
const SUPPLY_ANCHOR = {
  timestamp: UnixTime.fromDate(new Date('2026-11-15T00:00:00Z')),
  totalSupply: 122_221_782.82,
}

export async function getEthSupplyOverview(): Promise<EthSupplyOverview> {
  const burn = getDailyBurn()
  if (env.MOCK) return getMockEthSupplyOverview(burn)

  const db = getDb()
  const now = UnixTime.now()
  const [stakingDays, prices] = await Promise.all([
    db.ethereumStakingDaily.getInRange(ISSUANCE_START, now),
    db.tvsPrice.getPricesInRangeByPriceId('ethereum', ISSUANCE_START, now),
  ])

  const days = buildSupplyDays({
    issuance: getDailyIssuance(stakingDays),
    burn,
    ethPrices: new Map(
      prices
        .filter((p) => p.timestamp === UnixTime.toStartOf(p.timestamp, 'day'))
        .map((p) => [p.timestamp, p.priceUsd]),
    ),
    anchor: SUPPLY_ANCHOR,
  })

  const latest = stakingDays.at(-1)
  const [staking] = latest
    ? computeYieldChart({
        days: [latest.timestamp],
        projectIds: [],
        snapshots: [],
        network: stakingDays,
        ethPrices: new Map(),
      })
    : []

  const supplyByDay = new Map(days.map((d) => [d.timestamp, d.totalSupply]))
  return {
    days,
    staking:
      staking?.ethStaked != null
        ? {
            timestamp: staking.timestamp,
            ethStaked: staking.ethStaked,
            networkYield: staking.network,
            stakedShareHistory: stakingDays.flatMap((d) => {
              const supply = supplyByDay.get(d.timestamp)
              return supply
                ? [
                    {
                      timestamp: d.timestamp,
                      share: toEth(d.activeBalance) / supply,
                    },
                  ]
                : []
            }),
          }
        : undefined,
  }
}

/**
 * Daily EIP-1559 base fee and EIP-4844 blob fee burn in ETH by UTC day,
 * exported from Dune until an indexer tracks it.
 */
function getDailyBurn(): Map<number, number> {
  return new Map(
    (dailyBurnSnapshot as [string, number, number][]).map(
      ([day, baseFees, blobFees]) => [
        UnixTime.fromDate(new Date(`${day}T00:00:00Z`)),
        baseFees + blobFees,
      ],
    ),
  )
}

/** The real burn with a flat, made-up issuance and price. */
function getMockEthSupplyOverview(
  burn: Map<number, number>,
): EthSupplyOverview {
  const issuance = new Map([...burn.keys()].map((day) => [day, 2_700]))
  const ethPrices = new Map([...burn.keys()].map((day) => [day, 3_000]))
  const days = buildSupplyDays({
    issuance,
    burn,
    ethPrices,
    anchor: SUPPLY_ANCHOR,
  })
  const last = days.at(-1)
  return {
    days,
    staking: last
      ? {
          timestamp: last.timestamp,
          ethStaked: 36_000_000,
          networkYield: 0.03,
          stakedShareHistory: days.map((d) => ({
            timestamp: d.timestamp,
            share: 36_000_000 / d.totalSupply,
          })),
        }
      : undefined,
  }
}
