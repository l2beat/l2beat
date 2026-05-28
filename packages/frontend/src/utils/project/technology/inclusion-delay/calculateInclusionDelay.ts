import type {
  ProjectInclusionDelayChart,
  ProjectInclusionDelayChartEntityStake,
  ProjectInclusionDelayChartStakeDistribution,
} from '@l2beat/config'
import { createInclusionDelayModel } from './createModel'
import { singleProposerDelayDaysFromHonestProbability } from './shared'
import type { InclusionDelayModel } from './types'

const ETHEREUM_COMPARISON_SLOT_SECONDS = 12

export const INCLUSION_DELAY_THRESHOLDS = [
  { label: '1h', days: 1 / 24 },
  { label: '1d', days: 1 },
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
] as const

export interface InclusionDelayChartPoint {
  censoringFraction: number
  projectDelayDays: number | null
  ethereumDelayDays: number | null
}

export interface InclusionDelayEntityLegendEntry {
  id: string
  label: string
  entityCount: number
  entityNames: string[]
  stakeFraction: number
  delayDays: number | null
}

export type InclusionDelayEntityMarker = InclusionDelayEntityLegendEntry & {
  delayDays: number
}

export interface InclusionDelayThresholdMarker {
  id: string
  label: string
  censoringFraction: number
  delayDays: number
}

export interface InclusionDelayData {
  chartData: InclusionDelayChartPoint[]
  entityLegendEntries: InclusionDelayEntityLegendEntry[]
  thresholdMarkers: InclusionDelayThresholdMarker[]
}

export interface InclusionDelayChartProps extends InclusionDelayData {
  maxCensorFraction: number
  hasStakeDistribution: boolean
}

export function prepareInclusionDelay(
  chart: ProjectInclusionDelayChart,
): InclusionDelayChartProps {
  return {
    ...getInclusionDelayData(chart),
    maxCensorFraction: chart.maxCensorFraction,
    hasStakeDistribution: chart.stakeDistribution !== undefined,
  }
}

export function getInclusionDelayData(
  chart: ProjectInclusionDelayChart,
  thresholds: readonly {
    label: string
    days: number
  }[] = INCLUSION_DELAY_THRESHOLDS,
): InclusionDelayData {
  const model = createInclusionDelayModel(chart)
  const chartData = buildChartData(model)
  return {
    chartData,
    entityLegendEntries: buildEntityLegendEntries(
      model,
      chart.stakeDistribution,
    ),
    thresholdMarkers: buildThresholdMarkers(chartData, thresholds),
  }
}

function buildChartData(
  model: InclusionDelayModel,
): InclusionDelayChartPoint[] {
  const censorCounts = getSampledCensorCounts(model)

  return censorCounts.map((censorCount) => {
    const censoringFraction = censorCount / model.validatorCount

    return {
      censoringFraction,
      projectDelayDays: model.calculateDelayDays(censorCount),
      ethereumDelayDays: calculateEthereumComparisonDelayDaysForFraction({
        censoringFraction,
        slotSeconds: ETHEREUM_COMPARISON_SLOT_SECONDS,
        target: model.target,
      }),
    }
  })
}

function buildEntityLegendEntries(
  model: InclusionDelayModel,
  distribution: ProjectInclusionDelayChartStakeDistribution | undefined,
): InclusionDelayEntityLegendEntry[] {
  if (
    !distribution ||
    !Number.isFinite(distribution.totalStake) ||
    distribution.totalStake <= 0
  ) {
    return []
  }

  const entities = getSortedPositiveEntities(distribution.entities)

  let cumulativeStake = 0
  const entityNames: string[] = []
  const entries: InclusionDelayEntityLegendEntry[] = []

  for (const [i, entity] of entities.entries()) {
    cumulativeStake += entity.stake
    entityNames.push(entity.name)

    const stakeFraction = cumulativeStake / distribution.totalStake
    if (stakeFraction > 1) break

    const censorCount = Math.min(
      Math.round(model.validatorCount * stakeFraction),
      model.validatorCount,
    )
    const delayDays =
      stakeFraction <= model.maxCensorFraction
        ? model.calculateDelayDays(censorCount)
        : null

    const entityCount = i + 1
    entries.push({
      id: `${entityCount}-${entity.name}`,
      label: `Top ${entityCount}`,
      entityCount,
      entityNames: [...entityNames],
      stakeFraction,
      delayDays,
    })

    if (delayDays === null) break
  }

  return entries
}

function buildThresholdMarkers(
  curve: InclusionDelayChartPoint[],
  thresholds: readonly { label: string; days: number }[],
): InclusionDelayThresholdMarker[] {
  return thresholds.flatMap((threshold) => {
    const censoringFraction = findFractionAtDelay(curve, threshold.days)
    if (censoringFraction === undefined) return []

    return [
      {
        id: `delay-threshold-${threshold.label}`,
        label: `${threshold.label} delay`,
        censoringFraction,
        delayDays: threshold.days,
      },
    ]
  })
}

function findFractionAtDelay(
  curve: InclusionDelayChartPoint[],
  thresholdDays: number,
): number | undefined {
  for (let i = 0; i < curve.length; i++) {
    const point = curve[i]
    if (!point) continue
    const delay = point.projectDelayDays
    if (delay !== null && delay < thresholdDays) continue

    const prev = i > 0 ? curve[i - 1] : undefined
    const prevDelay = prev?.projectDelayDays ?? null

    if (
      !prev ||
      prevDelay === null ||
      prevDelay >= thresholdDays ||
      delay === null ||
      delay === prevDelay
    ) {
      return point.censoringFraction
    }

    const progress = (thresholdDays - prevDelay) / (delay - prevDelay)
    return (
      prev.censoringFraction +
      progress * (point.censoringFraction - prev.censoringFraction)
    )
  }

  return undefined
}

function calculateEthereumComparisonDelayDaysForFraction({
  censoringFraction,
  slotSeconds,
  target,
}: {
  censoringFraction: number
  slotSeconds: number
  target: number
}): number | null {
  return singleProposerDelayDaysFromHonestProbability({
    honestOpportunityProbability: 1 - censoringFraction,
    target,
    firstOpportunitySeconds: slotSeconds,
    missedOpportunitySeconds: slotSeconds,
    minHonestProbability: 0.5,
  })
}

const MAX_CURVE_SAMPLE_POINTS = 501

function getSampledCensorCounts(model: InclusionDelayModel) {
  const maxCensorCount = Math.floor(
    model.validatorCount * model.maxCensorFraction,
  )

  if (maxCensorCount + 1 <= MAX_CURVE_SAMPLE_POINTS) {
    return Array.from({ length: maxCensorCount + 1 }, (_, i) => i)
  }

  const step = maxCensorCount / (MAX_CURVE_SAMPLE_POINTS - 1)
  const counts = new Set([0, maxCensorCount])

  for (let i = 0; i < MAX_CURVE_SAMPLE_POINTS; i++) {
    counts.add(Math.round(i * step))
  }

  for (const count of model.criticalCensorCounts) {
    if (count >= 0 && count <= maxCensorCount) {
      counts.add(count)
    }
  }

  return [...counts].sort((a, b) => a - b)
}

function getSortedPositiveEntities(
  entities: ProjectInclusionDelayChartEntityStake[],
) {
  return [...entities]
    .filter((entity) => Number.isFinite(entity.stake) && entity.stake > 0)
    .sort((a, b) => b.stake - a.stake)
}

export { calculateCommitteeLikeDelayDays } from './committeeLike'
export { calculateEthereumLikeDelayDays } from './ethereumLike'
export { calculateSpanLikeDelayDays } from './spanLike'
