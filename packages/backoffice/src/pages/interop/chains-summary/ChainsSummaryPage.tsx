import { useQueries } from '@tanstack/react-query'
import { RefreshCwIcon } from 'lucide-react'
import { useMemo } from 'react'
import { Badge } from '~/components/core/Badge'
import { Button } from '~/components/core/Button'
import { ErrorState } from '~/components/ErrorState'
import { useEnvironment } from '~/components/environment/EnvironmentContext'
import { LoadingState } from '~/components/LoadingState'
import { TablePageLayout } from '~/components/table/TablePageLayout'
import { api } from '~/react-query/trpc'
import { ChainsSummaryTable } from './table/ChainsSummaryTable'
import type {
  ChainsSummaryBackendChain,
  ChainsSummaryFrontendChain,
} from './types'
import {
  fetchBackendChains,
  fetchFrontendChains,
  getBackendUrl,
  getChainsSummaryRows,
  getFrontendUrl,
  getQueryErrors,
  getSummaryStats,
  LOCAL_FRONTEND_URL,
  TARGETS,
} from './utils'

export function ChainsSummaryPage() {
  const { environment, allConfigs } = useEnvironment()
  const isLocalTesting = environment === 'local'
  const localBackendUrl = allConfigs.find((c) => c.id === 'local')?.config.url

  const queries = useQueries({
    queries: TARGETS.flatMap((target) => [
      {
        queryKey: [
          'interop',
          'chains-summary',
          'backend',
          target.id,
          isLocalTesting ? 'local' : 'remote',
        ],
        queryFn: () =>
          fetchBackendChains(
            getBackendUrl({
              target: target.id,
              allConfigs,
              isLocalTesting,
              localBackendUrl,
            }),
          ),
        staleTime: 60_000,
      },
      {
        queryKey: [
          'interop',
          'chains-summary',
          'frontend',
          target.id,
          isLocalTesting ? 'local' : 'remote',
        ],
        queryFn: () =>
          fetchFrontendChains(getFrontendUrl(target.id, isLocalTesting)),
        staleTime: 60_000,
      },
    ]),
  })
  const [
    productionBackendQuery,
    productionFrontendQuery,
    stagingBackendQuery,
    stagingFrontendQuery,
  ] = queries
  const productionBackend = productionBackendQuery?.data as
    | ChainsSummaryBackendChain[]
    | undefined
  const productionFrontend = productionFrontendQuery?.data as
    | ChainsSummaryFrontendChain[]
    | undefined
  const stagingBackend = stagingBackendQuery?.data as
    | ChainsSummaryBackendChain[]
    | undefined
  const stagingFrontend = stagingFrontendQuery?.data as
    | ChainsSummaryFrontendChain[]
    | undefined

  const missingTokensQuery = api.interop.missingTokens.list.useQuery()
  const suspiciousTransfersQuery =
    api.interop.anomalies.suspiciousTransfers.useQuery()
  const aggregatesQuery = api.interop.aggregates.latest.useQuery()

  const isLoading = queries.some((query) => query.isLoading)
  const isFetching = queries.some((query) => query.isFetching)
  const errors = useMemo(() => getQueryErrors(queries), [queries])

  const rows = useMemo(
    () =>
      getChainsSummaryRows({
        productionBackend,
        productionFrontend,
        stagingBackend,
        stagingFrontend,
        missingTokens: missingTokensQuery.data,
        suspiciousTransfers: suspiciousTransfersQuery.data?.items,
        notIncludedTransfers: aggregatesQuery.data?.notIncludedTransfers,
      }),
    [
      productionBackend,
      productionFrontend,
      stagingBackend,
      stagingFrontend,
      missingTokensQuery.data,
      suspiciousTransfersQuery.data,
      aggregatesQuery.data,
    ],
  )
  const { prodOnlyCount, stagingOnlyCount, mismatchedCount } = useMemo(
    () => getSummaryStats(rows),
    [rows],
  )

  return (
    <TablePageLayout
      title="Chains summary"
      description="Interop chain enablement across production and staging frontends and backends."
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => queries.forEach((query) => void query.refetch())}
          disabled={isFetching}
        >
          <RefreshCwIcon className={isFetching ? 'animate-spin' : ''} />
          Refresh
        </Button>
      }
      summary={
        <>
          <Badge variant="secondary">{rows.length} chains</Badge>
          {isLocalTesting ? (
            <Badge variant="outline">local testing</Badge>
          ) : null}
          <Badge variant="secondary">{prodOnlyCount} prod only</Badge>
          <Badge variant="secondary">{stagingOnlyCount} staging only</Badge>
          <Badge variant="secondary">{mismatchedCount} FE/BE mismatches</Badge>
        </>
      }
    >
      {isLocalTesting ? (
        <div className="mx-6 mt-6 rounded border bg-muted px-3 py-2 text-muted-foreground text-sm">
          Local environment selected: both production and staging columns are
          fetched from the local backend ({localBackendUrl ?? 'unconfigured'})
          and the local frontend ({LOCAL_FRONTEND_URL}). Switch to staging or
          production in the environment picker to see real data.
        </div>
      ) : null}
      {isLoading ? <LoadingState className="m-6" /> : null}
      {errors.map((item) => (
        <ErrorState
          key={item.label}
          className="m-6"
          cause={`${item.label}: ${item.error.message}`}
        />
      ))}
      {!isLoading ? <ChainsSummaryTable data={rows} /> : null}
    </TablePageLayout>
  )
}
