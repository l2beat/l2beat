import type {
  ProjectCommitteeLikeInclusionDelayChart,
  ProjectEthereumLikeInclusionDelayChart,
  ProjectInclusionDelayChart,
  ProjectInclusionDelayChartEntityStake,
  ProjectSpanLikeInclusionDelayChart,
} from '@l2beat/config'

const ETHEREUM_COMPARISON_SLOT_SECONDS = 12
const SECONDS_PER_DAY = 86_400

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

export interface InclusionDelayThresholdMarker {
  id: string
  label: string
  censoringFraction: number
  delayDays: number
}

export function getInclusionDelayChartData(
  chart: ProjectInclusionDelayChart,
): InclusionDelayChartPoint[] {
  validateChart(chart)

  const censorCounts = getSampledCensorCounts(
    chart.validatorCount,
    chart.maxCensorFraction,
    getCriticalCensorCounts(chart),
  )

  return censorCounts.map((censorCount) => {
    const censoringFraction = censorCount / chart.validatorCount

    return {
      censoringFraction,
      projectDelayDays: calculateProjectDelayDays(chart, censorCount),
      ethereumDelayDays: calculateEthereumComparisonDelayDaysForFraction({
        censoringFraction,
        slotSeconds: ETHEREUM_COMPARISON_SLOT_SECONDS,
        target: chart.target,
      }),
    }
  })
}

