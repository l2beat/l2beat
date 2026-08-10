import { useQuery } from '@tanstack/react-query'
import { RefreshCwIcon } from 'lucide-react'
import { Badge } from '~/components/core/Badge'
import { Button } from '~/components/core/Button'
import { ErrorState } from '~/components/ErrorState'
import { LoadingState } from '~/components/LoadingState'
import { TablePageLayout } from '~/components/table/TablePageLayout'
import { useBackendTrpc } from '~/react-query/trpc'
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
  const trpc = useBackendTrpc()
  const { data, error, isError, isLoading, isFetching, refetch } = useQuery(
    trpc.interop.knownApps.list.queryOptions(),
  )

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
    <TablePageLayout
      title="Known apps"
      description="Known app names grouped by plugin. Migrated from the legacy interop overview footer."
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
          <Badge variant="secondary">{rows.length} plugins</Badge>
          <Badge variant="secondary">{totalApps} known apps</Badge>
          {largestPlugin ? (
            <Badge variant="secondary">
              Largest: {largestPlugin.plugin} ({largestPlugin.apps.length})
            </Badge>
          ) : null}
        </>
      }
    >
      {isLoading ? <LoadingState className="m-6" /> : null}
      {isError ? <ErrorState className="m-6" cause={error.message} /> : null}
      {!isLoading && !isError ? (
        <KnownAppsTable data={rows} enableCsvExport />
      ) : null}
    </TablePageLayout>
  )
}
