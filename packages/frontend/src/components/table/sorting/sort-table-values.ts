import type { Sentiment, TableReadyValue } from '@l2beat/config'

const sentimentOrder: Record<Sentiment, number> = {
  good: 1,
  neutral: 0,
  warning: -1,
  bad: -2,
  UnderReview: -3,
}

/**
 * Because of how react-table works we need this workaround to make sure
 * items under review are always at the bottom.
 *
 * This should always be paired with: `sortUndefined: 'last'`.
 */
export function adjustTableValue(
  value: TableReadyValue | undefined,
): TableReadyValue | undefined {
  if (value?.sentiment === 'UnderReview') {
    return undefined
  }
  return value
}

export function sortTableValues(
  a: TableReadyValue | undefined,
  b: TableReadyValue | undefined,
) {
  if (!a && !b) return 0
  if (!a) return -1
  if (!b) return 1

  const aSentimentOrder = a.sentiment ? sentimentOrder[a.sentiment] : 0
  const bSentimentOrder = b.sentiment ? sentimentOrder[b.sentiment] : 0

  if (aSentimentOrder !== bSentimentOrder) {
    return aSentimentOrder - bSentimentOrder
  }

  const aOrderHint = a.orderHint ?? 0
  const bOrderHint = b.orderHint ?? 0

  if (aOrderHint !== bOrderHint) {
    return aOrderHint - bOrderHint
  }

  const valueCompare = b.value.localeCompare(a.value)
  if (valueCompare !== 0) {
    return valueCompare
  }

  const secondLineCompare = (b.secondLine ?? '').localeCompare(
    a.secondLine ?? '',
  )
  return secondLineCompare
}
