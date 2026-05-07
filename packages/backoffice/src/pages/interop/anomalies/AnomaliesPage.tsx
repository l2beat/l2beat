import { RefreshCwIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '~/components/core/Badge'
import { Button } from '~/components/core/Button'
import { ErrorState } from '~/components/ErrorState'
import { LoadingState } from '~/components/LoadingState'
import { TablePageLayout } from '~/components/table/TablePageLayout'
import { api } from '~/react-query/trpc'
import { AggregatedTransferAnomaliesTable } from './table/AggregatedTransferAnomaliesTable'
import type { AggregatedAnomalyRow, AnomaliesSummaryResponse } from './types'

export function AnomaliesPage() {
  const { data, error, isError, isLoading, isFetching, refetch } =
    api.interop.anomalies.summary.useQuery()

  const response: AnomaliesSummaryResponse | undefined = data
  const rows: AggregatedAnomalyRow[] = response?.aggregatedItems ?? []
  const aggregateValueDiffAlertThresholdPercent =
    response?.aggregateValueDiffAlertThresholdPercent ?? 5
  const idsWithInterpretation = rows.filter(
    (row) => row.interpretation.length > 0,
  ).length
  const idsWithSrcDstMismatch = rows.filter(
    (row) => row.srcDstDiff.isHigh,
  ).length

  return (
    <TablePageLayout
      title="Anomalies"
      description="Aggregate anomaly summary migrated from the legacy interop dashboard."
      actions={
        <>
          <Button asChild variant="outline" size="sm">
            <Link to="/interop/insights/anomalies/explorer">
              Open graph explorer
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
            disabled={isFetching}
          >
            <RefreshCwIcon className={isFetching ? 'animate-spin' : ''} />
            Refresh
          </Button>
        </>
      }
      summary={
        <>
          <Badge variant="secondary">{rows.length} aggregate IDs</Badge>
          <Badge variant="secondary">
            {idsWithInterpretation} interpreted anomalies
          </Badge>
          <Badge
            variant={idsWithSrcDstMismatch > 0 ? 'destructive' : 'secondary'}
          >
            {idsWithSrcDstMismatch} src/dst mismatches
          </Badge>
          <Badge variant="secondary">
            {'>'} {aggregateValueDiffAlertThresholdPercent.toFixed(2)}% src/dst
            diff alert
          </Badge>
        </>
      }
    >
      {isLoading ? <LoadingState className="m-6" /> : null}
      {isError ? <ErrorState className="m-6" cause={error.message} /> : null}
      {!isLoading && !isError ? (
        <AggregatedTransferAnomaliesTable
          data={rows}
          aggregateValueDiffAlertThresholdPercent={
            aggregateValueDiffAlertThresholdPercent
          }
          enableCsvExport
        />
      ) : null}
    </TablePageLayout>
  )
}
