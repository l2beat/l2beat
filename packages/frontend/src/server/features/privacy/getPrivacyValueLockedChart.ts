import type { TvsToken } from '@l2beat/config'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import { ps } from '~/server/projects'
import { calculatePercentageChange } from '~/utils/calculatePercentageChange'
import {
  ChartRange,
  type ChartResolution,
  rangeToResolution,
} from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/rangeToDays'

export const PrivacyValueLockedChartParams = v.object({
  projectId: v.string(),
  range: ChartRange,
  /** One of the project's tracked chains. */
  chain: v.string(),
})

export type PrivacyValueLockedChartParams = v.infer<
  typeof PrivacyValueLockedChartParams
>

export interface PrivacyValueLockedChartResponse {
  chart: [timestamp: number, value: number | null][]
  syncedUntil: number | undefined
}

/** The value locked in a privacy project on one of its tracked chains. */
export async function getPrivacyValueLockedChart({
  projectId,
  range,
  chain,
}: PrivacyValueLockedChartParams): Promise<PrivacyValueLockedChartResponse> {
  const resolution = rangeToResolution(range)
  const rows = await getChainValueHistory(projectId, chain, range, resolution)
  const last = rows.at(-1)
  const first = rows[0]
  if (!first || !last) {
    return { chart: [], syncedUntil: undefined }
  }

  const values = new Map(rows.map((row) => [row.timestamp, row.value]))
  const from = range[0] === null ? first.timestamp : range[0]
  return {
    chart: generateTimestamps(
      [UnixTime(Math.max(from, first.timestamp)), last.timestamp],
      resolution,
      { addTarget: true },
    ).map((timestamp) => [timestamp, values.get(timestamp) ?? null]),
    syncedUntil: last.timestamp,
  }
}

export interface PrivacyChainValue {
  value: number
  /** Undefined while the chain has less than seven days of history. */
  change7d: number | undefined
}

/** What each of the chains holds now, with its change over seven days. */
export async function getPrivacyChainValues(
  projectId: string,
  chains: string[],
): Promise<Map<string, PrivacyChainValue>> {
  const now = UnixTime.now()
  const range: ChartRange = [
    UnixTime.toStartOf(now, 'day') - 8 * UnixTime.DAY,
    now,
  ]
  const entries = await Promise.all(
    chains.map(async (chain) => {
      // Hourly, so the value seven days before is from the same hour.
      const rows = await getChainValueHistory(projectId, chain, range, 'hour')
      const last = rows.at(-1)
      if (!last) return undefined
      const weekBefore = rows.findLast(
        (row) => row.timestamp <= last.timestamp - 7 * UnixTime.DAY,
      )
      return [
        chain,
        {
          value: last.value,
          change7d:
            weekBefore &&
            calculatePercentageChange(last.value, weekBefore.value),
        },
      ] as const
    }),
  )
  return new Map(entries.filter((entry) => entry !== undefined))
}

/**
 * A chain's value over time, oldest first. A token held in one escrow counts
 * for its chain as a whole. A token summed from several escrows counts by the
 * escrow values the backend stores for it. Other tokens count for no chain.
 */
async function getChainValueHistory(
  projectId: string,
  chain: string,
  range: ChartRange,
  resolution: ChartResolution,
): Promise<{ timestamp: UnixTime; value: number }[]> {
  if (env.MOCK) {
    return getMockChainValueHistory(range, resolution)
  }

  const project = await ps.getProject({
    id: ProjectId(projectId),
    select: ['tvsConfig'],
  })
  if (!project) return []

  const db = getDb()
  const dbRange: [UnixTime | null, UnixTime] = [
    range[0] === null ? null : UnixTime(range[0]),
    UnixTime(range[1]),
  ]
  const [tokenRows, escrowRows] = await Promise.all([
    db.tvsTokenValue.getSummedByTokensAtResolution(
      projectId,
      getSingleEscrowTokenIds(project.tvsConfig, chain),
      dbRange,
      resolution,
    ),
    db.tvsEscrowValue.getSummedByChainAtResolution(
      projectId,
      chain,
      dbRange,
      resolution,
    ),
  ])

  const values = new Map<UnixTime, number>()
  for (const row of [...tokenRows, ...escrowRows]) {
    values.set(row.timestamp, (values.get(row.timestamp) ?? 0) + row.value)
  }
  return [...values]
    .map(([timestamp, value]) => ({ timestamp, value }))
    .sort((a, b) => a.timestamp - b.timestamp)
}

function getSingleEscrowTokenIds(
  tvsConfig: TvsToken[],
  chain: string,
): string[] {
  return tvsConfig.flatMap((token) =>
    token.amount.type === 'balanceOfEscrow' && token.amount.chain === chain
      ? [token.id]
      : [],
  )
}

function getMockChainValueHistory(
  range: ChartRange,
  resolution: ChartResolution,
): { timestamp: UnixTime; value: number }[] {
  const days = rangeToDays(range) ?? 365
  const to = UnixTime.toStartOf(UnixTime.now(), resolution)
  const from = range[0] ?? to - days * UnixTime.DAY
  const base = Math.random() * 10_000_000 + 500_000
  return generateTimestamps([UnixTime(from), to], resolution).map(
    (timestamp) => ({ timestamp, value: base * (0.8 + Math.random() * 0.4) }),
  )
}