export function getInclusionDelayEntityLegendEntries(
  chart: ProjectInclusionDelayChart,
): InclusionDelayEntityLegendEntry[] {
  const distribution = chart.entityStakeDistribution
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
    const delayDays =
      stakeFraction <= chart.maxCensorFraction
        ? calculateProjectDelayDays(
            chart,
            Math.round(chart.validatorCount * stakeFraction),
          )
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

export function getInclusionDelayThresholdMarkers(
  chart: ProjectInclusionDelayChart,
  thresholds: readonly {
    label: string
    days: number
  }[] = INCLUSION_DELAY_THRESHOLDS,
): InclusionDelayThresholdMarker[] {
  const maxCensorCount = Math.floor(
    chart.validatorCount * chart.maxCensorFraction,
  )

  return thresholds.flatMap((threshold) => {
    const censorCount = findFirstFiniteCensorCountAtOrAboveDelay(
      chart,
      threshold.days,
      maxCensorCount,
    )
    if (censorCount === undefined) return []

    const delayDays = calculateProjectDelayDays(chart, censorCount)
    if (delayDays === null) return []

    return [
      {
        id: `delay-threshold-${threshold.label}`,
        label: `${threshold.label} delay`,
        censoringFraction: interpolateCensoringFractionForDelay(
          chart,
          censorCount,
          delayDays,
          threshold.days,
        ),
        delayDays: threshold.days,
      },
    ]
  })
}

function findFirstFiniteCensorCountAtOrAboveDelay(
  chart: ProjectInclusionDelayChart,
  thresholdDays: number,
  maxCensorCount: number,
) {
  let low = 0
  let high = maxCensorCount
  let result: number | undefined

  while (low <= high) {
    const censorCount = Math.floor((low + high) / 2)
    const delayDays = calculateProjectDelayDays(chart, censorCount)

    if (delayDays === null || delayDays >= thresholdDays) {
      result = censorCount
      high = censorCount - 1
    } else {
      low = censorCount + 1
    }
  }

  if (result === undefined) return undefined

  const delayDays = calculateProjectDelayDays(chart, result)
  if (delayDays === null || delayDays < thresholdDays) return undefined

  return result
}

function interpolateCensoringFractionForDelay(
  chart: ProjectInclusionDelayChart,
  censorCount: number,
  delayDays: number,
  thresholdDays: number,
) {
  if (censorCount === 0) return 0

  const previousDelayDays = calculateProjectDelayDays(chart, censorCount - 1)
  if (previousDelayDays === null || previousDelayDays >= thresholdDays) {
    return censorCount / chart.validatorCount
  }

  if (delayDays === previousDelayDays) {
    return censorCount / chart.validatorCount
  }

  const progress =
    (thresholdDays - previousDelayDays) / (delayDays - previousDelayDays)

  return (censorCount - 1 + progress) / chart.validatorCount
}

function getSortedPositiveEntities(
  entities: ProjectInclusionDelayChartEntityStake[],
) {
  return [...entities]
    .filter((entity) => Number.isFinite(entity.stake) && entity.stake > 0)
    .sort((a, b) => b.stake - a.stake)
}

export function calculateProjectDelayDays(
  chart: ProjectInclusionDelayChart,
  censorCount: number,
): number | null {
  switch (chart.type) {
    case 'ethereumlike':
      return calculateEthereumLikeDelayDays(chart, censorCount)
    case 'spanlike':
      return calculateSpanLikeDelayDays(chart, censorCount)
    case 'committeelike':
      return calculateCommitteeLikeDelayDays(chart, censorCount)
  }
}

export function calculateEthereumLikeDelayDays(
  chart: ProjectEthereumLikeInclusionDelayChart,
  censorCount: number,
): number | null {
  return calculateSingleProposerDelayDays({
    validatorCount: chart.validatorCount,
    censorCount,
    target: chart.target,
    firstOpportunitySeconds: chart.slotSeconds,
    missedOpportunitySeconds: chart.slotSeconds,
    minHonestFraction: 0.5,
  })
}

export function calculateSpanLikeDelayDays(
  chart: ProjectSpanLikeInclusionDelayChart,
  censorCount: number,
): number | null {
  return calculateSingleProposerDelayDays({
    validatorCount: chart.validatorCount,
    censorCount,
    target: chart.target,
    firstOpportunitySeconds: chart.blockSeconds,
    missedOpportunitySeconds: chart.spanBlocks * chart.blockSeconds,
    minHonestFraction: 2 / 3,
  })
}

export function calculateCommitteeLikeDelayDays(
  chart: ProjectCommitteeLikeInclusionDelayChart,
  censorCount: number,
): number | null {
  if (censorCount === 0) return chart.slotSeconds / SECONDS_PER_DAY

  const probabilities = getCommitteeCensorProbabilities(
    chart.validatorCount,
    chart.committeeSize,
    censorCount,
  )

  const survivalAtSlots = (slots: number) => {
    return probabilities.reduce((sum, { censoringCommitteeMembers, p }) => {
      const pointSurvival =
        censoringCommitteeMembers > chart.blockingThreshold
          ? 1
          : (censoringCommitteeMembers / chart.committeeSize) ** slots

      return sum + p * pointSurvival
    }, 0)
  }

  const targetSurvival = 1 - chart.target
  const residualSurvival = Array.from({ length: chart.epochSlots }, (_, i) =>
    survivalAtSlots(i + 1),
  )
  const epochSurvival = residualSurvival.at(-1)

  if (epochSurvival === undefined) {
    throw new Error('epochSlots must be greater than 0')
  }

  if (epochSurvival >= 1) return null

  let targetSlots: number | undefined
  for (const [i, survival] of residualSurvival.entries()) {
    const residualSlots = i + 1
    const fullEpochs = getRequiredFullEpochs(
      targetSurvival,
      survival,
      epochSurvival,
    )

    const candidateSlots = fullEpochs * chart.epochSlots + residualSlots
    targetSlots =
      targetSlots === undefined
        ? candidateSlots
        : Math.min(targetSlots, candidateSlots)
  }

  if (targetSlots === undefined) return null
  return (targetSlots * chart.slotSeconds) / SECONDS_PER_DAY
}

function calculateSingleProposerDelayDays({
  validatorCount,
  censorCount,
  target,
  firstOpportunitySeconds,
  missedOpportunitySeconds,
  minHonestFraction,
}: {
  validatorCount: number
  censorCount: number
  target: number
  firstOpportunitySeconds: number
  missedOpportunitySeconds: number
  minHonestFraction: number
}): number | null {
  const honestCount = validatorCount - censorCount
  if (honestCount <= minHonestFraction * validatorCount) return null

  const honestOpportunityProbability = honestCount / validatorCount
  if (honestOpportunityProbability >= 1) {
    return firstOpportunitySeconds / SECONDS_PER_DAY
  }

  if (honestOpportunityProbability <= 0) return null

  const targetOpportunities = ceilWithTolerance(
    Math.log(1 - target) / Math.log(1 - honestOpportunityProbability),
  )
  const targetSeconds =
    (targetOpportunities - 1) * missedOpportunitySeconds +
    firstOpportunitySeconds

  return targetSeconds / SECONDS_PER_DAY
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
  if (censoringFraction >= 0.5) return null
  if (censoringFraction <= 0) return slotSeconds / SECONDS_PER_DAY

  const censorSlotProbability = censoringFraction
  const targetSlots = ceilWithTolerance(
    Math.log(1 - target) / Math.log(censorSlotProbability),
  )

  return (targetSlots * slotSeconds) / SECONDS_PER_DAY
}

function getRequiredFullEpochs(
  targetSurvival: number,
  residualSurvival: number,
  epochSurvival: number,
) {
  if (residualSurvival <= targetSurvival) return 0
  if (residualSurvival <= 0) return 0
  if (epochSurvival <= 0) return 1

  return ceilWithTolerance(
    Math.log(targetSurvival / residualSurvival) / Math.log(epochSurvival),
  )
}

function ceilWithTolerance(value: number) {
  const rounded = Math.round(value)
  if (Math.abs(value - rounded) < 1e-12) return rounded

  return Math.ceil(value)
}

function getCommitteeCensorProbabilities(
  validatorCount: number,
  committeeSize: number,
  censorCount: number,
) {
  const logFactorials = getLogFactorials(validatorCount)
  const denominator = logChoose(validatorCount, committeeSize, logFactorials)
  const minCensors = Math.max(0, committeeSize - (validatorCount - censorCount))
  const maxCensors = Math.min(committeeSize, censorCount)

  return Array.from(
    { length: maxCensors - minCensors + 1 },
    (_, i) => minCensors + i,
  ).map((censoringCommitteeMembers) => {
    const p = Math.exp(
      logChoose(censorCount, censoringCommitteeMembers, logFactorials) +
        logChoose(
          validatorCount - censorCount,
          committeeSize - censoringCommitteeMembers,
          logFactorials,
        ) -
        denominator,
    )

    return { censoringCommitteeMembers, p }
  })
}

function getLogFactorials(max: number) {
  const result = new Array<number>(max + 1)
  result[0] = 0

  for (let i = 1; i <= max; i++) {
    result[i] = (result[i - 1] ?? 0) + Math.log(i)
  }

  return result
}

function logChoose(n: number, k: number, logFactorials: number[]) {
  if (k < 0 || k > n) return Number.NEGATIVE_INFINITY

  const nFactorial = logFactorials[n]
  const kFactorial = logFactorials[k]
  const nMinusKFactorial = logFactorials[n - k]
  if (
    nFactorial === undefined ||
    kFactorial === undefined ||
    nMinusKFactorial === undefined
  ) {
    return Number.NEGATIVE_INFINITY
  }

  return nFactorial - kFactorial - nMinusKFactorial
}

function getSampledCensorCounts(
  validatorCount: number,
  maxCensorFraction: number,
  criticalCounts: number[],
) {
  const maxCensorCount = Math.floor(validatorCount * maxCensorFraction)
  const maxPoints = 501

  if (maxCensorCount + 1 <= maxPoints) {
    return Array.from({ length: maxCensorCount + 1 }, (_, i) => i)
  }

  const step = maxCensorCount / (maxPoints - 1)
  const counts = new Set([0, maxCensorCount])

  for (let i = 0; i < maxPoints; i++) {
    counts.add(Math.round(i * step))
  }

  for (const count of criticalCounts) {
    if (count >= 0 && count <= maxCensorCount) {
      counts.add(count)
    }
  }

  return [...counts].sort((a, b) => a - b)
}

function getCriticalCensorCounts(chart: ProjectInclusionDelayChart) {
  switch (chart.type) {
    case 'ethereumlike':
      return [
        Math.floor((chart.validatorCount - 1) / 2),
        Math.ceil(chart.validatorCount / 2),
      ]
    case 'spanlike':
      return [
        Math.ceil(chart.validatorCount / 3) - 1,
        Math.ceil(chart.validatorCount / 3),
      ]
    case 'committeelike':
      return []
  }
}

function validateChart(chart: ProjectInclusionDelayChart) {
  if (chart.validatorCount <= 0) {
    throw new Error('validatorCount must be greater than 0')
  }

  if (chart.target <= 0 || chart.target >= 1) {
    throw new Error('target must be between 0 and 1')
  }

  if (chart.maxCensorFraction < 0 || chart.maxCensorFraction > 1) {
    throw new Error('maxCensorFraction must be between 0 and 1')
  }

  if (chart.type === 'ethereumlike' && chart.slotSeconds <= 0) {
    throw new Error('slotSeconds must be greater than 0')
  }

  if (chart.type === 'spanlike') {
    if (chart.spanBlocks <= 0) {
      throw new Error('spanBlocks must be greater than 0')
    }
    if (chart.blockSeconds <= 0) {
      throw new Error('blockSeconds must be greater than 0')
    }
  }

  if (chart.type === 'committeelike') {
    if (
      chart.committeeSize <= 0 ||
      chart.committeeSize > chart.validatorCount
    ) {
      throw new Error('committeeSize must be between 1 and validatorCount')
    }
    if (chart.epochSlots <= 0) {
      throw new Error('epochSlots must be greater than 0')
    }
    if (chart.slotSeconds <= 0) {
      throw new Error('slotSeconds must be greater than 0')
    }
  }
}
