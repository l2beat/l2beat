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
import { ErrorState } from '~/components/ErrorState'
import { LoadingState } from '~/components/LoadingState'
import { AppLayout } from '~/layouts/AppLayout'
import { formatDollars } from '~/pages/interop/transfers/utils'
import { api } from '~/react-query/trpc'
import { AggregateSeriesCharts } from './charts/AggregateSeriesCharts'
import type { AggregateDetailsInput, AggregateSeriesPoint } from './types'
import { decodeRouteParam } from './utils'

export function AnomalyDetailsPage() {
  const params = useParams<{ id: string }>()
  const id = decodeRouteParam(params.id)
  const hasValidParams = id !== undefined

  const detailsInput: AggregateDetailsInput = hasValidParams
    ? { id }
    : { id: '' }

  const { data, error, isError, isLoading, isFetching, refetch } =
    api.interop.anomalies.aggregateDetails.useQuery(detailsInput, {
      enabled: hasValidParams,
    })

  const rows: AggregateSeriesPoint[] = data?.items ?? []
  const latestPoint = rows.at(-1)

  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Aggregate anomaly detail</CardTitle>
              <CardDescription>
                Daily aggregate charts for a single anomaly ID from the legacy
                anomalies summary.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/interop/insights/anomalies">
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
            <Badge variant="secondary">{rows.length} daily points</Badge>
            <Badge variant="secondary">
              Latest count: {latestPoint?.transferCount.toLocaleString() ?? '-'}
            </Badge>
            <Badge variant="secondary">
              Latest avg duration:{' '}
              {latestPoint?.avgDuration != null
                ? `${latestPoint.avgDuration.toFixed(1)}s`
                : '-'}
            </Badge>
            <Badge variant="secondary">
              Latest source value:{' '}
              {latestPoint ? formatDollars(latestPoint.totalSrcValueUsd) : '-'}
            </Badge>
            <Badge variant="secondary">
              Latest destination value:{' '}
              {latestPoint ? formatDollars(latestPoint.totalDstValueUsd) : '-'}
            </Badge>
          </CardContent>
        </Card>

        {!hasValidParams ? (
          <Card className="gap-0 py-0">
            <CardContent className="px-0">
              <ErrorState
                className="m-6"
                cause="Invalid route. Expected /insights/anomalies/aggregate/:id."
              />
            </CardContent>
          </Card>
        ) : null}

        {hasValidParams && isLoading ? <LoadingState className="m-6" /> : null}

        {hasValidParams && isError ? (
          <ErrorState className="m-6" cause={error.message} />
        ) : null}

        {hasValidParams && !isLoading && !isError ? (
          <AggregateSeriesCharts
            data={rows}
            emptyMessage="No aggregate series was found for the selected anomaly ID."
          />
        ) : null}
      </div>
    </AppLayout>
  )
}
