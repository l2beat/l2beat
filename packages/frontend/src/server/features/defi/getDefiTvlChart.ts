import { ProjectId } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import {
  ChartRange,
  type ChartResolution,
  rangeToResolution,
} from '~/utils/range/range'
import { getTvsChartByProjects } from '../tvs/getTvsChartByProjects'
import { getEthPricesAt } from './liquid-staking/getEthPricesAt'
import { getEthStakedAt } from './liquid-staking/getEthStakedAt'
import { getTvlInEthAt } from './liquid-staking/getTvlInEthAt'

export const DefiTvlChartParams = v.object({
  projectId: v.string(),
  range: ChartRange,
  /**
   * Adds the USD value of the ETH staked network-wide to each point, and the
   * TVL's share of it at the protocol's rate.
   */
  withEthStaked: v.boolean().optional(),
})

export type DefiTvlChartParams = v.infer<typeof DefiTvlChartParams>

export interface DefiTvlChartResponse {
  chart: [
    timestamp: number,
    valueUsd: number | null,
    /** Divides the USD values to show them in ETH. */
    ethPrice: number | null,
    ethStakedUsd?: number | null,
    stakedEthShare?: number | null,
  ][]
  resolution: ChartResolution
  syncedUntil: number | undefined
  sourceTimestamp: number | undefined
}

export async function getDefiTvlChart(
  params: DefiTvlChartParams,
): Promise<DefiTvlChartResponse> {
  const response = await getTvlChart(params)
  const timestamps = response.chart.map(([timestamp]) => timestamp)
  const [ethPrices, ethStaked, tvlEth] = await Promise.all([
    getEthPricesAt(timestamps),
    params.withEthStaked ? getEthStakedAt(timestamps) : undefined,
    params.withEthStaked ? getProjectTvlInEthAt(params, timestamps) : undefined,
  ])
  return {
    ...response,
    chart: response.chart.map(([timestamp, valueUsd], i) => {
      const price = ethPrices[i] ?? null
      if (!ethStaked || !tvlEth) return [timestamp, valueUsd, price]
      const stake = ethStaked[i]
      const tvl = tvlEth[i]
      return [
        timestamp,
        valueUsd,
        price,
        stake != null && price != null ? stake * price : null,
        stake && tvl != null ? tvl / stake : null,
      ]
    }),
  }
}

async function getProjectTvlInEthAt(
  params: DefiTvlChartParams,
  timestamps: number[],
): Promise<(number | null)[]> {
  const project = await ps.getProject({
    id: ProjectId(params.projectId),
    select: ['liquidStaking'],
  })
  return project ? getTvlInEthAt(project, timestamps) : []
}

type TvlChart = [timestamp: number, valueUsd: number | null][]

async function getTvlChart(
  params: DefiTvlChartParams,
): Promise<Omit<DefiTvlChartResponse, 'chart'> & { chart: TvlChart }> {
  const projectId = ProjectId(params.projectId)
  const project = await ps.getProject({
    id: projectId,
    select: ['defiInfo'],
  })
  const tvl = project?.defiInfo.tvl

  if (!tvl) {
    return {
      chart: [],
      resolution: 'day',
      syncedUntil: undefined,
      sourceTimestamp: undefined,
    }
  }

  if (env.MOCK || tvl.source === 'l2beat') {
    const result = await getTvsChartByProjects({
      projectIds: [projectId],
      range: params.range,
    })
    return {
      chart: result.chart.map(([timestamp, valuesByProject]) => [
        timestamp,
        valuesByProject[projectId] ?? null,
      ]),
      resolution: rangeToResolution(params.range),
      syncedUntil: result.syncedUntil,
      sourceTimestamp: result.syncedUntil,
    }
  }

  const records = (
    await getDb().defiTvl.getByProjectInRange(
      projectId,
      params.range[0],
      params.range[1],
    )
  ).filter((record) => record.chainCount === tvl.chains.length)
  const latest = records.at(-1)
  const chart: TvlChart = records.map((record) => [
    record.timestamp,
    record.valueUsd,
  ])
  if (latest && latest.timestamp < params.range[1]) {
    chart.push([params.range[1], null])
  }

  return {
    chart,
    // Daily history mixed with an hourly current value, so every point shows its time
    resolution: 'hour',
    syncedUntil: latest?.timestamp,
    sourceTimestamp: latest?.sourceTimestamp,
  }
}
