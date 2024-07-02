import { type Sentiment } from '@l2beat/shared-pure'

const sentimentOrder: Sentiment[] = ['bad', 'warning', 'neutral', 'good']

export function sortSentiments<TData extends { sentiment: Sentiment }>(
  rowA: TData,
  rowB: TData,
) {
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
