import { assert, type Sentiment } from '@l2beat/shared-pure'

export function sortByDacMembers<
  TData extends { sentiment: Sentiment; value: string },
>(rowA: TData | undefined, rowB: TData | undefined) {
  const dacMembersA = getDacMembers(rowA?.value)
  const dacMembersB = getDacMembers(rowB?.value)
  if (!dacMembersA && !dacMembersB) {
    return 0
  }
  if (!dacMembersA || !dacMembersB) {
    return dacMembersA ? 1 : -1
  }
  return (
    probabilityOfCompromise(dacMembersB) - probabilityOfCompromise(dacMembersA)
  )
}

function getDacMembers(value: string | undefined) {
  const match = value?.match(/\d+\/\d+/)
  if (!match) {
    return undefined
  }
  const [required, total] = match[0].split('/')
  assert(required && total, 'Invalid dac members')
  return { required: parseInt(required), total: parseInt(total) }
}

/**
 * This function approximates the probability of a compromise in a DAC.
 * With the assumption that the probability of a single member being compromised is 1%.
 */
function probabilityOfCompromise(dacMembers: {
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
  return factorial(total) / (factorial(required) * factorial(total - required))
}

function factorial(num: number): number {
  if (num < 0) {
    return -1
  }
  let factorial = 1
  for (let n = 1; n <= num; n++) {
    factorial *= n
  }
  return factorial
}
