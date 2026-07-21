import type {
  AverageDuration,
  InteropTopItemsSort,
  InteropTopItemsSorting,
  TokenData,
  TokensPairData,
} from '../types'

type SortableTopItem = TokenData | TokensPairData

export function sortInteropTopItems<T extends SortableTopItem>(
  items: T[],
  sorting: InteropTopItemsSorting | undefined,
): T[] {
  const effectiveSort = sorting?.[0] ?? { id: 'volume', desc: true }

  return items.toSorted((a, b) => {
    const aValue = getSortValue(a, effectiveSort.id)
    const bValue = getSortValue(b, effectiveSort.id)
    const result = compareValues(aValue, bValue)

    if (result !== 0) {
      if (isMissing(aValue) || isMissing(bValue)) {
        return result
      }

      return effectiveSort.desc ? -result : result
    }

    return compareValues(getStableSortValue(a), getStableSortValue(b))
  })
}

function getSortValue(
  item: SortableTopItem,
  id: InteropTopItemsSort['id'],
): string | number | null | undefined {
  switch (id) {
    case 'symbol':
      return 'symbol' in item ? item.symbol : undefined
    case 'pair':
      return 'tokenA' in item
        ? item.id === 'unknown'
          ? 'Unknown pairs'
          : `${item.tokenA.symbol} ${item.tokenB.symbol}`
        : undefined
    case 'topProtocol':
      return item.topProtocol?.name
    case 'volume':
      return item.volume
    case 'transferCount':
      return item.transferCount
    case 'avgDuration':
      return getAverageDurationSortValue(item.avgDuration)
    case 'avgValue':
      return item.avgValue
    case 'flows':
      return item.flows.reduce((sum, flow) => sum + flow.volume, 0)
    case 'netMintedValue':
      return item.netMintedValue
  }
}

function getAverageDurationSortValue(
  avgDuration: AverageDuration | null,
): number | undefined {
  if (!avgDuration || avgDuration.type === 'unknown') {
    return undefined
  }

  if (avgDuration.type === 'single') {
    return avgDuration.duration
  }

  const durations = avgDuration.splits
    .map((split) => split.duration)
    .filter((duration) => duration !== null)

  return durations.length > 0 ? Math.min(...durations) : undefined
}

function compareValues(
  a: string | number | null | undefined,
  b: string | number | null | undefined,
) {
  const aMissing = isMissing(a)
  const bMissing = isMissing(b)

  if (aMissing && bMissing) return 0
  if (aMissing) return 1
  if (bMissing) return -1

  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b)
  }

  return Number(a) - Number(b)
}

function isMissing(value: string | number | null | undefined) {
  return value === null || value === undefined
}

function getStableSortValue(item: SortableTopItem) {
  return 'symbol' in item ? item.symbol : item.id
}
