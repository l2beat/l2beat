import { useQuery } from '@tanstack/react-query'
import { RefreshCwIcon } from 'lucide-react'
import { Badge } from '~/components/core/Badge'
import { Button } from '~/components/core/Button'
import { ErrorState } from '~/components/ErrorState'
import { LoadingState } from '~/components/LoadingState'
import { TablePageLayout } from '~/components/table/TablePageLayout'
import { useBackendTrpc } from '~/react-query/trpc'
import { AggregatedTransferAnomaliesTable } from './table/AggregatedTransferAnomaliesTable'
import type { AggregatedAnomalyRow, AnomaliesSummaryResponse } from './types'

export function AnomaliesPage() {
  const trpc = useBackendTrpc()
  const { data, error, isError, isLoading, isFetching, refetch } = useQuery(
    trpc.interop.anomalies.summary.queryOptions(),
  )

  const response: AnomaliesSummaryResponse | undefined = data
  const rows: AggregatedAnomalyRow[] = response?.aggregatedItems ?? []
  const idsWithSrcDstMismatch = rows.filter(
    (row) => row.srcDstDiff.isSideMismatch,
  ).length
  const aggregateSideMismatchDiffPercent =
    response?.aggregateSideMismatchDiffPercent ?? 30
  const aggregateSideMismatchMinVolumeUsd =
    response?.aggregateSideMismatchMinVolumeUsd ?? 1_000_000

  return (
    <TablePageLayout
      title="Anomalies"
      description="Aggregate alerts with readable explanations. Only aggregates with active signals are shown."
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => void refetch()}
          disabled={isFetching}
        >
          <RefreshCwIcon className={isFetching ? 'animate-spin' : ''} />
          Refresh
        </Button>
      }
      summary={
        <>
          <Badge variant="secondary">{rows.length} flagged aggregates</Badge>
          <Badge
            variant={idsWithSrcDstMismatch > 0 ? 'destructive' : 'secondary'}
          >
            {idsWithSrcDstMismatch} side mismatches
          </Badge>
          <Badge variant="secondary">
            Side mismatch: larger side {'>='} $
            {Math.round(aggregateSideMismatchMinVolumeUsd).toLocaleString()},
            both sides {'>'} $0, and diff {'>='}{' '}
            {aggregateSideMismatchDiffPercent.toFixed(0)}%
          </Badge>
        </>
      }
    >
      {isLoading ? <LoadingState className="m-6" /> : null}
      {isError ? <ErrorState className="m-6" cause={error.message} /> : null}
      {!isLoading && !isError ? (
        <AggregatedTransferAnomaliesTable data={rows} enableCsvExport />
      ) : null}
    </TablePageLayout>
  )
}
