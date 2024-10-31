import { factorialize } from '@l2beat/shared-pure'

/**
 * This function approximates the probability of a compromise in a DAC.
 * With the assumption that the probability of a single member being compromised is 1%.
 */
export function approximateProbabilityOfCompromise(dacMembers: {
  required: number
  total: number
}) {
  const combinations = getCombinations(dacMembers.total, dacMembers.required)
  return combinations * 0.01 ** dacMembers.required
}

function getCombinations(total: number, required: number) {
  if (required > total || required < 0) {
    return 0
  }
  return (
    factorialize(total) /
    (factorialize(required) * factorialize(total - required))
  )
}
