import { RefreshCwIcon } from 'lucide-react'
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
  const idsWithSrcDstMismatch = rows.filter(
    (row) => row.srcDstDiff.isSideMismatch,
  ).length
  const aggregateSideMismatchDiffPercent =
    response?.aggregateSideMismatchDiffPercent ?? 30
  const aggregateSideMismatchMinVolumeUsd =
    response?.aggregateSideMismatchMinVolumeUsd ?? 1_000_000

  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Anomalies</CardTitle>
              <CardDescription>
                Aggregate alerts with readable explanations. Only aggregates
                with active signals are shown.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
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
            <Badge variant="secondary">{rows.length} flagged aggregates</Badge>
            <Badge
              variant={idsWithSrcDstMismatch > 0 ? 'destructive' : 'secondary'}
            >
              {idsWithSrcDstMismatch} side mismatches
            </Badge>
            <Badge variant="secondary">
              Side mismatch: both sides {'>='} $
              {Math.round(aggregateSideMismatchMinVolumeUsd).toLocaleString()}{' '}
              and diff {'>='} {aggregateSideMismatchDiffPercent.toFixed(0)}%
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
              <AggregatedTransferAnomaliesTable data={rows} enableCsvExport />
            ) : null}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
