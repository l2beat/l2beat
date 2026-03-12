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
import { LoadingState } from '~/components/LoadingState'
import { AppLayout } from '~/layouts/AppLayout'
import { api } from '~/react-query/trpc'
import { SummarySubnav } from '../components/SummarySubnav'
import { AnomaliesTable } from '../table/anomalies/AnomaliesTable'

export function SummaryAnomaliesPage() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    api.summary.anomalies.useQuery()

  const anomaliesData = data ?? null
  const hasAnomaliesData = anomaliesData !== null
  const rows = anomaliesData?.stats ?? []
  const suspiciousTransfers = anomaliesData?.suspiciousTransfers ?? []
  const highGapCount = rows.filter((row) => row.srcDstDiff.isHigh).length

  return (
    <AppLayout className="min-h-screen">
      <div className="flex flex-col gap-4 p-4">
        <SummarySubnav />

        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Anomalies</CardTitle>
              <CardDescription>
                Aggregated transfer anomaly signals and suspicious raw
                transfers.
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
          <CardContent className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{rows.length} anomaly IDs</Badge>
            <Badge variant={highGapCount > 0 ? 'destructive' : 'secondary'}>
              {highGapCount} src/dst mismatch alerts
            </Badge>
            <Badge
              variant={
                suspiciousTransfers.length > 0 ? 'destructive' : 'secondary'
              }
            >
              {suspiciousTransfers.length} suspicious transfers
            </Badge>
            <Button variant="outline" size="sm" asChild>
              <Link to="/summary/anomalies/suspicious-transfers">
                Open suspicious transfers
              </Link>
            </Button>
          </CardContent>
        </Card>

        {isLoading ? <LoadingState className="m-6" /> : null}
        {isError ? (
          <div className="px-2 text-destructive text-sm">
            Failed to load anomalies: {error.message}
          </div>
        ) : null}

        {!isLoading && !isError && hasAnomaliesData ? (
          <Card className="gap-0">
            <CardHeader>
              <CardTitle>
                Aggregated transfer anomalies (latest per ID)
              </CardTitle>
              <CardDescription>
                Statistical signals by transfer ID with quick trend previews.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <AnomaliesTable data={rows} enableCsvExport />
            </CardContent>
          </Card>
        ) : null}
      </div>
    </AppLayout>
  )
}
