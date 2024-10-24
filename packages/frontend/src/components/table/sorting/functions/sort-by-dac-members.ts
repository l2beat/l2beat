import { approximateProbabilityOfCompromise } from '@l2beat/config/build/src/utils/approximateCompromiseProbability'
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

  const probabilityA = approximateProbabilityOfCompromise(dacMembersA)
  const probabilityB = approximateProbabilityOfCompromise(dacMembersB)
  return probabilityB - probabilityA
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

console.log([
  approximateProbabilityOfCompromise({ required: 1, total: 1 }),
  approximateProbabilityOfCompromise({ required: 2, total: 3 }),
])
