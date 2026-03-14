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
import { LoadingState } from '~/components/LoadingState'
import { AppLayout } from '~/layouts/AppLayout'
import { api } from '~/react-query/trpc'
import { SummarySubnav } from '../components/SummarySubnav'
import { CoveragePieCard } from '../table/coverage-pies/CoveragePieCard'

function formatCount(value: number): string {
  return value.toLocaleString('en-US')
}

function formatGeneratedAt(timestamp: string): string {
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) {
    return timestamp
  }
  return date.toLocaleString()
}

export function SummaryCoveragePiesPage() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    api.summary.coveragePies.useQuery()

  const coverageData = data ?? null
  const charts = coverageData?.charts ?? []
  const totalEvents = charts.reduce((sum, chart) => sum + chart.totalCount, 0)
  const totalUnsupported = charts.reduce(
    (sum, chart) => sum + chart.unsupportedCount,
    0,
  )

  return (
    <AppLayout className="min-h-screen">
      <div className="flex flex-col gap-4 p-4">
        <SummarySubnav />

        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Coverage pies</CardTitle>
              <CardDescription>
                Support source of truth: <code>InteropEvent.unsupported</code>.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
              disabled={isFetching}
            >
              <RefreshCwIcon className={isFetching ? 'animate-spin' : ''} />
              Refresh
            </Button>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant="secondary">{charts.length} charts</Badge>
            <Badge variant="secondary">{formatCount(totalEvents)} events</Badge>
            <Badge variant={totalUnsupported > 0 ? 'destructive' : 'secondary'}>
              {formatCount(totalUnsupported)} unsupported
            </Badge>
            {coverageData ? (
              <Badge variant="secondary">
                Collapse threshold: {coverageData.collapseThresholdPct}%
              </Badge>
            ) : null}
            {coverageData ? (
              <Badge variant="secondary">
                Generated: {formatGeneratedAt(coverageData.generatedAt)}
              </Badge>
            ) : null}
          </CardContent>
        </Card>

        {isLoading ? <LoadingState className="m-6" /> : null}
        {isError ? (
          <div className="px-2 text-destructive text-sm">
            Failed to load coverage pies: {error.message}
          </div>
        ) : null}

        {!isLoading && !isError && coverageData ? (
          <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
            {charts.map((chart) => (
              <CoveragePieCard key={chart.id} chart={chart} />
            ))}
          </div>
        ) : null}
      </div>
    </AppLayout>
  )
}
