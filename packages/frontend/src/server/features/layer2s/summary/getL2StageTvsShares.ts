import type { Stage } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import { env } from '~/env'
import {
  type ChartRange,
  type ChartResolution,
  rangeToResolution,
} from '~/utils/range/range'
import { getSummedTvsValues } from '../tvs/utils/getSummedTvsValues'
import type { L2SummaryEntry } from './getL2SummaryEntries'

export type L2StageShareKey = Stage | 'UnderReview' | 'NotApplicable'

export interface L2StageTvsShares {
  /** Latest value secured per stage, in the order they are drawn. */
  stages: { stage: L2StageShareKey; value: number; projectCount: number }[]
  total: number
  timestamp: number
  /** Of the data the timestamp comes from, to format it. */
  resolution: ChartResolution
}

const STAGE_ORDER: L2StageShareKey[] = [
  'Stage 2',
  'Stage 1',
  'Stage 0',
  'UnderReview',
  'NotApplicable',
]

/**
 * The value secured by each stage on the summary's last chart point. Summed
 * with the chart's own values (`forSummary`), not the table's per-project
 * ones, which count a Layer 3's value again on its host: so the stages add up
 * to the chart's total.
 */
export async function getL2StageTvsShares(
  entries: L2SummaryEntry[],
  range: ChartRange,
): Promise<L2StageTvsShares | undefined> {
  const byStage = groupBy(entries, (e) => e.stage.stage)
  const groups = STAGE_ORDER.map((stage) => ({
    stage,
    // As the chart leaves them out.
    ids: (byStage[stage] ?? [])
      .map((e) => e.id as ProjectId)
      .filter((id) => !env.EXCLUDED_TVS_PROJECTS?.includes(id)),
  })).filter((g) => g.ids.length > 0)

  if (env.MOCK) {
    return getMockShares(groups, byStage)
  }

  const series = await Promise.all(
    groups.map((g) =>
      getSummedTvsValues(g.ids, range, {
        forSummary: true,
        excludeAssociatedTokens: false,
        excludeRwaRestrictedTokens: true,
      }),
    ),
  )

  // The newest timestamp every stage has a value at, so no stage is missing
  // from the sum.
  const timestamp = Math.min(
    ...series.map(
      (s) =>
        s.findLast((p) => p.value !== null)?.timestamp ??
        Number.POSITIVE_INFINITY,
    ),
  )
  if (!Number.isFinite(timestamp)) return undefined

  const stages = groups.map((g, i) => ({
    stage: g.stage,
    value: series[i]?.find((p) => p.timestamp === timestamp)?.value ?? 0,
    projectCount: g.ids.length,
  }))
  const total = stages.reduce((sum, s) => sum + s.value, 0)
  if (total <= 0) return undefined

  return { stages, total, timestamp, resolution: rangeToResolution(range) }
}

function getMockShares(
  groups: { stage: L2StageShareKey; ids: ProjectId[] }[],
  byStage: Record<string, L2SummaryEntry[]>,
): L2StageTvsShares {
  const stages = groups.map((g) => ({
    stage: g.stage,
    value: (byStage[g.stage] ?? []).reduce(
      (sum, e) => sum + Math.max(e.tvsOrder, 0),
      0,
    ),
    projectCount: g.ids.length,
  }))
  return {
    stages,
    total: stages.reduce((sum, s) => sum + s.value, 0),
    timestamp: Math.floor(Date.now() / 1000),
    resolution: 'day',
  }
}
