import type { BackendRouter } from '@l2beat/backend/trpc'
import { v } from '@l2beat/validate'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import type { EnvironmentConfig } from '~/components/environment/EnvironmentContext'
import type {
  ChainsSummaryBackendChain,
  ChainsSummaryFrontendChain,
  ChainsSummaryRow,
} from './types'

export type DeployedEnvironment = 'staging' | 'production'

export const TARGETS: { id: DeployedEnvironment; label: string }[] = [
  { id: 'production', label: 'Production' },
  { id: 'staging', label: 'Staging' },
]

const FRONTEND_URLS: Record<DeployedEnvironment, string> = {
  production: 'https://l2beat.com',
  staging: 'https://fe-stag.l2beat.com',
}

export const LOCAL_FRONTEND_URL =
  (import.meta.env.VITE_LOCAL_FRONTEND_URL as string | undefined) ??
  'http://localhost:3000'

const FrontendChains = v.array(
  v.object({
    id: v.string(),
    isUpcoming: v.boolean(),
  }),
)

interface ConfigEntry {
  id: string
  config: EnvironmentConfig
}

export function getBackendUrl(params: {
  target: DeployedEnvironment
  allConfigs: ConfigEntry[]
  isLocalTesting: boolean
  localBackendUrl: string | undefined
}) {
  if (params.isLocalTesting && params.localBackendUrl) {
    return params.localBackendUrl
  }
  return params.allConfigs.find((c) => c.id === params.target)?.config.url ?? ''
}

export function getFrontendUrl(
  target: DeployedEnvironment,
  isLocalTesting: boolean,
) {
  return isLocalTesting ? LOCAL_FRONTEND_URL : FRONTEND_URLS[target]
}

export function getQueryErrors(
  queries: { error: unknown }[],
): { label: string; error: Error }[] {
  const kinds = ['backend', 'frontend']
  return queries
    .map((query, index) => {
      const target = TARGETS[Math.floor(index / 2)]
      if (!target || !(query.error instanceof Error)) return undefined
      return {
        label: `${target.label} ${kinds[index % 2]}`,
        error: query.error,
      }
    })
    .filter((x) => x !== undefined)
}

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
          ? `${FRONTEND_URLS.production}/icons/${meta.iconSlug}.png`
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

export function fetchBackendChains(
  url: string,
): Promise<ChainsSummaryBackendChain[]> {
  const client = createTRPCClient<BackendRouter>({
    links: [
      httpBatchLink({
        transformer: {
          serialize: JSON.stringify,
          deserialize: JSON.parse,
        },
        url,
        headers: () => {
          const headers = new Headers()
          const backendAuthToken = import.meta.env.VITE_BACKEND_AUTH_TOKEN
          if (backendAuthToken) {
            headers.set('Authorization', backendAuthToken)
          }
          return headers
        },
      }),
    ],
  })

  return client.interop.chains.summary.query()
}

export async function fetchFrontendChains(
  frontendUrl: string,
): Promise<ChainsSummaryFrontendChain[]> {
  const response = await fetch(`${frontendUrl}/api/interop/chains`)
  if (!response.ok) {
    throw new Error(
      `Failed to fetch frontend chains from ${frontendUrl}: ${response.status}`,
    )
  }
  return FrontendChains.parse(await response.json())
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
