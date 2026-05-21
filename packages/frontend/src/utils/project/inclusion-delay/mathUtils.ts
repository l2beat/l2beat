import type { ProjectInclusionDelayConfig } from '@l2beat/config'

export function ceilWithTolerance(value: number) {
  const rounded = Math.round(value)
  if (Math.abs(value - rounded) < 1e-12) return rounded

  return Math.ceil(value)
}

export function getLogFactorials(max: number) {
  const result = new Array<number>(max + 1)
  result[0] = 0

  for (let i = 1; i <= max; i++) {
    result[i] = (result[i - 1] ?? 0) + Math.log(i)
  }

  return result
}

export function logChoose(n: number, k: number, logFactorials: number[]) {
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

export function getSampledCensorCounts(
  validatorCount: number,
  maxCensoringFraction: number,
  criticalCounts: number[],
) {
  const maxCensorCount = Math.floor(validatorCount * maxCensoringFraction)
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

export function getCriticalCensorCounts(config: ProjectInclusionDelayConfig) {
  switch (config.type) {
    case 'singleSlot':
      return [
        Math.floor((config.validatorCount - 1) / 2),
        Math.ceil(config.validatorCount / 2),
      ]
    case 'span':
      return [
        Math.ceil(config.validatorCount / 3) - 1,
        Math.ceil(config.validatorCount / 3),
      ]
    case 'committee':
      return []
  }
}
