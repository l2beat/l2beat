import { ChevronLeftIcon, RefreshCwIcon } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Badge } from '~/components/core/Badge'
import { Button } from '~/components/core/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/core/Card'
import { LoadingState } from '~/components/LoadingState'
import { AppLayout } from '~/layouts/AppLayout'
import { api } from '~/react-query/trpc'
import { SummarySubnav } from '../components/SummarySubnav'
import { decodeRouteParam } from '../table/anomalies/utils'
import { AnomalySeriesTable } from '../table/anomaly-series/AnomalySeriesTable'
import { SeriesLineChart } from '../table/anomaly-series/SeriesLineChart'
import {
  formatAvgDuration,
  formatSeriesTimestamp,
} from '../table/anomaly-series/utils'

export function SummaryAnomalyDetailsPage() {
  const params = useParams<{ id: string }>()
  const id = decodeRouteParam(params.id)
  const hasValidParams = id !== undefined

  const { data, isLoading, isError, error, refetch, isFetching } =
    api.summary.anomalySeries.useQuery(
      {
        id: id ?? '',
      },
      {
        enabled: hasValidParams,
      },
    )

  const points = data?.points ?? []
  const labels = points.map((point) => formatSeriesTimestamp(point.timestamp))
  const countValues = points.map((point) => point.transferCount)
  const avgDurationValues = points.map(
    (point) =>
      formatAvgDuration(point.totalDurationSum, point.transferCount) ?? 0,
  )
  const srcVolumeValues = points.map((point) => point.totalSrcValueUsd)
  const dstVolumeValues = points.map((point) => point.totalDstValueUsd)

  return (
    <AppLayout className="min-h-screen">
      <div className="flex flex-col gap-4 p-4">
        <SummarySubnav />

        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Anomaly details</CardTitle>
              <CardDescription>
                Daily time series for transfer ID {id ?? '(invalid route)'}.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/summary/anomalies">
                  <ChevronLeftIcon />
                  Back to anomalies
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void refetch()}
                disabled={!hasValidParams || isFetching}
              >
                <RefreshCwIcon className={isFetching ? 'animate-spin' : ''} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant={hasValidParams ? 'secondary' : 'destructive'}>
              ID: {id ?? 'invalid route'}
            </Badge>
            <Badge variant="secondary">{points.length} daily points</Badge>
          </CardContent>
        </Card>

        {!hasValidParams ? (
          <div className="px-2 text-destructive text-sm">
            Invalid route. Expected: /interop/anomalies/:id.
          </div>
        ) : null}
        {hasValidParams && isLoading ? <LoadingState className="m-6" /> : null}
        {hasValidParams && isError ? (
          <div className="px-2 text-destructive text-sm">
            Failed to load anomaly details: {error.message}
          </div>
        ) : null}

        {hasValidParams && !isLoading && !isError ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Trend charts</CardTitle>
                <CardDescription>
                  Count, duration, and volume trends across available days.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <SeriesLineChart
                  title="Transfer count"
                  labels={labels}
                  series={[
                    {
                      label: 'Count',
                      values: countValues,
                      color: '#2563eb',
                    },
                  ]}
                />
                <SeriesLineChart
                  title="Average transfer duration (s)"
                  labels={labels}
                  series={[
                    {
                      label: 'Avg duration',
                      values: avgDurationValues,
                      color: '#16a34a',
                    },
                  ]}
                />
                <SeriesLineChart
                  title="Volume (USD)"
                  labels={labels}
                  series={[
                    {
                      label: 'Src volume',
                      values: srcVolumeValues,
                      color: '#7c3aed',
                    },
                    {
                      label: 'Dst volume',
                      values: dstVolumeValues,
                      color: '#f97316',
                    },
                  ]}
                />
              </CardContent>
            </Card>

            <Card className="gap-0 py-0">
              <CardHeader>
                <CardTitle>Daily series table</CardTitle>
                <CardDescription>
                  Export-ready daily values for this anomaly ID.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <AnomalySeriesTable data={points} enableCsvExport />
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </AppLayout>
  )
}
