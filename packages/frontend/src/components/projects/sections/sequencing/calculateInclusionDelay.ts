import type {
  ProjectAztecInclusionDelayChart,
  ProjectEthereumInclusionDelayChart,
  ProjectInclusionDelayChart,
  ProjectPolygonInclusionDelayChart,
} from '@l2beat/config'

const ETHEREUM_COMPARISON_SLOT_SECONDS = 12

export interface InclusionDelayChartPoint {
  censoringFraction: number
  projectDelayDays: number | null
  ethereumDelayDays: number | null
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
      ethereumDelayDays: calculateEthereumStyleDelayDaysForFraction({
        censoringFraction,
        slotSeconds: ETHEREUM_COMPARISON_SLOT_SECONDS,
        target: chart.target,
      }),
    }
  })
}

export function calculateProjectDelayDays(
  chart: ProjectInclusionDelayChart,
  censorCount: number,
): number | null {
  switch (chart.type) {
    case 'ethereum':
      return calculateEthereumStyleDelayDays(chart, censorCount)
    case 'polygon':
      return calculatePolygonDelayDays(chart, censorCount)
    case 'aztec':
      return calculateAztecDelayDays(chart, censorCount)
  }
}

export function calculateEthereumStyleDelayDays(
  chart: ProjectEthereumInclusionDelayChart,
  censorCount: number,
): number | null {
  const honestCount = chart.validatorCount - censorCount
  if (honestCount <= censorCount) return null

  const honestSlotProbability = honestCount / chart.validatorCount
  if (honestSlotProbability >= 1) {
    return chart.slotSeconds / 86_400
  }

  if (honestSlotProbability <= 0) return null

  const targetSlots = ceilWithTolerance(
    Math.log(1 - chart.target) / Math.log(1 - honestSlotProbability),
  )

  return (targetSlots * chart.slotSeconds) / 86_400
}

export function calculatePolygonDelayDays(
  chart: ProjectPolygonInclusionDelayChart,
  censorCount: number,
): number | null {
  const honestCount = chart.validatorCount - censorCount
  if (honestCount <= (2 / 3) * chart.validatorCount) return null

  const honestSpanProbability = honestCount / chart.validatorCount
  if (honestSpanProbability >= 1) {
    return chart.blockSeconds / 86_400
  }

  if (honestSpanProbability <= 0) return null

  const targetSpans = ceilWithTolerance(
    Math.log(1 - chart.target) / Math.log(1 - honestSpanProbability),
  )
  const targetBlocks = (targetSpans - 1) * chart.spanBlocks + 1

  return (targetBlocks * chart.blockSeconds) / 86_400
}

export function calculateAztecDelayDays(
  chart: ProjectAztecInclusionDelayChart,
  censorCount: number,
): number | null {
  if (censorCount === 0) return chart.slotSeconds / 86_400

  const probabilities = getAztecCommitteeCensorProbabilities(
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
  return (targetSlots * chart.slotSeconds) / 86_400
}

function calculateEthereumStyleDelayDaysForFraction({
  censoringFraction,
  slotSeconds,
  target,
}: {
  censoringFraction: number
  slotSeconds: number
  target: number
}): number | null {
  if (censoringFraction >= 0.5) return null
  if (censoringFraction <= 0) return slotSeconds / 86_400

  const censorSlotProbability = censoringFraction
  const targetSlots = ceilWithTolerance(
    Math.log(1 - target) / Math.log(censorSlotProbability),
  )

  return (targetSlots * slotSeconds) / 86_400
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

function getAztecCommitteeCensorProbabilities(
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
    case 'ethereum':
      return [
        Math.floor((chart.validatorCount - 1) / 2),
        Math.ceil(chart.validatorCount / 2),
      ]
    case 'polygon':
      return [
        Math.ceil(chart.validatorCount / 3) - 1,
        Math.ceil(chart.validatorCount / 3),
      ]
    case 'aztec':
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

  if (chart.type === 'ethereum' && chart.slotSeconds <= 0) {
    throw new Error('slotSeconds must be greater than 0')
  }

  if (chart.type === 'polygon') {
    if (chart.spanBlocks <= 0) {
      throw new Error('spanBlocks must be greater than 0')
    }
    if (chart.blockSeconds <= 0) {
      throw new Error('blockSeconds must be greater than 0')
    }
  }

  if (chart.type === 'aztec') {
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
