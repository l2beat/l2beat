import { Sentiment } from '@l2beat/config'

export function getOrderValueBySentiment<T extends { sentiment: Sentiment }>(
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
