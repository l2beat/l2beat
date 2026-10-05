import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { ps } from '~/server/projects'
import {
  getOssificationSeries,
  type OssificationValueSource,
} from '../projects/ossification/getOssificationSeries'
import { normalizeSeries } from '../projects/ossification/normalizeSeries'

export const AuditsValueSeriesParams = v.object({
  projectId: v.string(),
  from: v.number(),
  to: v.number(),
})
export type AuditsValueSeriesParams = v.infer<typeof AuditsValueSeriesParams>

export interface AuditsValueSeries {
  source: OssificationValueSource
  syncedUntil: number
  /** Daily [timestamp, value], ascending. */
  points: [number, number][]
}

/**
 * The value secured by a project between two timestamps, one sample a day,
 * for the timeline chart of its audits page. Null when the project has no
 * value series.
 */
export async function getAuditsValueSeries({
  projectId,
  from,
  to,
}: AuditsValueSeriesParams): Promise<AuditsValueSeries | null> {
  const project = await ps.getProject({
    id: ProjectId(projectId),
    optional: ['tvsConfig', 'defiInfo'],
  })
  if (!project) return null
  const series = await getOssificationSeries(project, UnixTime(from))
  if (!series) return null

  const points = normalizeSeries(series.points, to).filter(
    (point) => point.timestamp >= from && point.timestamp % UnixTime.DAY === 0,
  )
  const last = points.at(-1)
  if (!last) return null
  return {
    source: series.source,
    syncedUntil: last.timestamp,
    points: points.map((point) => [point.timestamp, Math.round(point.value)]),
  }
}
