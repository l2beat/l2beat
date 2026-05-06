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
import { KnownAppsTable } from './table/KnownAppsTable'
import type { KnownAppsRow } from './types'

function compareStrings(a: string, b: string) {
  return a.localeCompare(b, 'en', { sensitivity: 'base' })
}

function sortKnownAppsRows(rows: KnownAppsRow[]) {
  return rows
    .map((row) => ({
      ...row,
      apps: [...row.apps].sort(compareStrings),
    }))
    .sort((a, b) => compareStrings(a.plugin, b.plugin))
}

export function KnownAppsPage() {
  const { data, error, isError, isLoading, isFetching, refetch } =
    api.interop.knownApps.list.useQuery()

  const rows = sortKnownAppsRows(data ?? [])
  const totalApps = rows.reduce((sum, row) => sum + row.apps.length, 0)
  const largestPlugin = rows.reduce<KnownAppsRow | undefined>(
    (largest, row) =>
      largest === undefined || row.apps.length > largest.apps.length
        ? row
        : largest,
    undefined,
  )

  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Known apps</CardTitle>
              <CardDescription>
                Known app names grouped by plugin. Migrated from the legacy
                interop overview footer.
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
            <Badge variant="secondary">{rows.length} plugins</Badge>
            <Badge variant="secondary">{totalApps} known apps</Badge>
            {largestPlugin ? (
              <Badge variant="secondary">
                Largest: {largestPlugin.plugin} ({largestPlugin.apps.length})
              </Badge>
            ) : null}
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardContent className="px-0">
            {isLoading ? <LoadingState className="m-6" /> : null}
            {isError ? (
              <ErrorState className="m-6" cause={error.message} />
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
