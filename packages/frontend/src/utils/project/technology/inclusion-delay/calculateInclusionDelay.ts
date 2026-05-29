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
}

export function prepareInclusionDelay(
  chart: ProjectInclusionDelayChart,
): InclusionDelayChartProps {
  return {
    ...getInclusionDelayData(chart),
    maxCensorFraction: chart.maxCensorFraction,
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
  const censoringFractions = getSampledCensoringFractions(
    model.maxCensorFraction,
  )

  return censoringFractions.map((censoringFraction) => ({
    censoringFraction,
    projectDelayDays: model.calculateDelayDays(censoringFraction),
    ethereumDelayDays: calculateEthereumComparisonDelayDaysForFraction({
      censoringFraction,
      slotSeconds: ETHEREUM_COMPARISON_SLOT_SECONDS,
      target: model.target,
    }),
  }))
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

    const delayDays =
      stakeFraction <= model.maxCensorFraction
        ? model.calculateDelayDays(stakeFraction)
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
    if (!point || point.projectDelayDays === null) continue
    const delay = point.projectDelayDays
    if (delay < thresholdDays) continue

    const prev = i > 0 ? curve[i - 1] : undefined
    const prevDelay = prev?.projectDelayDays ?? null

    if (
      !prev ||
      prevDelay === null ||
      prevDelay >= thresholdDays ||
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

const CENSORING_FRACTION_STEP = 0.001

// Samples the censoring-fraction axis from 0 to maxCensorFraction in fixed 0.1%
// steps, always ending exactly on maxCensorFraction. The resolution is therefore
// independent of the validator count, so small and large sets render the same
// granularity.
function getSampledCensoringFractions(maxCensorFraction: number): number[] {
  if (maxCensorFraction <= 0) return [0]

  const stepCount = Math.ceil(maxCensorFraction / CENSORING_FRACTION_STEP)
  const fractions = new Set<number>()

  for (let i = 0; i <= stepCount; i++) {
    fractions.add(Math.min(i * CENSORING_FRACTION_STEP, maxCensorFraction))
  }

  return [...fractions].sort((a, b) => a - b)
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
