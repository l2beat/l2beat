import type { TvsToken } from '@l2beat/config'
import { getEscrowBalances } from '@l2beat/config/build/common/tvsEscrowBalances'
import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import { ps } from '~/server/projects'
import { calculatePercentageChange } from '~/utils/calculatePercentageChange'
import {
  ChartRange,
  type ChartResolution,
  optionToRange,
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
  const project = await ps.getProject({
    id: ProjectId(projectId),
    select: ['tvsConfig'],
  })
  if (!project) {
    return { chart: [], syncedUntil: undefined }
  }
  const resolution = rangeToResolution(range)
  const rows = await getChainValueHistory(
    projectId,
    project.tvsConfig,
    chain,
    range,
    resolution,
  )
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

/**
 * Whether the project's value locked is tracked: on the chain, when the page
 * is about one, which takes a TVS token with an escrow there.
 */
export function hasPrivacyValueLocked(
  tvsConfig: TvsToken[] | undefined,
  chain: string | undefined,
): boolean {
  if (tvsConfig === undefined || chain === undefined) {
    return tvsConfig !== undefined
  }
  return tvsConfig.some((token) =>
    getEscrowBalances(token)?.some((escrow) => escrow.chain === chain),
  )
}

/** What each of the chains holds now, with its change over seven days. */
export async function getPrivacyChainValues(
  projectId: string,
  tvsConfig: TvsToken[],
  chains: string[],
): Promise<Map<string, PrivacyChainValue>> {
  const now = UnixTime.now()
  const range: ChartRange = [
    UnixTime.toStartOf(now, 'day') - 8 * UnixTime.DAY,
    now,
  ]
  // As old as a project's value may be and still be shown as current.
  const [oldestCurrent] = optionToRange('3d')
  assert(oldestCurrent !== null, 'Three days without a start')
  const entries = await Promise.all(
    chains.map(async (chain) => {
      // Hourly, so the value seven days before is from the same hour.
      const rows = await getChainValueHistory(
        projectId,
        tvsConfig,
        chain,
        range,
        'hour',
      )
      const value = getCurrentChainValue(rows, oldestCurrent)
      return value && ([chain, value] as const)
    }),
  )
  return new Map(entries.filter((entry) => entry !== undefined))
}

/**
 * The newest of the rows as the chain's value now. Undefined when it is older
 * than `oldestCurrent`: the chain stopped syncing, or its tokens ended.
 */
export function getCurrentChainValue(
  rows: { timestamp: UnixTime; value: number }[],
  oldestCurrent: number,
): PrivacyChainValue | undefined {
  const last = rows.at(-1)
  if (!last || last.timestamp < oldestCurrent) return undefined
  const weekBefore = rows.findLast(
    (row) => row.timestamp <= last.timestamp - 7 * UnixTime.DAY,
  )
  return {
    value: last.value,
    change7d:
      weekBefore && calculatePercentageChange(last.value, weekBefore.value),
  }
}

/**
 * A chain's value over time, oldest first. A token of one escrow counts for
 * its chain as a whole. A token of several counts by the escrow values the
 * backend stores for it.
 */
async function getChainValueHistory(
  projectId: string,
  tvsConfig: TvsToken[],
  chain: string,
  range: ChartRange,
  resolution: ChartResolution,
): Promise<{ timestamp: UnixTime; value: number }[]> {
  if (env.MOCK) {
    return getMockChainValueHistory(range, resolution)
  }

  const db = getDb()
  const dbRange: [UnixTime | null, UnixTime] = [
    range[0] === null ? null : UnixTime(range[0]),
    UnixTime(range[1]),
  ]
  const [tokenRows, escrowRows] = await Promise.all([
    db.tvsTokenValue.getSummedByTokensAtResolution(
      projectId,
      tvsConfig.flatMap((token) => {
        const escrows = getEscrowBalances(token)
        return escrows?.length === 1 && escrows[0]?.chain === chain
          ? [token.id]
          : []
      }),
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
