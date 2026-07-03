import type {
  ChainsSummaryBackendChain,
  ChainsSummaryFrontendChain,
  ChainsSummaryRow,
  EnvironmentChainSummaryData,
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
        production: buildEnvironmentData(
          productionFrontend,
          productionBackend,
          id,
        ),
        staging: buildEnvironmentData(stagingFrontend, stagingBackend, id),
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
        row.production.frontend.enabled !== row.production.backend.capture ||
        row.staging.frontend.enabled !== row.staging.backend.capture,
    ).length,
  }
}

function isEnabledSomewhere(row: ChainsSummaryRow) {
  return (
    isProdEnabled(row) ||
    isStagingEnabled(row) ||
    row.production.frontend.upcoming ||
    row.staging.frontend.upcoming
  )
}

function isProdEnabled(row: ChainsSummaryRow) {
  const { frontend, backend } = row.production
  return frontend.enabled || backend.capture || backend.oneSided
}

function isStagingEnabled(row: ChainsSummaryRow) {
  const { frontend, backend } = row.staging
  return frontend.enabled || backend.capture || backend.oneSided
}

function buildEnvironmentData(
  frontend: Map<string, ChainsSummaryFrontendChain>,
  backend: Map<string, ChainsSummaryBackendChain>,
  id: string,
): EnvironmentChainSummaryData {
  return {
    frontend: {
      enabled: frontend.has(id),
      upcoming: frontend.get(id)?.isUpcoming ?? false,
    },
    backend: {
      capture: backend.get(id)?.enabledOnCapture ?? false,
      oneSided: backend.get(id)?.enabledOnOneSided ?? false,
    },
  }
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
