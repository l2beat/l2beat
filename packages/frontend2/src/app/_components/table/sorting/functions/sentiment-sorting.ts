import { type Sentiment } from '@l2beat/shared-pure'

const sentimentOrder: Sentiment[] = ['bad', 'warning', 'neutral', 'good']

export function sortSentiments<TData extends { sentiment: Sentiment }>(
  rowA: TData | undefined,
  rowB: TData | undefined,
) {
  if (!rowA && !rowB) {
    return 0
  } else if (!rowA) {
    return -1
  } else if (!rowB) {
    return 1
  }
  const sentimentOrderValueA = sentimentOrder.indexOf(rowA.sentiment)
  if (sentimentOrderValueA === -1) {
    return sentimentOrderValueA
  }
  const sentimentOrderValueB = sentimentOrder.indexOf(rowB.sentiment)
  if (sentimentOrderValueB === -1) {
    return -sentimentOrderValueA
  }

  return sentimentOrderValueA > sentimentOrderValueB ? 1 : -1
}
