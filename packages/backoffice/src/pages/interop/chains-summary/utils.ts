import type {
  ChainsSummaryBackendChain,
  ChainsSummaryFrontendChain,
  ChainsSummaryRow,
} from './types'

const PRODUCTION_FRONTEND_URL = 'https://l2beat.com'

export function getChainsSummaryRows(input: {
  productionBackend: ChainsSummaryBackendChain[] | undefined
  stagingBackend: ChainsSummaryBackendChain[] | undefined
  productionFrontend: ChainsSummaryFrontendChain[] | undefined
  stagingFrontend: ChainsSummaryFrontendChain[] | undefined
  missingTokens: { chain: string }[] | undefined
  suspiciousTransfers: { srcChain: string; dstChain: string }[] | undefined
  notIncludedTransfers: { srcChain: string; dstChain: string }[] | undefined
}): ChainsSummaryRow[] {
  const missingTokenCounts = countBy(input.missingTokens, (item) => [
    item.chain,
  ])
  const suspiciousTransferCounts = countBy(
    input.suspiciousTransfers,
    (item) => [item.srcChain, item.dstChain],
  )
  const notIncludedTransferCounts = countBy(
    input.notIncludedTransfers,
    (item) => [item.srcChain, item.dstChain],
  )

  const metadata = new Map<
    string,
    Pick<
      ChainsSummaryBackendChain,
      'id' | 'name' | 'display' | 'color' | 'iconSlug'
    >
  >()
  for (const chain of input.stagingBackend ?? []) {
    metadata.set(chain.id, chain)
  }
  for (const chain of input.productionBackend ?? []) {
    metadata.set(chain.id, chain)
  }

  const productionFrontend = indexById(input.productionFrontend)
  const stagingFrontend = indexById(input.stagingFrontend)
  const productionBackend = indexById(input.productionBackend)
  const stagingBackend = indexById(input.stagingBackend)
  const chainIds = new Set([
    ...metadata.keys(),
    ...productionFrontend.keys(),
    ...stagingFrontend.keys(),
  ])

  return [...chainIds]
    .map((id) => {
      const meta = metadata.get(id)
      const row: ChainsSummaryRow = {
        id,
        name: meta?.name ?? id,
        display: meta?.display ?? id.slice(0, 3).toUpperCase(),
        color: meta?.color ?? '#888888',
        iconUrl: meta
          ? `${PRODUCTION_FRONTEND_URL}/icons/${meta.iconSlug}.png`
          : undefined,
        enabledOnProductionFrontend: productionFrontend.has(id),
        enabledOnProductionFrontendUpcoming:
          productionFrontend.get(id)?.isUpcoming ?? false,
        enabledOnProductionBackendCapture:
          productionBackend.get(id)?.enabledOnCapture ?? false,
        enabledOnProductionBackendOneSided:
          productionBackend.get(id)?.enabledOnOneSided ?? false,
        enabledOnStagingFrontend: stagingFrontend.has(id),
        enabledOnStagingFrontendUpcoming:
          stagingFrontend.get(id)?.isUpcoming ?? false,
        enabledOnStagingBackendCapture:
          stagingBackend.get(id)?.enabledOnCapture ?? false,
        enabledOnStagingBackendOneSided:
          stagingBackend.get(id)?.enabledOnOneSided ?? false,
        missingTokensCount: countValue(missingTokenCounts, id),
        suspiciousTransfersCount: countValue(suspiciousTransferCounts, id),
        notIncludedTransfersCount: countValue(notIncludedTransferCounts, id),
      }

      return isEnabledSomewhere(row) ? row : undefined
    })
    .filter((row) => row !== undefined)
    .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }))
}

export function getSummaryStats(rows: ChainsSummaryRow[]) {
  return {
    prodOnlyCount: rows.filter(
      (row) => isProdEnabled(row) && !isStagingEnabled(row),
    ).length,
    stagingOnlyCount: rows.filter(
      (row) => isStagingEnabled(row) && !isProdEnabled(row),
    ).length,
    mismatchedCount: rows.filter(
      (row) =>
        row.enabledOnProductionFrontend !==
          row.enabledOnProductionBackendCapture ||
        row.enabledOnStagingFrontend !== row.enabledOnStagingBackendCapture,
    ).length,
  }
}

function isEnabledSomewhere(row: ChainsSummaryRow) {
  return (
    isProdEnabled(row) ||
    isStagingEnabled(row) ||
    row.enabledOnProductionFrontendUpcoming ||
    row.enabledOnStagingFrontendUpcoming
  )
}

function isProdEnabled(row: ChainsSummaryRow) {
  return (
    row.enabledOnProductionFrontend ||
    row.enabledOnProductionBackendCapture ||
    row.enabledOnProductionBackendOneSided
  )
}

function isStagingEnabled(row: ChainsSummaryRow) {
  return (
    row.enabledOnStagingFrontend ||
    row.enabledOnStagingBackendCapture ||
    row.enabledOnStagingBackendOneSided
  )
}

function indexById<T extends { id: string }>(items: T[] | undefined) {
  const map = new Map<string, T>()
  for (const item of items ?? []) map.set(item.id, item)
  return map
}

function countBy<T>(items: T[] | undefined, pickChains: (item: T) => string[]) {
  if (!items) return undefined
  const counts = new Map<string, number>()
  for (const item of items) {
    for (const chain of new Set(pickChains(item))) {
      counts.set(chain, (counts.get(chain) ?? 0) + 1)
    }
  }
  return counts
}

function countValue(counts: Map<string, number> | undefined, id: string) {
  return counts ? (counts.get(id) ?? 0) : undefined
}
