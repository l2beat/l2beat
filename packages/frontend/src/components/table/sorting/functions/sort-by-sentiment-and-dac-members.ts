import { approximateProbabilityOfCompromise } from '@l2beat/config/build/src/utils/approximateCompromiseProbability'
import { assert, type Sentiment } from '@l2beat/shared-pure'
import { sentimentOrder } from './sort-by-sentiment'

export function sortBySentimentAndDacMembers<
  TData extends { sentiment: Sentiment; value: string },
>(rowA: TData | undefined, rowB: TData | undefined) {
  if (!rowA && !rowB) {
    return 0
  } else if (!rowA) {
    return -1
  } else if (!rowB) {
    return 1
  }
  const sentimentOrderValueA = sentimentOrder.indexOf(rowA.sentiment)
  const sentimentOrderValueB = sentimentOrder.indexOf(rowB.sentiment)

  if (sentimentOrderValueA === -1 || sentimentOrderValueB === -1) {
    return sentimentOrderValueA === -1 ? 1 : -1
  }

  if (sentimentOrderValueA !== sentimentOrderValueB) {
    return sentimentOrderValueA - sentimentOrderValueB
  }

  const dacMembersResult = sortByDacMembers(rowA, rowB)
  if (dacMembersResult !== 0) {
    return dacMembersResult
  }

  return rowA.value.localeCompare(rowB.value)
}

function sortByDacMembers<
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
