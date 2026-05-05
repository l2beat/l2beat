import { RefreshCwIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '~/components/core/Badge'
import { Button } from '~/components/core/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/core/Card'
import { ErrorState } from '~/components/ErrorState'
import { LoadingState } from '~/components/LoadingState'
import { AppLayout } from '~/layouts/AppLayout'
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
    <AppLayout>
      <div className="flex flex-col gap-4">
        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Anomalies</CardTitle>
              <CardDescription>
                Aggregate anomaly summary migrated from the legacy interop
                dashboard.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
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
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
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
              {'>'} {aggregateValueDiffAlertThresholdPercent.toFixed(2)}%
              src/dst diff alert
            </Badge>
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardContent className="px-0">
            {isLoading ? <LoadingState className="m-6" /> : null}
            {isError ? (
              <ErrorState className="m-6" cause={error.message} />
            ) : null}
            {!isLoading && !isError ? (
              <AggregatedTransferAnomaliesTable
                data={rows}
                aggregateValueDiffAlertThresholdPercent={
                  aggregateValueDiffAlertThresholdPercent
                }
                enableCsvExport
              />
            ) : null}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
