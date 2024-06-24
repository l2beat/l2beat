import { type Sentiment } from '@l2beat/shared-pure'

export function sortSentiments<TData extends { sentiment: Sentiment }>(
  rowA: TData,
  rowB: TData,
) {
  const sentimentOrderValueA = getSentimentOrderValue(rowA)
  if (sentimentOrderValueA === undefined) {
    return -1
  }
  const sentimentOrderValueB = getSentimentOrderValue(rowB)
  if (sentimentOrderValueB === undefined) {
    return 1
  }

  return sentimentOrderValueA > sentimentOrderValueB ? 1 : -1
}

export function getSentimentOrderValue<T extends { sentiment: Sentiment }>(
  item: T | undefined,
) {
  if (!item || item.sentiment === 'UnderReview') {
    return undefined
  }

  switch (item.sentiment) {
    case 'bad':
      return 0
    case 'warning':
      return 1
    case 'neutral':
      return 2
    case 'good':
      return 3
  }
}
