import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import { ChartRange } from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/rangeToDays'

export const TvsChartByProjectChainParams = v.object({
  projectId: v.string(),
  chain: v.string(),
  range: ChartRange,
})

export type TvsChartByProjectChainParams = v.infer<
  typeof TvsChartByProjectChainParams
>

export interface TvsChartByProjectChainResponse {
  chart: [timestamp: number, value: number][]
  syncedUntil: number | undefined
}

/**
 * The daily value of a project's escrows on one chain, for the chart of a
 * privacy project tracked on several chains. Escrow values are stored since
 * the 2026-10-28 recompute, so the chart starts there at the earliest.
 */
export async function getTvsChartByProjectChain(
  params: TvsChartByProjectChainParams,
): Promise<TvsChartByProjectChainResponse> {
  if (env.MOCK) {
    return getMockTvsChartByProjectChain(params)
  }

  const [from, to] = params.range
  const rows = await getDb().tvsEscrowValue.getDailyValueByProjectAndChain(
    params.projectId,
    params.chain,
    UnixTime(from ?? 0),
    UnixTime(to + 1),
  )
  const last = rows.at(-1)
  return {
    chart: rows.map((row) => [row.timestamp, row.value]),
    syncedUntil: last?.timestamp,
  }
}

function getMockTvsChartByProjectChain(
  params: TvsChartByProjectChainParams,
): TvsChartByProjectChainResponse {
  const days = rangeToDays(params.range) ?? 365
  const to = UnixTime.toStartOf(UnixTime.now(), 'day')
  const from = params.range[0] ?? to - days * UnixTime.DAY
  const base = Math.random() * 10_000_000 + 100_000
  const chart = generateTimestamps([UnixTime(from), UnixTime(to)], 'day').map(
    (timestamp): [number, number] => [
      timestamp,
      base * (0.8 + Math.random() * 0.4),
    ],
  )
  return { chart, syncedUntil: to }
}
