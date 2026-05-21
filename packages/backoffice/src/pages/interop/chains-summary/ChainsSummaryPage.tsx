import { useQuery } from '@tanstack/react-query'
import { RefreshCwIcon } from 'lucide-react'
import { useMemo } from 'react'
import { useFrontendApi } from '~/api/frontend'
import { Badge } from '~/components/core/Badge'
import { Button } from '~/components/core/Button'
import { ErrorState } from '~/components/ErrorState'
import { LoadingState } from '~/components/LoadingState'
import { TablePageLayout } from '~/components/table/TablePageLayout'
import { useBackendApi } from '~/react-query/trpc'
import { ChainsSummaryTable } from './table/ChainsSummaryTable'
import { getChainsSummaryRows, getSummaryStats } from './utils'

export function ChainsSummaryPage() {
  const api = useBackendApi()
  const productionApi = useBackendApi('production')
  const stagingApi = useBackendApi('staging')
  const productionFrontend = useFrontendApi('production')
  const stagingFrontend = useFrontendApi('staging')

  const productionBackend = productionApi.interop.chains.summary.useQuery(
    undefined,
    { staleTime: 60_000 },
  )
  const stagingBackend = stagingApi.interop.chains.summary.useQuery(undefined, {
    staleTime: 60_000,
  })
  const productionFrontendQuery = useQuery({
    queryKey: ['frontend', 'chains', 'production'],
    queryFn: () => productionFrontend.chains.getAll(),
    staleTime: 60_000,
  })
  const stagingFrontendQuery = useQuery({
    queryKey: ['frontend', 'chains', 'staging'],
    queryFn: () => stagingFrontend.chains.getAll(),
    staleTime: 60_000,
  })

  const missingTokensQuery = api.interop.missingTokens.list.useQuery()
  const suspiciousTransfersQuery =
    api.interop.anomalies.suspiciousTransfers.useQuery()
  const aggregatesQuery = api.interop.aggregates.latest.useQuery()

  const sources = [
    { label: 'Production backend', query: productionBackend },
    { label: 'Staging backend', query: stagingBackend },
    { label: 'Production frontend', query: productionFrontendQuery },
    { label: 'Staging frontend', query: stagingFrontendQuery },
  ]
  const isLoading = sources.some(({ query }) => query.isLoading)
  const isFetching = sources.some(({ query }) => query.isFetching)
  const errors = sources.flatMap(({ label, query }) =>
    query.error instanceof Error ? [{ label, error: query.error }] : [],
  )

  const refetchAll = () => {
    for (const { query } of sources) {
      void query.refetch()
    }
  }

  const rows = useMemo(
    () =>
      getChainsSummaryRows({
        productionBackend: productionBackend.data,
        productionFrontend: productionFrontendQuery.data,
        stagingBackend: stagingBackend.data,
        stagingFrontend: stagingFrontendQuery.data,
        missingTokens: missingTokensQuery.data,
        suspiciousTransfers: suspiciousTransfersQuery.data?.items,
        notIncludedTransfers: aggregatesQuery.data?.notIncludedTransfers,
      }),
    [
      productionBackend.data,
      productionFrontendQuery.data,
      stagingBackend.data,
      stagingFrontendQuery.data,
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
          onClick={refetchAll}
          disabled={isFetching}
        >
          <RefreshCwIcon className={isFetching ? 'animate-spin' : ''} />
          Refresh
        </Button>
      }
      summary={
        <>
          <Badge variant="secondary">{rows.length} chains</Badge>
          <Badge variant="secondary">{prodOnlyCount} prod only</Badge>
          <Badge variant="secondary">{stagingOnlyCount} staging only</Badge>
          <Badge variant="secondary">{mismatchedCount} FE/BE mismatches</Badge>
        </>
      }
    >
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
