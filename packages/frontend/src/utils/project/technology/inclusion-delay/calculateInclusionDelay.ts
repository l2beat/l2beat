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

/** A single sampled point of one inclusion-delay line (project or Ethereum). */
export interface InclusionDelayPoint {
  censoringFraction: number
  delayDays: number | null
}

/**
 * A row of the rendered chart: one entry per censoring fraction, with one key
 * per series (project slug or the Ethereum reference). Produced by merging any
 * number of series with {@link mergeInclusionDelaySeries}.
 */
export interface InclusionDelayChartDataPoint {
  timestamp: number
  censoringFraction: number
  [key: string]: number | null | undefined
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
  projectPoints: InclusionDelayPoint[]
  ethereumPoints: InclusionDelayPoint[]
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
  const projectPoints = buildProjectPoints(model)
  return {
    projectPoints,
    ethereumPoints: getEthereumComparisonDelay(
      model.maxCensorFraction,
      model.target,
    ),
    entityLegendEntries: buildEntityLegendEntries(
      model,
      chart.stakeDistribution,
    ),
    thresholdMarkers: buildThresholdMarkers(projectPoints, thresholds),
  }
}

/** The project's own inclusion-delay line, sampled across the fraction range. */
export function getProjectInclusionDelay(
  chart: ProjectInclusionDelayChart,
): InclusionDelayPoint[] {
  return buildProjectPoints(createInclusionDelayModel(chart))
}

function buildProjectPoints(model: InclusionDelayModel): InclusionDelayPoint[] {
  return getSampledCensoringFractions(model.maxCensorFraction).map(
    (censoringFraction) => ({
      censoringFraction,
      delayDays: model.calculateDelayDays(censoringFraction),
    }),
  )
}

/**
 * The Ethereum inclusion-delay reference line. It only depends on the censoring
 * fraction and the confidence target, so it is computed independently of any
 * project model and can be reused as a single baseline across projects.
 */
export function getEthereumComparisonDelay(
  maxCensorFraction: number,
  target: number,
): InclusionDelayPoint[] {
  return getSampledCensoringFractions(maxCensorFraction).map(
    (censoringFraction) => ({
      censoringFraction,
      delayDays: calculateEthereumComparisonDelayDaysForFraction({
        censoringFraction,
        slotSeconds: ETHEREUM_COMPARISON_SLOT_SECONDS,
        target,
      }),
    }),
  )
}

/**
 * Merges named series into chart rows keyed by censoring fraction, so the chart
 * can draw one line per series on a shared x-axis. Series may cover different
 * fraction ranges; missing values stay undefined and are connected across.
 */
export function mergeInclusionDelaySeries(
  series: { key: string; points: InclusionDelayPoint[] }[],
): InclusionDelayChartDataPoint[] {
  const rows = new Map<number, InclusionDelayChartDataPoint>()

  for (const { key, points } of series) {
    for (const point of points) {
      const existing = rows.get(point.censoringFraction) ?? {
        timestamp: point.censoringFraction,
        censoringFraction: point.censoringFraction,
      }
      existing[key] = point.delayDays
      rows.set(point.censoringFraction, existing)
    }
  }

  return [...rows.values()].sort(
    (a, b) => a.censoringFraction - b.censoringFraction,
  )
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

    const stakeFraction = roundToCensoringStep(
      cumulativeStake / distribution.totalStake,
    )
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
  points: InclusionDelayPoint[],
  thresholds: readonly { label: string; days: number }[],
): InclusionDelayThresholdMarker[] {
  return thresholds.flatMap((threshold) => {
    const censoringFraction = findFractionAtDelay(points, threshold.days)
    if (censoringFraction === undefined) return []

    return [
      {
        id: `delay-threshold-${threshold.label}`,
        label: `${threshold.label} delay`,
        censoringFraction: snapUpToCensoringStep(censoringFraction),
        delayDays: threshold.days,
      },
    ]
  })
}

function findFractionAtDelay(
  points: InclusionDelayPoint[],
  thresholdDays: number,
): number | undefined {
  for (let i = 0; i < points.length; i++) {
    const point = points[i]
    if (!point || point.delayDays === null) continue
    const delay = point.delayDays
    if (delay < thresholdDays) continue

    const prev = i > 0 ? points[i - 1] : undefined
    const prevDelay = prev?.delayDays ?? null

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

// Snaps a censoring fraction to the sampling grid so markers line up with an
// actual curve point rather than landing between samples (which would show as a
// marker slightly off the line, most visibly in log scale).
function roundToCensoringStep(fraction: number): number {
  return (
    Math.round(fraction / CENSORING_FRACTION_STEP) * CENSORING_FRACTION_STEP
  )
}

// Snaps a threshold crossing up to the first sampled fraction that reaches the
// threshold. Rounding to the nearest step (as roundToCensoringStep does) could
// move the marker back to the previous sample, where the delay is still below
// the threshold, drawing it above the curve and understating the censorship
// fraction needed. The epsilon absorbs floating-point error so a crossing that
// already sits on the grid is not nudged to the next step.
function snapUpToCensoringStep(fraction: number): number {
  const steps = fraction / CENSORING_FRACTION_STEP
  return Math.ceil(steps) * CENSORING_FRACTION_STEP
}

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
