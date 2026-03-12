import { RefreshCwIcon } from 'lucide-react'
import { useMemo } from 'react'
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
import { KnownAppsTable } from '../table/known-apps/KnownAppsTable'
import type { SummaryKnownAppsRow } from '../table/types'

export function SummaryKnownAppsPage() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    api.summary.knownApps.useQuery()

  const rows: SummaryKnownAppsRow[] = data ?? []
  const totalPluginRows = rows.length
  const totalKnownApps = rows.reduce((sum, row) => sum + row.apps.length, 0)
  const uniqueAppsCount = useMemo(
    () => new Set(rows.flatMap((row) => row.apps)).size,
    [rows],
  )

  return (
    <AppLayout className="min-h-screen">
      <div className="flex flex-col gap-4 p-4">
        <SummarySubnav />

        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Summary: Known apps</CardTitle>
              <CardDescription>
                Known message apps grouped by plugin.
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
            <Badge variant="secondary">{totalPluginRows} plugins</Badge>
            <Badge variant="secondary">{totalKnownApps} known apps</Badge>
            <Badge variant="secondary">{uniqueAppsCount} unique apps</Badge>
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardContent className="px-0">
            {isLoading ? <LoadingState className="m-6" /> : null}
            {isError ? (
              <div className="px-6 py-4 text-destructive text-sm">
                Failed to load known apps: {error.message}
              </div>
            ) : null}
            {!isLoading && !isError ? (
              <KnownAppsTable data={rows} enableCsvExport />
            ) : null}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
