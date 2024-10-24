import { type Sentiment } from '@l2beat/shared-pure'

export const sentimentOrder: Sentiment[] = ['bad', 'warning', 'neutral', 'good']

export function sortBySentiment<
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

  return 0
}

export function sortBySentimentAndAlphabetically<
  TData extends { sentiment: Sentiment; value: string },
>(rowA: TData | undefined, rowB: TData | undefined) {
  const sentimentResult = sortBySentiment(rowA, rowB)
  if (sentimentResult !== 0) {
    return sentimentResult
  }

  return (rowA?.value ?? '').localeCompare(rowB?.value ?? '')
}
