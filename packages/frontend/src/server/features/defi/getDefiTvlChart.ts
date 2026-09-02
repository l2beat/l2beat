import { ProjectId } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { ChartRange } from '~/utils/range/range'
import { getTvsChartByProjects } from '../tvs/getTvsChartByProjects'

export const DefiTvlChartParams = v.object({
  projectId: v.string(),
  range: ChartRange,
})

export type DefiTvlChartParams = v.infer<typeof DefiTvlChartParams>

export interface DefiTvlChartResponse {
  chart: [timestamp: number, valueUsd: number | null][]
  syncedUntil: number | undefined
  sourceTimestamp: number | undefined
}

export async function getDefiTvlChart(
  params: DefiTvlChartParams,
): Promise<DefiTvlChartResponse> {
  const projectId = ProjectId(params.projectId)
  const project = await ps.getProject({
    id: projectId,
    select: ['defiInfo'],
  })
  const tvl = project?.defiInfo.tvl

  if (!tvl) {
    return { chart: [], syncedUntil: undefined, sourceTimestamp: undefined }
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
  const chart: DefiTvlChartResponse['chart'] = records.map((record) => [
    record.timestamp,
    record.valueUsd,
  ])
  if (latest && latest.timestamp < params.range[1]) {
    chart.push([params.range[1], null])
  }

  return {
    chart,
    syncedUntil: latest?.timestamp,
    sourceTimestamp: latest?.sourceTimestamp,
  }
}
